"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../utils/api";
import { Button } from "@/components/ui/button";

export default function Owners() {
  const router = useRouter();

  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  // ===============================
  // 🔄 Cargar propietarios
  // ===============================
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await api.get("/api/owners");
        setOwners(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar propietarios");
      }
    };

    fetchOwners();
  }, []);

  const refreshOwners = async () => {
    try {
      const res = await api.get("/api/owners");
      setOwners(res.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar propietarios");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ===============================
  // 🟢 Guardar o actualizar
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/owners/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/api/owners", form);
      }

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
      });

      refreshOwners();
    } catch (err) {
      console.error(err);
      setError("Error al guardar propietario");
    }
  };

  const handleEdit = (owner) => {
    setForm({
      first_name: owner.first_name || "",
      last_name: owner.last_name || "",
      email: owner.email || "",
      phone: owner.phone || "",
      address: owner.address || "",
    });

    setEditId(owner._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este propietario?"))
      return;

    try {
      await api.delete(`/api/owners/${id}`);
      refreshOwners();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar propietario");
    }
  };

  const filteredOwners = owners.filter((o) =>
    `${o.first_name} ${o.last_name} ${o.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        👤 Gestión de Propietarios
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

      {/* ================= FORMULARIO ================= */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Editar propietario" : "Registrar nuevo propietario"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input name="first_name" placeholder="Nombre" value={form.first_name} onChange={handleChange} required className="p-2 rounded border border-[#A6C48A]" />
          <input name="last_name" placeholder="Apellidos" value={form.last_name} onChange={handleChange} required className="p-2 rounded border border-[#A6C48A]" />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />
          <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />
          <input name="address" placeholder="Dirección" value={form.address} onChange={handleChange} className="p-2 rounded border border-[#A6C48A] md:col-span-2" />

          <Button type="submit" className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2">
            {editId ? "Actualizar" : "Registrar Propietario"}
          </Button>
        </form>
      </div>

      {/* ================= BUSCADOR ================= */}
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o correo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* ================= PANEL DE PROPIETARIOS ================= */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">
          Propietarios Registrados ({filteredOwners.length})
        </h2>

        {filteredOwners.length === 0 ? (
          <p>No hay propietarios registrados.</p>
        ) : (
          <div className="space-y-3">
            {filteredOwners.map((o) => (
              <div
                key={o._id}
                className="border border-[#A6C48A] rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {o.first_name} {o.last_name}
                  </p>
                  <p className="text-sm">
                    📧 {o.email || "Sin correo"} | 📞 {o.phone || "Sin teléfono"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {o.address || "Sin dirección"}
                  </p>
                </div>

                <div className="space-x-2">
                  <Button onClick={() => handleEdit(o)} className="bg-[#A6C48A] text-[#1F2D17]">
                    Editar
                  </Button>
                  <Button onClick={() => handleDelete(o._id)} className="bg-red-500 text-white">
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
