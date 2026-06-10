import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("galleryUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  async function login(email, password) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem("galleryToken", data.token);
    localStorage.setItem("galleryUser", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function register(payload) {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    localStorage.setItem("galleryToken", data.token);
    localStorage.setItem("galleryUser", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("galleryToken");
    localStorage.removeItem("galleryUser");
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
