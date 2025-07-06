import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";
import "react-native-url-polyfill/auto";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl ?? "";
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          cin: string;
          address: string;
          mobile: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string;
          cin?: string;
          address?: string;
          mobile?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          cin?: string;
          address?: string;
          mobile?: string;
          created_at?: string;
        };
      };
      animals: {
        Row: {
          birthplace: any;
          image: any;
          id: string;
          nfc_id: string;
          name: string;
          birthdate: string;
          race: string;
          gender: "male" | "female";
          owner_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nfc_id: string;
          name: string;
          birthdate: string;
          race: string;
          gender: "male" | "female";
          owner_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nfc_id?: string;
          name?: string;
          birthdate?: string;
          race?: string;
          gender?: "male" | "female";
          owner_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
