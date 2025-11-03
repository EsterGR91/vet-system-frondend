"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [owners, setOwners] = useState([]);
  const [form, setForm] = useState({
    name: "",
    species: "",
    breed: "",
    sex: "U",
    birth_date: "",
    weight_kg: "",
    color: "",
    microchip_id: "",
    notes: "",
    owner_id: "",
  });
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔄 Cargar pacientes y propietarios
  const loadData = async () => {
    try {
      const [p, o] = await Promise.all([
        api.get("/patients"),
        api.get("/owners"),
      ]);
      setPatients(p.data);
      setOwners(o.data);
    } catch {
      setError("Error al cargar datos");
    }
  };

  useEffect(() => {
    const fetchData = async () => await loadData();
    fetchData();
  }, []);

  // 🧩 Actualiza los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir a número si el campo es owner_id o weight_kg
    setForm({
      ...form,
      [name]:
        name === "owner_id"
          ? parseInt(value) || ""
          : name === "weight_kg"
          ? parseFloat(value) || ""
          : value,
    });
  };

  // 💾 Guardar o actualizar paciente
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!form.name || !form.species || !form.owner_id) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    try {
      if (editId) {
        await api.put(`/patients/${editId}`, form);
        alert("✅ Paciente actualizado correctamente");
        setEditId(null);
      } else {
        await api.post("/patients", form);
        alert("✅ Paciente registrado correctamente");
      }

      // Limpia el formulario
      setForm({
        name: "",
        species: "",
        breed: "",
        sex: "U",
        birth_date: "",
        weight_kg: "",
        color: "",
        microchip_id: "",
        notes: "",
        owner_id: "",
      });
      await loadData();
    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar paciente. Revise los datos.");
      setError("Error al guardar paciente");
    }
  };

  // ✏️ Editar
  const handleEdit = (patient) => {
    setForm({
      name: patient.name,
      species: patient.species,
      breed: patient.breed,
      sex: patient.sex,
      birth_date: patient.birth_date?.split("T")[0] || "",
      weight_kg: patient.weight_kg || "",
      color: patient.color || "",
      microchip_id: patient.microchip_id || "",
      notes: patient.notes || "",
      owner_id: patient.owner_id || "",
    });
    setEditId(patient.id);
  };

  // 🗑️ Eliminar
  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas eliminar este paciente?");
    if (!confirm) return;
    try {
      await api.delete(`/patients/${id}`);
      alert("🗑️ Paciente eliminado correctamente");
      loadData();
    } catch {
      alert("❌ Error al eliminar paciente");
      setError("Error al eliminar paciente");
    }
  };

  // 🔍 Filtrado y paginación
  const filteredPatients = patients.filter((p) => {
    const owner = owners.find((o) => o.id === p.owner_id);
    const ownerName = owner
      ? `${owner.first_name} ${owner.last_name}`.toLowerCase()
      : "";

    return (
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.species.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(start, start + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        🐾 Gestión de Pacientes Veterinarios
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
          {editId ? "Editar paciente" : "Registrar nuevo paciente"}
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input
            name="name"
            placeholder="Nombre del paciente"
            value={form.name}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="species"
            placeholder="Especie (ej. Perro, Gato)"
            value={form.species}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="breed"
            placeholder="Raza"
            value={form.breed}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <select
            name="sex"
            value={form.sex}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          >
            <option value="U">Sexo desconocido</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>
          <input
            name="birth_date"
            type="date"
            value={form.birth_date}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="weight_kg"
            placeholder="Peso (kg)"
            value={form.weight_kg}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="color"
            placeholder="Color"
            value={form.color}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />
          <input
            name="microchip_id"
            placeholder="Microchip"
            value={form.microchip_id}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A]"
          />

          {/* Selector de propietario */}
          <select
            name="owner_id"
            value={form.owner_id}
            onChange={handleChange}
            required
            className="p-2 rounded border border-[#A6C48A] md:col-span-2"
          >
            <option value="">Seleccione un propietario</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.first_name} {o.last_name}
              </option>
            ))}
          </select>

          <textarea
            name="notes"
            placeholder="Notas o antecedentes médicos"
            value={form.notes}
            onChange={handleChange}
            className="p-2 rounded border border-[#A6C48A] md:col-span-2"
          />

          <Button
            type="submit"
            className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2"
          >
            {editId ? "Actualizar Paciente" : "Registrar Paciente"}
          </Button>
        </form>
      </div>

      {/* BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar por nombre, especie o propietario..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* LISTADO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-3">Pacientes Registrados</h2>
        {currentPatients.length === 0 ? (
          <p>No hay pacientes registrados.</p>
        ) : (
          <ul className="space-y-2">
            {currentPatients.map((p) => {
              const owner = owners.find((o) => o.id === p.owner_id);
              return (
                <li
                  key={p.id}
                  className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
                >
                  <div>
                    <strong>{p.name}</strong> 🐕 ({p.species}) — Propietario:{" "}
                    {owner
                      ? `${owner.first_name} ${owner.last_name}`
                      : "No asignado"}
                  </div>
                  <div className="space-x-2">
                    <Button
                      onClick={() => handleEdit(p)}
                      className="bg-[#A6C48A] text-[#1F2D17]"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Eliminar
                    </Button>
                  </div>
                </li>
              );
            })}
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
