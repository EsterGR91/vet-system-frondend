"use client";
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // =========================
  // REGISTRO
  // =========================
  const register = async (full_name, email, password) => {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: full_name, // 🔥 CLAVE
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Error al registrar");
    }

    return data;
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (email, password) => {
    const res = await fetch("https://backend-adyb.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.msg || "Error al iniciar sesión");
    }

    localStorage.setItem("token", data.token);
    setUser(data.user);

    return data;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
