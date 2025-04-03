"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";
import { LoginService } from "../services/LoginService";
import { ISignUpResponse } from "../dao";
import { toast } from "react-hot-toast";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  logIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  logOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data, status } = useSession();

  useEffect(() => {
    if (data?.userId && data.user) {
      setUser({ email: data.user.email!, id: data.userId });
    }
    setLoading(status === "loading");
  }, [data, status]);

  const logIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/home",
      });

      if (res?.error) {
        toast.error(res.error);
        throw new Error(res.error);
      }

      if (res?.ok) {
        toast.success(`Welcome back, ${email}!`);
      }
    } catch (error) {
      toast.error("Error signing in. Please try again.");
      throw new Error("Login Failed. Please try again.");
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const response: ISignUpResponse | null = await LoginService.signUp(
      email,
      password
    );
    if (response) {
      response.result
        ? toast.success(`Account created successfully. Welcome, ${email}!`)
        : toast.error(response.message || "Account creation failed.");
    } else {
      toast.error("Error creating account. Please try again.");
    }
    return !!response?.result;
  }, []);

  const logOut = useCallback(async () => {
    await signOut({ callbackUrl: "/", redirect: true });
    toast.success("You have been signed out successfully.");
  }, []);

  return (
    <AuthContext.Provider value={{ user, logIn, signUp, logOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthActionsProvider>{children}</AuthActionsProvider>
    </SessionProvider>
  );
}
