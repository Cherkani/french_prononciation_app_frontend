import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { SupabaseContext } from "./SupabaseContext";

// ...existing code...

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

type SupabaseProviderProps = {
  children: JSX.Element | JSX.Element[];
};

export const SupabaseProvider = (props: SupabaseProviderProps) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isNavigationReady, setNavigationReady] = useState(false);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    }
  );

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setLoggedIn(true);
  };

  const register = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const forgotPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setLoggedIn(false);
  };

  const checkIfUserIsLoggedIn = async () => {
    const result = await supabase.auth.getSession();
    setLoggedIn(result.data.session !== null);
    setNavigationReady(true);
  };

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{ isLoggedIn, login, register, forgotPassword, logout }}
    >
      {isNavigationReady ? props.children : null}
    </SupabaseContext.Provider>
  );
};
