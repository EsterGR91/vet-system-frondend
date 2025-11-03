"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import api from "../utils/api";
import { useRouter } from "next/navigation";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patient_id: "",
    scheduled_for: "",
    status: "PENDING",
    notes: "",
  });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const loadData = async () => {
    try {
      const [a, p] = await Promise.all([
        api.get("/appointments"),
        api.get("/patients"),
      ]);
      setAppointments(a.data);
      setPatients(p.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

 useEffect(() => {
  const loadData = async () => {
    try {
      const [a, p] = await Promise.all([
        api.get("/appointments"),
        api.get("/patients")
      ]);
      setTimeout(() => {
        setAppointments(a.data);
        setPatients(p.data);
      }, 0);
    } catch (err) {
      console.error(err);
      setTimeout(() => setError("Error al cargar datos"), 0);
    }
  };
  loadData();
}, []);



  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/appointments/${editId}`, form);
        setEditId(null);
      } else {
        await api.post("/appointments", form);
      }
      setForm({ patient_id: "", scheduled_for: "", status: "PENDING", notes: "" });
      loadData();
    } catch {
      alert("Error al guardar cita");
    }
  };

  const handleEdit = (a) => {
    setForm({
      patient_id: a.patient_id,
      scheduled_for: a.scheduled_for.split("T")[0],
      status: a.status,
      notes: a.notes || "",
    });
    setEditId(a.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Eliminar esta cita?");
    if (!confirm) return;
    await api.delete(`/appointments/${id}`);
    loadData();
  };

  const filteredAppointments = appointments.filter(
    (a) =>
      a.Patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#3D5B37] text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-[#D4EDC1]">📅 Gestión de Citas</h1>

      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] mb-6 font-semibold"
      >
        ← Volver al Dashboard
      </Button>

      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl mb-6">
        <select
          name="patient_id"
          value={form.patient_id}
          onChange={handleChange}
          required
          className="p-2 rounded border border-[#A6C48A]"
        >
          <option value="">Seleccione paciente</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="scheduled_for"
          value={form.scheduled_for}
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
        <textarea
          name="notes"
          placeholder="Notas"
          value={form.notes}
          onChange={handleChange}
          className="p-2 rounded border border-[#A6C48A] md:col-span-2"
        />
        <Button type="submit" className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2">
          {editId ? "Actualizar Cita" : "Registrar Cita"}
        </Button>
      </form>

      <input
        type="text"
        placeholder="Buscar por paciente o estado..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded w-full mb-4 text-[#1F2D17] border border-[#A6C48A]"
      />

      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Citas Registradas</h2>
        {filteredAppointments.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {filteredAppointments.map((a) => (
              <li key={a.id} className="border-b border-[#A6C48A] pb-2 flex justify-between items-center">
                <div>
                  <strong>{a.Patient?.name}</strong> — {a.status} 📆 {new Date(a.scheduled_for).toLocaleString()}
                </div>
                <div className="space-x-2">
                  <Button onClick={() => handleEdit(a)} className="bg-[#A6C48A] text-[#1F2D17]">Editar</Button>
                  <Button onClick={() => handleDelete(a.id)} className="bg-red-600 hover:bg-red-700 text-white">Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
