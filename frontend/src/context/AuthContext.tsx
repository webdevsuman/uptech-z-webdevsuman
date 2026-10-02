"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IUser, UserRole } from "@/typescript/interface/auth.interface";
import { getToken } from "@/lib/token.lib";
import { useLogout } from "@/api/hooks/auth/hooks";
import { USER_STORAGE_KEY } from "@/config/constants";

interface AuthContextType {
  user: IUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
    setIsLoading(false);
  }, []);

  const setUser = (newUser: IUser | null) => {
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
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        isLoggingOut,
        setUser,
        logout,
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

export default AuthContext;
