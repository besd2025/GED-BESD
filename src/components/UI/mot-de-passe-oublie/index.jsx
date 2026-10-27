"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Veuillez saisir votre adresse e-mail.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-slate-200 p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-slate-800 ">Récupération</h2>
          <p className="text-slate-400 font-medium mt-2">
            Veuillez entrer votre email pour continuer
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 text-red-600">
                <AlertCircle size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[12px] font-medium text-slate-800   ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#15803d] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse e-mail"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-lg focus:ring-4 focus:ring-green-600/10 focus:border-[#15803d] focus:bg-white transition-all outline-none font-bold text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-60 mx-auto mt-12 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium text-xl  shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group">
              <Send size={18} />
              Envoyer
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4 text-green-600">
              <CheckCircle2 size={60} />
            </div>
            <h3 className="text-lg font-medium mt-2 text-slate-800">
              Lien envoyé
            </h3>
            <p className="text-slate-400 font-medium mt-2">
              Vérifiez vos emails pour réinitialiser votre accès.
            </p>
          </div>
        )}

        {/* LIENS DE REDIRECTION VERS LOGIN */}
        <div className="mt-10 pt-6 border-t border-slate-100 space-y-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[15px] font-medium   text-slate-400 hover:text-[#15803d]">
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>

          {/* <p className="text-[11px] font-bold text-slate-400 block">
            Besoin d'un compte ?{" "}
            <Link
              href="/authentification"
              className="text-[#15803d] hover:underline font-black uppercase ml-1">
              {"S'inscrire"}
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
}
