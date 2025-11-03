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
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const itemsPerPage = 5;

  // 🔄 Cargar propietarios
  const loadOwners = async () => {
    try {
      const res = await api.get("/owners");
      setOwners(res.data);
    } catch {
      setError("Error al cargar propietarios");
    }
  };

  useEffect(() => {
    const fetchData = async () => await loadOwners();
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Guardar o actualizar propietario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/owners/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/owners", form);
      }
      setForm({ first_name: "", last_name: "", email: "", phone: "", address: "" });
      loadOwners();
    } catch {
      setError("Error al guardar propietario");
    }
  };

  // Editar
  const handleEdit = (owner) => {
    setForm(owner);
    setEditId(owner.id);
  };

  // Eliminar con confirmación visual
  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este propietario?");
    if (!confirm) return;
    try {
      await api.delete(`/owners/${id}`);
      loadOwners();
    } catch {
      setError("Error al eliminar propietario");
    }
  };

  // Filtrado y paginación
  const filteredOwners = owners.filter(
    (o) =>
      o.first_name.toLowerCase().includes(search.toLowerCase()) ||
      o.last_name.toLowerCase().includes(search.toLowerCase()) ||
      o.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOwners.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentOwners = filteredOwners.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        👤 Gestión de Propietarios
      </h1>

      {/* 🔙 Botón de volver al dashboard */}
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6 font-semibold"
      >
        ← Volver al Dashboard
      </Button>

      {/* FORMULARIO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editId ? "Editar propietario" : "Registrar nuevo propietario"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="first_name"
            placeholder="Nombre"
            value={form.first_name}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="last_name"
            placeholder="Apellidos"
            value={form.last_name}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="address"
            placeholder="Dirección"
            value={form.address}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A] md:col-span-2"
          />
          <Button
            type="submit"
            className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2"
          >
            {editId ? "Actualizar" : "Registrar Propietario"}
          </Button>
        </form>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o correo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* LISTADO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Lista de propietarios</h2>
        {currentOwners.length === 0 ? (
          <p>No hay propietarios registrados.</p>
        ) : (
          <ul className="space-y-2">
            {currentOwners.map((o) => (
              <li
                key={o.id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>
                    {o.first_name} {o.last_name}
                  </strong>{" "}
                  — {o.email || "Sin correo"} 📞 {o.phone || "Sin teléfono"}
                </div>
                <div className="space-x-2">
                  <Button
                    onClick={() => handleEdit(o)}
                    className="bg-[#A6C48A] text-[#1F2D17]"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(o.id)}
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

      {/* PAGINACIÓN */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-[#A6C48A] text-[#1F2D17]"
                : "bg-[#F5F7EB] text-[#1F2D17]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
