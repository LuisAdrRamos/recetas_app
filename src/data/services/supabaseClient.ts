import { createClient } from '@supabase/supabase-js';
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { decode } from "react-native-base64";

if (typeof global.atob === 'undefined') {
    global.atob = decode;
}

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
        "ERROR: Faltan variables de entorno.\n\n" +
        "Asegúrate de tener un archivo .env con:\n" +
        "- EXPO_PUBLIC_SUPABASE_URL\n" +
        "- EXPO_PUBLIC_SUPABASE_ANON_KEY\n\n" +
        "Revisa .env.example para ver el formato correcto."
    );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});

