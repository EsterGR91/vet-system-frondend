"use client";

import { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "STAFF",
    is_active: 1,
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ===============================
  // 🔄 Cargar usuarios (VERSIÓN CORRECTA)
  // ===============================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/user");
        setUsers(res.data);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar usuarios");
      }
    };

    fetchUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios");
    }
  };

  // ===============================
  // ✍️ Manejar cambios
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "is_active" ? Number(value) : value,
    });
  };

  // ===============================
  // 💾 Guardar o actualizar
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/user/${editId}`, form);
      } else {
        await api.post("/api/user", form);
      }

      setForm({
        full_name: "",
        email: "",
        password: "",
        role: "STAFF",
        is_active: 1,
      });

      setEditId(null);
      loadUsers();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setError("Error al guardar usuario");
    }
  };

  // ===============================
  // ✏️ Editar
  // ===============================
  const handleEdit = (user) => {
    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password: "",
      role: user.role || "STAFF",
      is_active: user.is_active ?? 1,
    });

    setEditId(user._id);
  };

  // ===============================
  // ❌ Eliminar
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/user/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("Error al eliminar usuario");
    }
  };

  // ===============================
  // 🔍 Filtrar
  // ===============================
  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        👩‍💻 Gestión de Usuarios
      </h1>

      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6 font-semibold"
      >
        ← Volver al Dashboard
      </Button>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* FORMULARIO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Editar Usuario" : "Registrar Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="full_name"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />

          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required={!editId}
            className="p-2 rounded border border-[#A6C48A]"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          >
            <option value="ADMIN">Administrador</option>
            <option value="STAFF">Staff</option>
          </select>

          <select
            name="is_active"
            value={form.is_active}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>

          <Button
            type="submit"
            className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2"
          >
            {editId ? "Actualizar Usuario" : "Registrar Usuario"}
          </Button>
        </form>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre, correo o rol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* LISTADO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Usuarios Registrados</h2>

        {filteredUsers.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <ul className="space-y-2">
            {filteredUsers.map((u) => (
              <li
                key={u._id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>{u.full_name}</strong> ({u.role}) —
                  <span
                    className={
                      u.is_active
                        ? "text-green-700 ml-2"
                        : "text-red-600 ml-2"
                    }
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </span>
                  <br />
                  <span className="text-sm text-[#555]">{u.email}</span>
                </div>

                <div className="space-x-2">
                  <Button
                    onClick={() => handleEdit(u)}
                    className="bg-[#A6C48A] text-[#1F2D17]"
                  >
                    Editar
                  </Button>

                  <Button
                    onClick={() => handleDelete(u._id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Eliminar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
