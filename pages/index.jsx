"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-gradient-to-b from-[#3D5B37] via-[#456E3E] to-[#2E4627] text-[#1F2D17] relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/*  Fondo con textura */}
      <div
        className="absolute inset-0 bg-[url('/images/bg-leaves.jpg')] bg-cover bg-center opacity-10"
      ></div>

      {/* 🩺 Contenedor principal */}
      <Card className="relative z-10 w-[380px] bg-[#F5F7EB]/95 shadow-xl rounded-2xl border border-[#A6C48A]/50 p-6 backdrop-blur-sm animate-fadeIn">
        <CardContent className="flex flex-col items-center">
          {/* 🐾 Logo PetNice */}
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/images/logo-vetcare.png"
              alt="PetNice Logo"
              width={80}
              height={80}
              className="rounded-full border-2 border-[#A6C48A] shadow-[0_0_15px_#A6C48A]"
            />
            <h2 className="text-2xl font-semibold text-[#2E4627] mt-3">
              Iniciar Sesión
            </h2>
          </div>

          {/* 🔐 Formulario */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
            <div>
              <Label className="text-[#3D5B37] font-medium">Correo</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#FFFDEB] border-[#A6C48A] focus:border-[#4E8A45] focus:ring-[#4E8A45]"
              />
            </div>
            <div>
              <Label className="text-[#3D5B37] font-medium">Contraseña</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#FFFDEB] border-[#A6C48A] focus:border-[#4E8A45] focus:ring-[#4E8A45]"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-1 rounded-md">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#3D5B37] hover:bg-[#4E8A45] text-[#F5F7EB] font-semibold shadow-md transition-transform hover:scale-[1.03]"
            >
              Entrar
            </Button>
          </form>

          {/* 📩 Enlace de registro */}
          <p className="text-sm text-center mt-4 text-[#2E4627]">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-[#4E8A45] hover:text-[#2E4627] underline-offset-2 hover:underline font-medium transition-all duration-300"
            >
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* ✨ Animación */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
