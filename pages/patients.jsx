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
    owner: "",
  });

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // ===============================
  // 🔄 Cargar datos
  // ===============================
  const loadData = async () => {
    try {
      const [p, o] = await Promise.all([
        api.get("/api/patients"),
        api.get("/api/owners"),
      ]);

      setPatients(p.data);
      setOwners(o.data);
      setError("");
    } catch (err) {
      console.error("LOAD ERROR:", err.response?.data || err);
      setError("Error al cargar datos");
    }
  };

 useEffect(() => {
  let mounted = true;

  const fetchData = async () => {
    try {
      const [p, o] = await Promise.all([
        api.get("/api/patients"),
        api.get("/api/owners"),
      ]);

      if (mounted) {
        setPatients(p.data);
        setOwners(o.data);
        setError("");
      }
    } catch (err) {
      if (mounted) {
        setError("Error al cargar datos");
      }
    }
  };

  fetchData();

  return () => {
    mounted = false;
  };
}, []);


  // ===============================
  // ✍️ Manejo de cambios
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // 💾 Guardar / Actualizar
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.species || !form.owner) {
      alert("Complete los campos requeridos.");
      return;
    }

    try {
      // 🔥 Conversión correcta de datos
      const payload = {
        ...form,
        weight_kg: form.weight_kg ? Number(form.weight_kg) : null,
        birth_date: form.birth_date ? new Date(form.birth_date) : null,
      };

      if (editId) {
        await api.put(`/api/patients/${editId}`, payload);
        setEditId(null);
      } else {
        await api.post("/api/patients", payload);
      }

      // 🔄 Reset formulario
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
        owner: "",
      });

      loadData();
      setError("");
    } catch (err) {
      console.error("SAVE ERROR:", err.response?.data || err);
      setError("Error al guardar paciente");
    }
  };

  // ===============================
  // ✏️ Editar
  // ===============================
  const handleEdit = (patient) => {
    setForm({
      name: patient.name,
      species: patient.species,
      breed: patient.breed,
      sex: patient.sex,
      birth_date: patient.birth_date
        ? patient.birth_date.split("T")[0]
        : "",
      weight_kg: patient.weight_kg || "",
      color: patient.color || "",
      microchip_id: patient.microchip_id || "",
      notes: patient.notes || "",
      owner: patient.owner?._id || patient.owner,
    });

    setEditId(patient._id);
  };

  // ===============================
  // ❌ Eliminar
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar paciente?")) return;

    try {
      await api.delete(`/api/patients/${id}`);
      loadData();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err);
      setError("Error al eliminar paciente");
    }
  };

  // ===============================
  // 🔍 Filtro
  // ===============================
  const filteredPatients = patients.filter((p) => {
    const ownerName = p.owner
      ? `${p.owner.first_name} ${p.owner.last_name}`.toLowerCase()
      : "";

    return (
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.species?.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        🐾 Gestión de Pacientes Veterinarios
      </h1>

      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6"
      >
        ← Volver al Dashboard
      </Button>

      {error && (
        <div className="bg-red-500 text-white p-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* FORM */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl mb-8">
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required className="p-2 rounded border border-[#A6C48A]" />
          <input name="species" placeholder="Especie" value={form.species} onChange={handleChange} required className="p-2 rounded border border-[#A6C48A]" />
          <input name="breed" placeholder="Raza" value={form.breed} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />

          <select name="sex" value={form.sex} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]">
            <option value="U">Sexo desconocido</option>
            <option value="M">Macho</option>
            <option value="F">Hembra</option>
          </select>

          <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />
          <input type="number" name="weight_kg" placeholder="Peso (kg)" value={form.weight_kg} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />
          <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />
          <input name="microchip_id" placeholder="Microchip" value={form.microchip_id} onChange={handleChange} className="p-2 rounded border border-[#A6C48A]" />

          <select name="owner" value={form.owner} onChange={handleChange} required className="p-2 rounded border border-[#A6C48A] md:col-span-2">
            <option value="">Seleccione un propietario</option>
            {owners.map((o) => (
              <option key={o._id} value={o._id}>
                {o.first_name} {o.last_name}
              </option>
            ))}
          </select>

          <textarea name="notes" placeholder="Notas médicas" value={form.notes} onChange={handleChange} className="p-2 rounded border border-[#A6C48A] md:col-span-2" />

          <Button type="submit" className="bg-[#A6C48A] text-[#1F2D17] md:col-span-2">
            {editId ? "Actualizar Paciente" : "Registrar Paciente"}
          </Button>
        </form>
      </div>

      {/* LISTADO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl">
        {filteredPatients.length === 0 ? (
          <p>No hay pacientes registrados.</p>
        ) : (
          <ul className="space-y-3">
            {filteredPatients.map((p) => (
              <li key={p._id} className="border-b border-[#A6C48A] pb-2 flex justify-between items-center">
                <div>
                  <strong>{p.name}</strong> ({p.species}) — Propietario:{" "}
                  {p.owner
                    ? `${p.owner.first_name} ${p.owner.last_name}`
                    : "Sin propietario"}
                </div>

                <div className="space-x-2">
                  <Button onClick={() => handleEdit(p)} className="bg-[#A6C48A] text-[#1F2D17]">
                    Editar
                  </Button>
                  <Button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white">
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
