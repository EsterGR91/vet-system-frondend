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
    scheduled_for: "",
    status: "PENDING",
    notes: "",
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔄 CARGAR DATOS
  useEffect(() => {
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

    fetchData();
  }, []);

  const reloadData = async () => {
    try {
      const [a, p] = await Promise.all([
        api.get("/api/appointments"),
        api.get("/api/patients"),
      ]);

      setAppointments(a.data);
      setPatients(p.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✍️ HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 💾 CREAR / ACTUALIZAR
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
        scheduled_for: "",
        status: "PENDING",
        notes: "",
      });

      setEditId(null);
      reloadData();
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Error al guardar cita");
    }
  };

  // ✏️ EDITAR
  const handleEdit = (a) => {
    setForm({
      patient: a.patient?._id || a.patient,
      scheduled_for: a.scheduled_for
        ? new Date(a.scheduled_for).toISOString().slice(0, 16)
        : "",
      status: a.status,
      notes: a.notes || "",
    });

    setEditId(a._id);
  };

  // ❌ ELIMINAR
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

        <Button
          type="submit"
          className="bg-[#A6C48A] hover:bg-[#90B270] text-[#1F2D17] font-semibold md:col-span-2"
        >
          {editId ? "Actualizar Cita" : "Registrar Cita"}
        </Button>
      </form>

      <div className="bg-[#F5F7EB] text-[#1F2D17] p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">
          Citas Registradas
        </h2>

        {appointments.length === 0 ? (
          <p>No hay citas registradas.</p>
        ) : (
          <ul className="space-y-2">
            {appointments.map((a) => (
              <li
                key={a._id}
                className="border-b border-[#A6C48A] pb-2 flex justify-between items-center"
              >
                <div>
                  <strong>{a.patient?.name || "Paciente"}</strong> —{" "}
                  {a.status} 📆{" "}
                  {new Date(a.scheduled_for).toLocaleString()}
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
