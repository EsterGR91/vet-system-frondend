"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password_hash: "",
    role: "STAFF",
    is_active: 1,
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔄 Cargar usuarios
   

  useEffect(() => {
    async () => {
    try {
      const res = await api.get("api/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar usuarios");
    }
  };
  }, []);

  // ✍️ Manejar cambios del formulario
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 💾 Guardar o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("https://backend-adyb.onrender.com/api/user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form ,
        password:form.password_hash
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.msg || "Error al registrar usuario");
      return;
    }

    router.push("/users"); // o "/login"
  };

  // ✏️ Editar usuario (corregido)
  const handleEdit = (user) => {
    console.log("🛠️ Editando usuario:", user);

    // ✅ Asegurar que el ID sea correcto (por si viene como user_id)
    if (!user.id && user.user_id) {
      user.id = user.user_id;
    }

    // ✅ Cargar datos en el formulario sin mostrar la contraseña
    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password_hash: "",
      role: user.role || "STAFF",
      is_active: user.is_active ?? 1,
    });

    // ✅ Guardar el ID a editar
    setEditId(user.id);

    alert(`✏️ Editando el usuario: ${user.full_name}`);
  };

  // ❌ Eliminar usuario
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este usuario?"
    );
    if (!confirmDelete) return;

    try {
      console.log("🗑️ Eliminando usuario con ID:", id);
      const res = await api.delete(`/users/${id}`);
      if (res.status === 200) {
        alert("✅ Usuario eliminado correctamente");
      } else {
        alert("⚠️ No se pudo eliminar el usuario");
      }
      loadUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("❌ Error al eliminar usuario");
    }
  };

  // 🔍 Filtrar usuarios
  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6 font-[Poppins]">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        👩‍💻 Gestión de Usuarios
      </h1>

      {/* 🔙 Volver */}
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6 font-semibold"
      >
        ← Volver al Dashboard
      </Button>

      {/* 🧾 Formulario */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "✏️ Editar Usuario" : "➕ Registrar Nuevo Usuario"}
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
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />

          <input
            name="password_hash"
            type="password"
            placeholder="Contraseña"
            value={form.password_hash}
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

      {/* 🔎 Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre, correo o rol..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* 📋 Listado */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Usuarios Registrados</h2>
        {filteredUsers.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <ul className="space-y-2">
            {filteredUsers.map((u) => (
              <li
                key={u.id || u.user_id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>{u.full_name}</strong> 👩‍💻 ({u.role}) —{" "}
                  <span
                    className={u.is_active ? "text-green-700" : "text-red-600"}
                  >
                    {u.is_active ? "Activo" : "Inactivo"}
                  </span>
                  <br />
                  <span className="text-sm text-[#555]">{u.email}</span>
                  <br />
                  <span className="text-sm text-[#4E8A45] font-medium">
                    Contraseña: 🔒 Encriptada (bcrypt)
                  </span>
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEdit(u)}
                    className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17]"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(u.id || u.user_id)}
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
