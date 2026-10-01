"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLogout } from "@/api/hooks/auth/hooks";
import { getToken } from "@/lib/functions/auth.lib";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  isLoggingOut: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "uptechz_admin_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    // Hydrate user from localStorage if token exists
    const token = getToken();
    if (token) {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        try {
          setUserState(JSON.parse(stored));
        } catch {
          localStorage.removeItem(USER_STORAGE_KEY);
        }
      }
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
      setUserState(null);
    }
  }, []);

  const setUser = (newUser: AuthUser | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    logoutMutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
        isLoggingOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
