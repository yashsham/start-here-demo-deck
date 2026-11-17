import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  organizationName?: string | undefined;
  avatarUrl?: string | undefined;
  role?: string | undefined;
  isDemo?: boolean | undefined;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  session: Session | null;
  isLoading: boolean;
  isDemoUser: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata: { fullName: string; organizationName?: string | undefined }
  ) => Promise<{ success: boolean; error?: string; requiresEmailConfirmation?: boolean }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInAsDemoUser: (
    fullName?: string,
    email?: string,
    organizationName?: string
  ) => void;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    fullName?: string | undefined;
    organizationName?: string | undefined;
    avatarUrl?: string | undefined;
  }) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = "signal_stack_demo_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoUser, setIsDemoUser] = useState<boolean>(false);

  // Initialize session from Supabase or local storage demo user
  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session) {
            if (isMounted) {
              setSession(data.session);
              setUser(data.session.user);
              setProfile({
                id: data.session.user.id,
                email: data.session.user.email || "",
                fullName:
                  data.session.user.user_metadata?.["full_name"] ||
                  data.session.user.email?.split("@")[0] ||
                  "Intelligence Analyst",
                organizationName:
                  data.session.user.user_metadata?.["organization_name"] || "EDXSO Technologies",
                avatarUrl: data.session.user.user_metadata?.["avatar_url"],
                role: "owner",
                isDemo: false,
              });
              setIsDemoUser(false);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Supabase auth session fetch error, checking demo session:", err);
      }

      // Check if a demo user was previously activated in local storage
      if (typeof window !== "undefined") {
        try {
          const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
          if (savedDemo) {
            const parsed = JSON.parse(savedDemo) as UserProfileData;
            if (isMounted) {
              setProfile(parsed);
              setIsDemoUser(true);
            }
          }
        } catch {
          // ignore localStorage parsing errors
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    void initializeAuth();

    // Listen for Supabase auth state changes
    let subscription: { unsubscribe: () => void } | null = null;
    try {
      if (isSupabaseConfigured) {
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            if (!isMounted) return;
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSession?.user) {
              setProfile({
                id: newSession.user.id,
                email: newSession.user.email || "",
                fullName:
                  newSession.user.user_metadata?.["full_name"] ||
                  newSession.user.email?.split("@")[0] ||
                  "Intelligence Analyst",
                organizationName:
                  newSession.user.user_metadata?.["organization_name"] || "EDXSO Technologies",
                avatarUrl: newSession.user.user_metadata?.["avatar_url"],
                role: "owner",
                isDemo: false,
              });
              setIsDemoUser(false);
              if (typeof window !== "undefined") {
                localStorage.removeItem(DEMO_USER_STORAGE_KEY);
              }
            } else if (!isDemoUser) {
              setProfile(null);
            }
            setIsLoading(false);
          }
        );
        subscription = authListener.subscription;
      }
    } catch (err) {
      console.warn("Could not register onAuthStateChange listener:", err);
    }

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      metadata: { fullName: string; organizationName?: string | undefined }
    ) => {
      setIsLoading(true);
      try {
        const options: any = {
          data: {
            full_name: metadata.fullName,
            organization_name: metadata.organizationName || "Signal Stack Enterprise",
          },
        };
        if (typeof window !== "undefined") {
          options.emailRedirectTo = `${window.location.origin}/workspace/overview`;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        const isConfirmationRequired = !data.session;
        if (data.user && data.session) {
          setUser(data.user);
          setSession(data.session);
          setProfile({
            id: data.user.id,
            email: data.user.email || email,
            fullName: metadata.fullName,
            organizationName: metadata.organizationName || "Signal Stack Enterprise",
            role: "owner",
            isDemo: false,
          });
          setIsDemoUser(false);
        }

        setIsLoading(false);
        return {
          success: true,
          requiresEmailConfirmation: isConfirmationRequired,
        };
      } catch (err: any) {
        setIsLoading(false);
        return {
          success: false,
          error: err?.message || "Failed to sign up. Please try again or use demo mode.",
        };
      }
    },
    []
  );

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        setUser(data.user);
        setSession(data.session);
        setProfile({
          id: data.user.id,
          email: data.user.email || email,
          fullName:
            data.user.user_metadata?.["full_name"] ||
            email.split("@")[0] ||
            "Intelligence Analyst",
          organizationName:
            data.user.user_metadata?.["organization_name"] || "EDXSO Technologies",
          avatarUrl: data.user.user_metadata?.["avatar_url"],
          role: "owner",
          isDemo: false,
        });
        setIsDemoUser(false);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err?.message || "Failed to sign in. Please verify your credentials.",
      };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const options: any = {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      };
      if (typeof window !== "undefined") {
        options.redirectTo = `${window.location.origin}/workspace/overview`;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Browser will redirect to Google OAuth flow
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error:
          err?.message ||
          "Google authentication could not be initialized. Please check provider configuration.",
      };
    }
  }, []);

  const signInAsDemoUser = useCallback(
    (
      fullName = "Alex Kim",
      email = "analyst@edxso.com",
      organizationName = "EDXSO Technologies"
    ) => {
      const demoProfile: UserProfileData = {
        id: "demo-user-00000000-0001",
        email,
        fullName,
        organizationName,
        role: "owner",
        isDemo: true,
      };
      setProfile(demoProfile);
      setIsDemoUser(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoProfile));
        } catch {
          // ignore
        }
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsDemoUser(false);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: {
      fullName?: string | undefined;
      organizationName?: string | undefined;
      avatarUrl?: string | undefined;
    }) => {
      try {
        if (!profile && !user) {
          return { success: false, error: "No authenticated user session" };
        }

        const updatedProfile: UserProfileData = {
          id: profile?.id || user?.id || "user",
          email: profile?.email || user?.email || "",
          fullName: updates.fullName !== undefined ? updates.fullName : (profile?.fullName || "Analyst"),
          organizationName:
            updates.organizationName !== undefined
              ? updates.organizationName
              : (profile?.organizationName || "Signal Stack Organization"),
          avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : profile?.avatarUrl,
          role: profile?.role || "owner",
          isDemo: profile?.isDemo ?? isDemoUser,
        };

        setProfile(updatedProfile);

        // Persist demo profile locally
        if (updatedProfile.isDemo && typeof window !== "undefined") {
          try {
            localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updatedProfile));
          } catch {
            // ignore
          }
        }

        // Persist Supabase profile in auth metadata and database
        if (isSupabaseConfigured && user) {
          try {
            await supabase.auth.updateUser({
              data: {
                full_name: updatedProfile.fullName,
                organization_name: updatedProfile.organizationName,
                avatar_url: updatedProfile.avatarUrl,
              },
            });

            await supabase.from("user_profiles").upsert(
              {
                id: user.id,
                full_name: updatedProfile.fullName,
                avatar_url: updatedProfile.avatarUrl,
                email: user.email || updatedProfile.email,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "id" }
            );
          } catch (supaErr) {
            console.warn("Supabase profile sync notice:", supaErr);
          }
        }

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || "Failed to update profile" };
      }
    },
    [profile, user, isDemoUser]
  );

  const contextValue = useMemo(
    () => ({
      user,
      profile,
      session,
      isLoading,
      isDemoUser,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signInAsDemoUser,
      signOut,
      updateProfile,
    }),
    [
      user,
      profile,
      session,
      isLoading,
      isDemoUser,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signInAsDemoUser,
      signOut,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}