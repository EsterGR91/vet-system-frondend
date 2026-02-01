"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Head from "next/head";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const cards = [
    { title: "Propietarios", img: "/images/logo-owners.png", route: "/owners" },
    { title: "Pacientes", img: "/images/logo-patients.png", route: "/patients" },
    { title: "Citas", img: "/images/logo-appointments.png", route: "/appointments" },
    { title: "Historial Médico", img: "/images/logo-medicalrecords.png", route: "/medicalrecords" },
    { title: "Usuarios", img: "/images/logo-users.png", route: "/users" },
  ];

  return (
    <>
      {/*  Fuente refinada */}
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className="relative min-h-screen text-[#F5F7EB] bg-gradient-to-b from-[#3D5B37] via-[#456E3E] to-[#2E4627] overflow-hidden flex flex-col"
        style={{ fontFamily: "'Inter', 'Poppins', sans-serif" }}
      >
        {/* 🌿 Fondo con textura sutil */}
        <div
          className="absolute inset-0 bg-[url('/images/bg-leaves.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"
        ></div>

        {/* HEADER */}
        <header className="relative z-10 flex items-center justify-between px-10 py-4 bg-[#4E8A45]/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
          {/* Contenido centrado */}
          <div className="flex flex-col items-center text-center flex-grow animate-fadeIn">
            <img
              src="/images/logo-vetcare.png"
              alt="Logo PetNice"
              className="w-20 h-20 rounded-full border-2 border-[#E8FFC8] shadow-[0_0_20px_#A6C48A] mb-2 transition-transform hover:scale-105"
            />
            <h1 className="text-3xl font-semibold tracking-wide drop-shadow-sm">
              Bienvenido a <span className="text-[#E8FFC8]">PetNice</span> 
            </h1>
            <p className="text-sm font-medium text-[#F5F7EB]/90 mt-1">
              Administrador Veterinario —{" "}
              <strong className="text-[#E8FFC8]">{user?.full_name}</strong>
            </p>
          </div>

          {/* Botón cerrar sesión */}
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="absolute right-10 top-8 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Cerrar sesión
          </Button>
        </header>

        {/* MAIN */}
        <main className="relative z-10 flex flex-col items-center justify-center flex-grow px-6 py-10 animate-fadeInSlow">
          <h2 className="text-2xl font-semibold mb-10 text-[#E8FFC8] text-center font-light tracking-wide">
             Panel de Navegación
          </h2>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {cards.map((card, i) => (
              <div
                key={i}
                onClick={() => router.push(card.route)}
                className="cursor-pointer group bg-[#F5F7EB] text-[#1F2D17] rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-[0_0_30px_#9ECF84] hover:scale-[1.07] hover:rotate-1 transition-all duration-400 ease-out"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#E9F0E3] shadow-inner mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-lg font-medium tracking-wide group-hover:text-[#3D5B37] transition-colors duration-300">
                  {card.title}
                </h3>
              </div>
            ))}
          </div>
        </main>

        {/* FOOTER */}
        <footer className="relative z-10 w-full bg-[#4E8A45]/95 backdrop-blur-sm py-5 px-10 text-sm text-[#E8FFC8] shadow-[0_-4px_20px_rgba(0,0,0,0.3)] text-left border-t border-[#A6C48A]/30">
          <p className="mb-1">
            Sistema de gestión veterinaria{" "}
            <span className="text-white font-semibold">PetNice</span> 
          </p>
          <p>
            Desarrollado por{" "}
            <span className="font-semibold text-white">
              Ester Guevara Reyes
            </span>
          </p>
        </footer>
      </div>

      {/* ✨ Animaciones */}
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
          animation: fadeIn 0.8s ease-in-out forwards;
        }
        .animate-fadeInSlow {
          animation: fadeIn 1.2s ease-in-out forwards;
        }
      `}</style>
    </>
  );
}

