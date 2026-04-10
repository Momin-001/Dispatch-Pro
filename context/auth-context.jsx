"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

const AuthContext = createContext(null);

const DASHBOARD_ROUTES = {
  admin: "/admin",
  driver: "/driver",
  dispatcher: "/dispatcher",
  shipper: "/shipper",
  owner_operator: "/owner_operator",
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me", { silent: true }); // 👈 add this
      setUser(data.data.user);
      setPermissions(data.data.permissions);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setPermissions([]);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data.data.user);
      setPermissions(data.data.permissions);
      setIsAuthenticated(true);

      const role = data.data.user.role;
      const dashboardPath = DASHBOARD_ROUTES[role] || "/";
      router.push(dashboardPath);

      return data;
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Logout even if API fails
    }
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
    router.push("/signin");
  }, [router]);

  const hasPermission = useCallback(
    (permissionKey) => permissions.includes(permissionKey),
    [permissions]
  );

  const value = {
    user,
    permissions,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
