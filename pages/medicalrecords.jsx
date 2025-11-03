"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "../utils/api";
import { useRouter } from "next/navigation";

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    record_date: "",
    reason: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    vet_notes: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔹 Carga inicial de fichas y pacientes
  useEffect(() => {
    const loadData = async () => {
      try {
        const [r, p] = await Promise.all([
          api.get("/records"), // ✅ usa /records (tabla correcta: medical_records)
          api.get("/patients"),
        ]);

        setTimeout(() => {
          setRecords(r.data);
          setPatients(p.data);
        }, 0);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setTimeout(() => setError("Error al cargar fichas médicas"), 0);
      }
    };
    loadData();
  }, []); 

  // 🔹 Manejo de cambios en formulario
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Crear o actualizar registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/records/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/records", form);
      }
      setForm({
        patient_id: "",
        record_date: "",
        reason: "",
        symptoms: "",
        diagnosis: "",
        treatment: "",
        vet_notes: "",
      });
      // recargar datos
      const { data } = await api.get("/records");
      setRecords(data);
    } catch {
      alert("❌ Error al guardar el registro médico");
    }
  };

  // 🔹 Editar registro
  const handleEdit = (r) => {
    setForm({
      patient_id: r.patient_id,
      record_date: r.record_date?.split("T")[0] || "",
      reason: r.reason || "",
      symptoms: r.symptoms || "",
      diagnosis: r.diagnosis || "",
      treatment: r.treatment || "",
      vet_notes: r.vet_notes || "",
    });
    setEditId(r.id);
  };

  // 🔹 Eliminar registro
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro médico?")) return;
    await api.delete(`/records/${id}`);
    const { data } = await api.get("/records");
    setRecords(data);
  };

  // 🔹 Filtro de búsqueda (admite Patient o patient)
  const filteredRecords = records.filter((r) =>
    (r.Patient?.name || r.patient?.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        🩺 Historial Médico
      </h1>

      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6 font-semibold"
      >
        ← Volver al Dashboard
      </Button>

      {/* 🧾 Formulario de creación/edición */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 md:grid-cols-2 bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl mb-6"
      >
        <select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          required
          className="p-2 rounded border border-[#A6C48A]"
        >
          <option value="">Seleccione paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="record_date"
          value={form.record_date}
          onChange={handleChange}
          required
          className="p-2 rounded border border-[#A6C48A]"
        />

        <input
          name="reason"
          placeholder="Motivo de visita"
          value={form.reason}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A]"
        />

        <input
          name="symptoms"
          placeholder="Síntomas"
          value={form.symptoms}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A]"
        />

        <input
          name="diagnosis"
          placeholder="Diagnóstico"
          value={form.diagnosis}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A]"
        />

        <input
          name="treatment"
          placeholder="Tratamiento"
          value={form.treatment}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A]"
        />

        <textarea
          name="vet_notes"
          placeholder="Notas del veterinario"
          value={form.vet_notes}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A] md:col-span-2"
        />

        <Button
          type="submit"
          className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2"
        >
          {editId ? "Actualizar Registro" : "Registrar Registro"}
        </Button>
      </form>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="Buscar por nombre del paciente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      {/* 📋 Lista de registros */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Registros Médicos</h2>
        {filteredRecords.length === 0 ? (
          <p>No hay registros médicos.</p>
        ) : (
          <ul className="space-y-2">
            {filteredRecords.map((r) => (
              <li
                key={r.id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  {/* ✅ Renderizado corregido */}
                  <strong>
                    {r.Patient?.name || r.patient?.name || "Paciente sin nombre"}
                  </strong>{" "}
                  🩺 {r.reason || "Sin motivo"} —{" "}
                  {r.diagnosis || "Sin diagnóstico"}
                </div>

                <div className="space-x-2">
                  <Button
                    onClick={() => handleEdit(r)}
                    className="bg-[#A6C48A] text-[#1F2D17]"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-600 hover:bg-red-700 text-white"
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
