"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });

  const isMatching =
    passwords.new === passwords.confirm && passwords.new !== "";
  const isLongEnough = passwords.new.length >= 8;
  const hasUpper = /[A-Z]/.test(passwords.new);
  const hasNumber = /\d/.test(passwords.new);

  const isValid = isMatching && isLongEnough && hasUpper && hasNumber;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl p-10 border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800">
            Mise à jour du mot de passe
          </h2>
          <p className="text-slate-400 font-medium mt-2">
            Entrez votre nouveau mot de passe sécurisé.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Nouveau Mot de passe */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-slate-800   ml-1">
              Nouveau Mot de Passe
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15803d]"
                size={18}
              />
              <input
                required
                disabled={isLoading}
                type={showPwd ? "text" : "password"}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-lg focus:ring-4 focus:ring-green-600/10 focus:border-[#15803d] outline-none font-bold text-slate-700 transition-all"
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {passwords.new.length > 0 && (
              <div className="flex flex-wrap gap-3 px-1 mt-2">
                <span
                  className={`text-[9px] font-bold uppercase ${isLongEnough ? "text-emerald-600" : "text-slate-300"}`}>
                  ● 8+ Caract.
                </span>
                <span
                  className={`text-[9px] font-bold uppercase ${hasUpper ? "text-emerald-600" : "text-slate-300"}`}>
                  ● Majuscule
                </span>
                <span
                  className={`text-[9px] font-bold uppercase ${hasNumber ? "text-emerald-600" : "text-slate-300"}`}>
                  ● Chiffre
                </span>
              </div>
            )}
          </div>

          {/* Confirmation (AVEC ANTI-COPIER-COLLER) */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-slate-800   ml-1">
              Confirmer le mot de passe
            </label>
            <div className="relative group">
              <ShieldCheck
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15803d]"
                size={18}
              />
              <input
                required
                disabled={isLoading}
                type={showPwd ? "text" : "password"}
                // --- EMPECHE LE COLLER ---
                onPaste={(e) => e.preventDefault()}
                // --- EMPECHE LE COPIER DEPUIS CE CHAMP ---
                onCopy={(e) => e.preventDefault()}
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-lg outline-none font-bold text-slate-700 transition-all ${
                  passwords.confirm !== ""
                    ? isMatching
                      ? "border-green-500 focus:ring-green-600/10"
                      : "border-red-400 focus:ring-red-600/10"
                    : "border-slate-100 focus:border-[#15803d]"
                }`}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || isLoading}
            className="w-60 mx-auto mt-12 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-xl  shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <CheckCircle2 size={18} /> Enregistrer
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[15px] font-medium   text-slate-400 hover:text-[#15803d]">
              <ArrowLeft size={16} /> Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
