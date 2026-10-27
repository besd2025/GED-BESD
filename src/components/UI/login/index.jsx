"use client"; // Obligatoire pour utiliser useState et les événements

import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowRight,
  ShieldCheck,
  Globe,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import nécessaire pour la redirection
import { fetchAPI } from "@/app/_utils/fetchApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";
export default function Login() {
  const router = useRouter(); // Initialisation du router
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(""); // État pour gérer le message d'erreur
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  function DecodeToJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Échec du décodage du token", error);
      return null;
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("Access_Token");
    if (accessToken) {
      const user = DecodeToJwt(accessToken);
      const now = new Date();
      if (now < new Date(user?.exp * 1000)) {
        router.push("/dashboard");
      } else {
        localStorage.removeItem("Access_Token");
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // On réinitialise l'erreur

    // CONDITION DE VALIDATION
    if (!formData.email || !formData.password) {
      setError("Veuillez compléter tous les champs pour continuer.");
      return;
    } else {
      // Appel à l'API pour l'authentification

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/login/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          },
        );

        const data = await response.json();
        if (data && data.access) {
          // Stockage du token dans localStorage
          localStorage.setItem("Access_Token", data.access);
          // Redirection vers le dashboard
          router.push("/dashboard");
        } else {
          setError("Identifiants invalides. Veuillez réessayer.");
        }
      } catch (error) {
        setError("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }

    // Si valide, on redirige vers le dashboard
    //router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="bg-sidebar w-full max-w-4xl rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden ">
        {/* Panneau Latéral : Identité Burundi 🇧🇮 */}
        <div className="md:w-[40%] bg-[#15803d] p-6 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <ModeToggle className="absolute top-4 right-4 lg:relative" />
          <div className="relative z-10 flex flex-col gap-3">
            <h1 className="text-4xl font-black  leading-none">
              BESD <br />
              <span className="text-white/80 text-3xl"></span>
            </h1>

            <p className="text-green-100 text-base">
              {"Bureau d'Etudes Strategiques et Developpement"}
            </p>
          </div>

          <div className="relative z-10 space-y-4 mt-3">
            <div className="flex items-center gap-2">
              <Globe size={20} className="text-red-400" />
              <p className="text-[15px] font-medium uppercase ">
                République du Burundi
              </p>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full border-[120px] border-white rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Formulaire de Connexion */}
        <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black text-sidebar-foreground ">
              Connexion
            </h2>
            <p className="text-slate-400 font-medium mt-2">
              Utilisez votre adresse e-mail et votre mot de passe.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* AFFICHAGE DE L'ERREUR SI CHAMPS VIDES */}
            {error && (
              <div className="bg-red-50 border border-red-100 px-4 py-2 rounded-lg flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={18} />
                <p className="text-sm  ">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-medium  ml-1 text-accent-foreground">
                Email
              </Label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15803d] transition-colors">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder="Adresse e-mail"
                  className="w-full pl-12 pr-4 py-6  rounded-lg focus-visible:ring-4 focus-visible:ring-green-600/10 focus-visible:border-[#15803d]  transition-all outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Mot de Passe */}

            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium  ml-1 text-accent-foreground">
                  Mot de passe
                </label>
                {/* <Link
                  href="/mot-de-passe-oublie"
                  className="text-[12px] font-medium text-red-600 hover:underline"
                >
                  Oublié ?

                </Link> */}
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15803d] transition-colors">
                  <Lock size={20} />
                </div>
                <Input
                  type={showPwd ? "text" : "password"}
                  placeholder="Entrer votre mot de passe"
                  className="w-full pl-12 pr-12 py-6 rounded-lg focus-visible:ring-4 focus-visible:ring-green-600/10 focus-visible:border-[#15803d] transition-all outline-none"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#15803d] transition-colors focus:outline-none"
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Bouton de Connexion (Validation gérée par handleSubmit) */}
            <button
              type="submit"
              className="w-max mx-auto mt-12 bg-secondary hover:bg-red-700 text-white py-2 px-5 rounded-lg font-medium text-md  shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group cursor-pointer"
            >
              <LogIn size={20} />
              Se connecter
            </button>
          </form>

          {/* Footer du formulaire */}
          <footer className="mt-0 text-center"></footer>
        </div>
      </div>
    </div>
  );
}
