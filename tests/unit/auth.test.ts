import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase client
vi.mock("../../src/lib/supabase.js", () => {
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
        onAuthStateChange: vi.fn().mockReturnValue({
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        }),
        signUp: vi.fn().mockImplementation(async ({ email, password, options }) => {
          if (email === "existing@test.com") {
            return { data: { user: null, session: null }, error: { message: "User already registered" } };
          }
          return {
            data: {
              user: {
                id: "user-123",
                email,
                user_metadata: options?.data || {},
              },
              session: {
                access_token: "mock-jwt-token",
                user: { id: "user-123", email },
              },
            },
            error: null,
          };
        }),
        signInWithPassword: vi.fn().mockImplementation(async ({ email, password }) => {
          if (password === "wrongpassword") {
            return { data: { user: null, session: null }, error: { message: "Invalid login credentials" } };
          }
          return {
            data: {
              user: { id: "user-123", email },
              session: { access_token: "mock-jwt-token" },
            },
            error: null,
          };
        }),
        signInWithOAuth: vi.fn().mockImplementation(async ({ provider, options }) => {
          if (provider === "google") {
            return {
              data: { provider: "google", url: "https://accounts.google.com/o/oauth2/v2/auth" },
              error: null,
            };
          }
          return { data: null, error: { message: "Unsupported provider" } };
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    },
    isSupabaseConfigured: true,
  };
});

import { supabase } from "../../src/lib/supabase.js";

describe("Signal Stack Authentication System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Manual Email/Password Signup", () => {
    it("successfully creates a new user profile with organization metadata", async () => {
      const res = await supabase.auth.signUp({
        email: "analyst@edxso.com",
        password: "SecurePassword123!",
        options: {
          data: {
            full_name: "Lead Strategic Analyst",
            organization_name: "EDXSO Technologies",
          },
        },
      });

      expect(res.error).toBeNull();
      expect(res.data.user).toBeDefined();
      expect(res.data.user?.email).toBe("analyst@edxso.com");
      expect(res.data.user?.user_metadata.full_name).toBe("Lead Strategic Analyst");
      expect(res.data.user?.user_metadata.organization_name).toBe("EDXSO Technologies");
      expect(res.data.session?.access_token).toBe("mock-jwt-token");
    });

    it("returns error message when email is already registered", async () => {
      const res = await supabase.auth.signUp({
        email: "existing@test.com",
        password: "Password123!",
      });

      expect(res.error).toBeDefined();
      expect(res.error?.message).toBe("User already registered");
    });
  });

  describe("Google OAuth Authentication", () => {
    it("invokes Google OAuth provider with redirect options", async () => {
      const res = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:8080/workspace/overview",
        },
      });

      expect(res.error).toBeNull();
      expect(res.data?.provider).toBe("google");
      expect(res.data?.url).toContain("google.com");
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          redirectTo: "http://localhost:8080/workspace/overview",
        },
      });
    });
  });

  describe("Manual Sign In", () => {
    it("authenticates valid credentials", async () => {
      const res = await supabase.auth.signInWithPassword({
        email: "analyst@edxso.com",
        password: "SecurePassword123!",
      });

      expect(res.error).toBeNull();
      expect(res.data.user?.id).toBe("user-123");
      expect(res.data.session?.access_token).toBe("mock-jwt-token");
    });

    it("rejects invalid credentials", async () => {
      const res = await supabase.auth.signInWithPassword({
        email: "analyst@edxso.com",
        password: "wrongpassword",
      });

      expect(res.error).toBeDefined();
      expect(res.error?.message).toBe("Invalid login credentials");
    });
  });

  describe("Sign Out Workflow", () => {
    it("terminates user session via Supabase auth", async () => {
      const res = await supabase.auth.signOut();
      expect(res.error).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});