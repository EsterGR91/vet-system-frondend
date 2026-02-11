"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "../utils/api";
import { useRouter } from "next/navigation";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient: "",
    record_date: "",
    status: "PENDING",
    reason: "",
    vet_notes: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // ===============================
  // 🔄 CARGAR DATOS
  // ===============================
  const fetchData = async () => {
    try {
      const [a, p] = await Promise.all([
        api.get("/api/appointments"),
        api.get("/api/patients"),
      ]);

      setAppointments(a.data);
      setPatients(p.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos");
    }
  };

useEffect(() => {
  const load = async () => {
    await fetchData();
  };

  load();
}, []);

  const reloadData = async () => {
    await fetchData();
  };

  // ===============================
  // ✍️ HANDLE CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ===============================
  // 💾 CREAR / ACTUALIZAR
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await api.put(`/api/appointments/${editId}`, form);
      } else {
        await api.post("/api/appointments", form);
      }

      setForm({
        patient: "",
        record_date: "",
        status: "PENDING",
        reason: "",
        vet_notes: "",
      });

      setEditId(null);
      reloadData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Error al guardar cita");
    }
  };

  // ===============================
  // ✏️ EDITAR
  // ===============================
  const handleEdit = (a) => {
    setForm({
      patient: a.patient?._id || a.patient,
      record_date: a.record_date
        ? new Date(a.record_date).toISOString().slice(0, 16)
        : "",
      status: a.status,
      reason: a.reason || "",
      vet_notes: a.vet_notes || "",
    });

    setEditId(a._id);
  };

  // ===============================
  // ❌ ELIMINAR
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta cita?")) return;

    try {
      await api.delete(`/api/appointments/${id}`);
      reloadData();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar cita");
    }
  };

  // ===============================
  // 🔍 FILTRO
  // ===============================
  const filteredAppointments = appointments.filter(
    (a) =>
      a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">
        📅 Gestión de Citas
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

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid gap-3 md:grid-cols-2 bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl mb-6"
      >
        <select
          name="patient"
          value={form.patient}
          onChange={handleChange}
          required
          className="p-2 rounded border border-[#A6C48A]"
        >
          <option value="">Seleccione paciente</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          name="record_date"
          value={form.record_date}
          onChange={handleChange}
          required
          className="p-2 rounded border border-[#A6C48A]"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A]"
        >
          <option value="PENDING">Pendiente</option>
          <option value="COMPLETED">Completada</option>
          <option value="CANCELLED">Cancelada</option>
        </select>

        <input
          type="text"
          name="reason"
          placeholder="Motivo"
          value={form.reason}
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
          {editId ? "Actualizar Cita" : "Registrar Cita"}
        </Button>
      </form>

      {/* LISTADO */}
      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          Citas Registradas
        </h2>

        {filteredAppointments.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {filteredAppointments.map((a) => (
              <li
                key={a._id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>{a.patient?.name || "Paciente"}</strong> —{" "}
                  {a.status} 📆{" "}
                  {a.record_date
                    ? new Date(a.record_date).toLocaleString()
                    : "Sin fecha"}
                </div>

                <div className="space-x-2">
                  <Button
                    onClick={() => handleEdit(a)}
                    className="bg-[#A6C48A] text-[#1F2D17]"
                  >
                    Editar
                  </Button>

                  <Button
                    onClick={() => handleDelete(a._id)}
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
