"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://backend-adyb.onrender.com/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.msg || "Error al registrar usuario");
      return;
    }

    router.push("/users"); // o "/login"
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="full_name"
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Correo"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
