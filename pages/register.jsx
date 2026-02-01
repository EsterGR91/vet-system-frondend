"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.full_name, form.email, form.password);
      setMsg("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F5F7EB]">
      <Card className="w-[380px] p-6 shadow-2xl rounded-2xl bg-[#3D5B37] text-[#F5F7EB] animate-fadeIn">
        <CardContent>
          {/* Logo y título */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="/images/logo-vetcare.png"
              alt="Logo PetNice"
              className="w-16 h-16 rounded-full mb-3 shadow-md border-2 border-[#A6C48A]"
            />
            <h2 className="text-2xl font-semibold text-center">
               Crear Cuenta
            </h2>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Nombre completo</Label>
              <Input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="bg-[#F5F7EB] text-[#1F2D17] border-[#A6C48A]"
              />
            </div>

            <div>
              <Label>Correo electrónico</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-[#F5F7EB] text-[#1F2D17] border-[#A6C48A]"
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-[#F5F7EB] text-[#1F2D17] border-[#A6C48A]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4E8A45] hover:bg-[#2E4627] text-[#F5F7EB] font-semibold transition-all duration-300"
            >
              Registrar
            </Button>

            {msg && (
              <p className="text-center text-sm mt-2 text-[#D4EDC1]">{msg}</p>
            )}
          </form>

          {/* Enlace para ir al login */}
          <p className="text-sm text-center mt-5 text-[#D4EDC1]">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/"
              className="text-[#A6C48A] hover:text-[#F5F7EB] underline-offset-2 hover:underline transition-colors duration-300"
            >
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Animación */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
