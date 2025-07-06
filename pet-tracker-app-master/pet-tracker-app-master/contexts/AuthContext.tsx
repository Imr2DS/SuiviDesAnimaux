import { Session } from "@supabase/supabase-js";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Database, supabase } from "../lib/supabase";

type User = Database["public"]["Tables"]["users"]["Row"];

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: Partial<User>
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development
const MOCK_USER: User = {
  id: "mock-user-id",
  email: "dev@example.com",
  address: "123 Dev Street",
  mobile: "+33612345678",
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthDisabled = Constants.expoConfig?.extra?.disableAuth === true;

  useEffect(() => {
    if (isAuthDisabled) {
      // If auth is disabled, set mock session and user
      setSession({ user: { id: MOCK_USER.id } } as Session);
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id);
      }
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUser(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isAuthDisabled]);

  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (isAuthDisabled) {
      setSession({ user: { id: MOCK_USER.id } } as Session);
      setUser(MOCK_USER);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ) => {
    if (isAuthDisabled) {
      setSession({ user: { id: MOCK_USER.id } } as Session);
      setUser(MOCK_USER);
      return;
    }

    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error("No user returned from sign up");

      // First try to update the user record if it exists
      const { error: updateError } = await supabase
        .from("users")
        .update({ email, ...userData })
        .eq("id", user.id);

      // If update fails (user doesn't exist), create new user record
      if (updateError) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([{ id: user.id, email, ...userData }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (isAuthDisabled) {
      setSession(null);
      setUser(null);
      router.push("/login");
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
