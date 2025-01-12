import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gsczqwlavnrthmrjhxxk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzY3pxd2xhdm5ydGhtcmpoeHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2Mjg0OTAsImV4cCI6MjA1MjIwNDQ5MH0.l6gefouMZq2roXAwWzvyj7Mey99hXK0012WJKKbcOlo";

console.log("Creating Supabase client...");
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
console.log("Supabase client created:", supabase);
