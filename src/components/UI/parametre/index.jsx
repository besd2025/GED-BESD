"use client";

import { useState } from "react";
import {
  User,
  Building2,
  Lock,
  Bell,
  Eye,
  Save,
  Camera,
  Globe,
  ShieldCheck,
  Smartphone,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function ParametresPage() {
  const [activeSection, setActiveSection] = useState("profil");

  const menuItems = [
    { id: "profil", icon: <User size={18} />, label: "Mon Profil" },
    {
      id: "organisation",
      icon: <Building2 size={18} />,
      label: "Organisation",
    },
    { id: "securite", icon: <Lock size={18} />, label: "Sécurité" },
    { id: "notifications", icon: <Bell size={18} />, label: "Notifications" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 mt-16">
      <div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          Paramètres
        </h1>
        <p className="text-slate-500 font-medium">
          Configurez votre compte et les préférences du système
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR DE NAVIGATION */}
        <div className="w-full lg:w-72 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${
                activeSection === item.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-100"
                  : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
              }`}>
              <div className="flex items-center gap-3">
                {item.icon} {item.label}
              </div>
              <ChevronRight
                size={14}
                opacity={activeSection === item.id ? 1 : 0}
              />
            </button>
          ))}

          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-all mt-8 border border-transparent hover:border-red-100">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="flex-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-10">
            {activeSection === "profil" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100">
                  <div className="relative group">
                    <div className="w-28 h-28 bg-slate-100 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                      <User size={40} className="text-slate-300" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-red-600 text-white rounded-xl shadow-lg hover:scale-110 transition-all">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                      NDAYIRAGIJE J.M.V.
                    </h3>
                    <p className="text-slate-400 font-bold text-sm">
                      Administrateur Système BESD
                    </p>
                    <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-full border border-green-100">
                      Compte vérifié
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputBlock
                    label="Prénom & Nom"
                    value="NDAYIRAGIJE Jean Marie Vianney"
                  />
                  <InputBlock
                    label="Adresse Email"
                    value="jmv.ndayiragije@besd.gov.bi"
                  />
                  <InputBlock
                    label="Téléphone Professionnel"
                    value="+257 22 22 00 00"
                  />
                  <InputBlock
                    label="Langue de l'interface"
                    value="Français (Burundi)"
                    isSelect
                    options={["Français", "Kirundi", "English"]}
                  />
                </div>
              </div>
            )}

            {activeSection === "securite" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                  Sécurité du compte
                </h3>
                <div className="space-y-4">
                  <SecurityCard
                    icon={<ShieldCheck className="text-green-600" />}
                    title="Double Authentification"
                    desc="Protégez votre compte avec un code SMS ou email."
                    status="Activé"
                  />
                  <SecurityCard
                    icon={<Smartphone className="text-blue-600" />}
                    title="Appareils Connectés"
                    desc="Gérez les sessions actives sur vos smartphones et PC."
                    status="2 actifs"
                  />
                </div>
                <div className="pt-6">
                  <button className="px-6 py-3 bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
                    Changer mon mot de passe
                  </button>
                </div>
              </div>
            )}

            {activeSection === "organisation" && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Informations BESD
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <InputBlock
                    label="Nom de l'Institution"
                    value="Bureau d'Études et de Suivi-Évaluation (BESD)"
                  />
                  <InputBlock
                    label="Ministère de Tutelle"
                    value="Ministère des Finances et du Budget"
                  />
                  <InputBlock
                    label="Adresse Siège"
                    value="Bujumbura, Rohero II, Avenue de la JRR"
                  />
                </div>
              </div>
            )}

            {/* BOUTON SAUVEGARDER GLOBAL */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-end">
              <button className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.1em] hover:bg-red-700 transition-all shadow-xl shadow-red-100">
                <Save size={18} /> Sauvegarder les modifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function InputBlock({ label, value, isSelect, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black uppercase text-slate-400 ml-2 tracking-widest">
        {label}
      </label>
      {isSelect ? (
        <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-red-600 transition-all cursor-pointer shadow-sm">
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          defaultValue={value}
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-red-600 focus:bg-white transition-all shadow-sm"
        />
      )}
    </div>
  );
}

function SecurityCard({ icon, title, desc, status }) {
  return (
    <div className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-[1.8rem] hover:border-red-200 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
          {icon}
        </div>
        <div>
          <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">
            {title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 italic leading-none mt-1">
            {desc}
          </p>
        </div>
      </div>
      <span className="text-[9px] font-black uppercase px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500">
        {status}
      </span>
    </div>
  );
}
