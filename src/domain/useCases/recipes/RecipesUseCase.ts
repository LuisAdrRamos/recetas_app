import * as ImagePicker from "expo-image-picker";
// Importamos la versión "legacy" para 'readAsStringAsync'
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "@/src/data/services/supabaseClient";
import { Receta } from "../../models/Receta";

// --- CONFIGURACIÓN DE CLOUDINARY (CORREGIDA) ---
// 1. Leemos las variables de entorno con el prefijo EXPO_PUBLIC_
const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// 2. Construimos la URL de subida correcta manualmente
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// ---------------------------------

/**
 * RecipesUseCase - Caso de Uso de Recetas
 * (El resto de las funciones no cambian)
 */
export class RecipesUseCase {
    /**
     * Obtener todas las recetas ordenadas por más recientes
     */
    async obtenerRecetas(): Promise<Receta[]> {
        // ... (código sin cambios)
        const { data, error } = await supabase
            .from("recetas")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error al obtener recetas:", error);
            return [];
        }

        return data as Receta[];
    }

    /**
     * Buscar recetas que contengan un ingrediente específico
     */
    async buscarPorIngrediente(ingrediente: string): Promise<Receta[]> {
        // ... (código sin cambios)
        const { data, error } = await supabase
            .from("recetas")
            .select("*")
            .contains("ingredientes", [ingrediente.toLowerCase()])
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error en búsqueda:", error);
            return [];
        }

        return data as Receta[];
    }

    /**
     * Crear nueva receta
     */
    async crearReceta(
        // ... (código sin cambios)
        titulo: string,
        descripcion: string,
        ingredientes: string[],
        chefId: string,
        imagenUri?: string
    ) {
        try {
            let imagenUrl: string | null = null;
            if (imagenUri) {
                imagenUrl = await this.subirImagen(imagenUri);
            }
            const { data, error } = await supabase
                .from("recetas")
                .insert({
                    titulo,
                    descripcion,
                    ingredientes,
                    chef_id: chefId,
                    imagen_url: imagenUrl,
                })
                .select()
                .single();
            if (error) throw error;
            return { success: true, receta: data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * (RETO 2) Actualizar receta existente
     */
    async actualizarReceta(
        // ... (código sin cambios)
        id: string,
        titulo: string,
        descripcion: string,
        ingredientes: string[],
        imagenUri?: string
    ) {
        try {
            let datosActualizados: any = {
                titulo,
                descripcion,
                ingredientes,
            };
            if (imagenUri) {
                const nuevaImagenUrl = await this.subirImagen(imagenUri);
                datosActualizados.imagen_url = nuevaImagenUrl;
            }
            const { data, error } = await supabase
                .from("recetas")
                .update(datosActualizados)
                .eq("id", id)
                .select()
                .single();
            if (error) throw error;
            return { success: true, receta: data };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    /**
     * Eliminar receta
     */
    async eliminarReceta(id: string) {
        // ... (código sin cambios)
        try {
            const { error } = await supabase.from("recetas").delete().eq("id", id);
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    //
    // --- ESTA ES LA FUNCIÓN REEMPLAZADA (VERSIÓN CLOUDINARY) ---
    //
    /**
     * Subir imagen a Cloudinary usando su REST API (unsigned)
     *
     * @param uri - URI local de la imagen
     * @returns URL pública (secure_url) de la imagen subida
     */
    private async subirImagen(uri: string): Promise<string> {
        try {
            // 1. Crear el objeto FormData
            const formData = new FormData();

            // 2. Adjuntar el archivo.
            // Cloudinary es inteligente y puede manejar la URI local.
            formData.append("file", {
                uri: uri,
                type: "image/jpeg", // El tipo es importante
                name: uri.split("/").pop(), // Nombre del archivo
            } as any);

            // 3. Adjuntar el preset de subida (leído desde .env)
            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);

            // 4. Realizar la subida con fetch (a la URL construida)
            const response = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // 5. Obtener la respuesta
            const data = await response.json();

            if (response.ok) {
                // 6. Devolver la URL segura de Cloudinary
                return data.secure_url;
            } else {
                // Si Cloudinary da un error (ej: preset incorrecto)
                throw new Error(data.error.message || "Error al subir a Cloudinary");
            }
        } catch (error: any) {
            console.error("Error al subir imagen a Cloudinary:", error.message);
            throw error;
        }
    }

    /**
     * Seleccionar imagen de la galería
     */
    async seleccionarImagen(): Promise<string | null> {
        // ... (código sin cambios)
        try {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Necesitamos permisos para acceder a tus fotos");
                return null;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled) {
                return result.assets[0].uri;
            }
            return null;
        } catch (error) {
            console.error("Error al seleccionar imagen:", error);
            return null;
        }
    }

    /**
     * (RETO 3) Tomar foto con la cámara
     */
    async tomarFoto(): Promise<string | null> {
        // ... (código sin cambios)
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                alert("Necesitamos permisos para acceder a la cámara");
                return null;
            }
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });
            if (!result.canceled) {
                return result.assets[0].uri;
            }
            return null;
        } catch (error) {
            console.error("Error al tomar foto:", error);
            return null;
        }
    }
}