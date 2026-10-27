"use client";
import {
  FileText,
  Users,
  Settings,
  LogOut,
  FileClock,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useContext } from "react";
import { UserContext } from "@/src/components/UI/context/User_Context";
export default function Sidebar({ isSidebarLocked, isHovered, setIsHovered }) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { session } = useContext(UserContext);
  const deconnecter = () => {
    setIsLoggingOut(true);
    localStorage.removeItem("Access_Token");
    window.location.href = "/";
  };

  const isOpen = isSidebarLocked || isHovered;

  let menuItems = [
    {
      name: "Vue d'ensemble",
      icon: <LayoutDashboard size={22} />,
      path: "/dashboard",
    },
    {
      name: "Dossiers",
      icon: <FileText size={22} />,
      path: "/dashboard/dossier",
    },
  ];
  if (session && session?.type_service === "Bureau") {
    menuItems = [
      ...menuItems,
      {
        name: "Utilisateurs",
        icon: <Users size={22} />,
        path: "/dashboard/utilisateur",
      },
      {
        name: "Historique",
        icon: <FileClock size={22} />,
        path: "/dashboard/historique",
      },
    ];
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-sidebar h-screen border-r border-background flex flex-col fixed left-0 top-0 overflow-y-auto z-[100] transition-all duration-300 ease-in-out shadow-2xl ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="absolute right-0 top-0 w-[4px] h-full flex flex-col z-[110]">
        <div className="flex-1 bg-[#CE1126]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-primary" />
      </div>

      <div className="p-6 h-24 flex items-center gap-3 overflow-hidden shrink-0">
        <div className="min-w-[32px] w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
          B
        </div>
        <span
          className={`font-medium text-slate-800 tracking-tighter text-base leading-tight transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}
        >
          Bureau d&apos;Etude Stratégique et Developpement
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-4 px-3 py-3.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              pathname === item.path
                ? "bg-green-50 text-primary"
                : "text-slate-500 hover:bg-primary hover:text-white"
            }`}
          >
            <span className="shrink-0">{item.icon}</span>
            <span
              className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-100 space-y-2 overflow-hidden mb-4">
        <Link
          href="/dashboard/parametre"
          className="flex items-center gap-4 px-3 py-3.5 text-slate-500 font-bold hover:bg-slate-50 rounded-lg whitespace-nowrap"
        >
          <Settings size={22} className="shrink-0" />
          <span
            className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}
          >
            Paramètres
          </span>
        </Link>
        <button
          disabled={isLoggingOut}
          onClick={() => {
            deconnecter();
          }}
          className={`w-full flex items-center gap-4 px-3 py-3.5 font-bold rounded-lg transition-all whitespace-nowrap ${isLoggingOut ? "bg-slate-100 text-slate-400" : "text-[#CE1126] hover:bg-red-50"}`}
        >
          <LogOut
            size={22}
            className={`shrink-0 ${isLoggingOut ? "animate-pulse" : ""}`}
          />
          <span
            className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}
          >
            Déconnexion
          </span>
        </button>
      </div>
    </aside>
  );
}
