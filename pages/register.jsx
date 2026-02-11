"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://backend-adyb.onrender.com/api/user/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Error al registrar");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#3D5B37] via-[#456E3E] to-[#2E4627] text-[#1F2D17] relative">
      
      <Card className="relative z-10 w-[380px] bg-[#F5F7EB]/95 shadow-xl rounded-2xl border border-[#A6C48A]/50 p-6">
        <CardContent className="flex flex-col items-center">
          
          <div className="flex flex-col items-center mb-4">
            <Image
              src="/images/logo-vetcare.png"
              alt="PetNice Logo"
              width={80}
              height={80}
              className="rounded-full border-2 border-[#A6C48A]"
            />
            <h2 className="text-2xl font-semibold text-[#2E4627] mt-3">
              Registro
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
            
            <div>
              <Label>Nombre Completo</Label>
              <Input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Correo</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
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
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-[#3D5B37] hover:bg-[#4E8A45] text-white"
            >
              Registrarse
            </Button>
          </form>

          <p className="text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <Link href="/" className="underline">
              Inicia sesión
            </Link>
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
