"use client";

import { useState } from "react";
import {
  Globe,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
  Award,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email_professionnel: "",
    password_hash: "",
    confirm_password: "",
    role_id: "",
    domaine: "",
    est_actif: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation de la complexité (Majuscule, Minuscule, Chiffre, 8+ caractères)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(formData.password_hash)) {
      alert(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.",
      );
      return;
    }

    if (formData.password_hash !== formData.confirm_password) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("Inscription réussie :", formData.nom);
      setIsLoading(false);
      router.push("/");
    }, 2000);
  };

  const getConfirmationStyles = () => {
    if (!formData.confirm_password) return "border-[#f1f5f9]";
    if (formData.password_hash !== formData.confirm_password) {
      return "border-red-500 bg-red-50 text-red-900 focus:border-red-600 focus:ring-red-100";
    }
    return "border-emerald-500 bg-emerald-50 text-emerald-900 focus:border-emerald-600 focus:ring-emerald-100";
  };

  const isLongEnough = formData.password_hash.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password_hash);
  const hasNumber = /\d/.test(formData.password_hash);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-5xl rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200">
        {/* Panneau Latéral */}
        <div className="md:w-[35%] bg-[#15803d] p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-medium tracking-tighter leading-none mb-4">
              <br />
              <span className="text-white/80 text-3xl">B E S D</span>
            </h1>
            <p className="text-green-100 text-sm font-medium leading-relaxed italic">
              "Bureau d'Etudes Strategiques et Developpement"
            </p>
          </div>

          <div className="relative z-10 space-y-4 text-[10px]">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-red-400" />
              <p className="font-bold uppercase tracking-[0.2em]">
                République du Burundi
              </p>
            </div>
            <p className="opacity-60 leading-relaxed">
              Enregistrement officiel des agents.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full border-[120px] border-white rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex-1 p-8 lg:p-12">
          <header className="mb-8">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
              Création de profil
            </h2>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Renseignez vos informations professionnelles.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Nom" icon={<User size={18} />}>
                <input
                  required
                  type="text"
                  name="nom"
                  onChange={handleChange}
                  placeholder="Nom"
                  className="field-input"
                />
              </InputGroup>
              <InputGroup label="Prénom" icon={<User size={18} />}>
                <input
                  required
                  type="text"
                  name="prenom"
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="field-input"
                />
              </InputGroup>
            </div>

            <InputGroup label="Adresse e-mail" icon={<Mail size={18} />}>
              <input
                required
                type="email"
                name="email_professionnel"
                onChange={handleChange}
                placeholder="votre@email.com"
                className="field-input"
              />
            </InputGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Mot de passe" icon={<Lock size={18} />}>
                <input
                  required
                  type={showPwd ? "text" : "password"}
                  name="password_hash"
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`field-input ${(!isLongEnough || !hasUpper || !hasNumber) && formData.password_hash.length > 0 ? "border-orange-300" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </InputGroup>

              <InputGroup label="Confirmation" icon={<ShieldCheck size={18} />}>
                <input
                  required
                  disabled={isLoading}
                  type={showPwd ? "text" : "password"}
                  // --- EMPECHE LE COLLER ---
                  onPaste={(e) => e.preventDefault()}
                  // --- EMPECHE LE COPIER DEPUIS CE CHAMP ---
                  onCopy={(e) => e.preventDefault()}
                  name="confirm_password"
                  onChange={handleChange}
                  placeholder="Re-saisir"
                  className={`field-input ${getConfirmationStyles()}`}
                />
              </InputGroup>
            </div>

            {/* Aide visuelle sécurité */}
            {formData.password_hash.length > 0 && (
              <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest px-1">
                <span
                  className={
                    isLongEnough ? "text-emerald-600" : "text-slate-300"
                  }>
                  ● 8+ Caract.
                </span>
                <span
                  className={hasUpper ? "text-emerald-600" : "text-slate-300"}>
                  ● Majuscule
                </span>
                <span
                  className={hasNumber ? "text-emerald-600" : "text-slate-300"}>
                  ● Chiffre
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Domaine" icon={<Briefcase size={18} />}>
                <input
                  type="text"
                  name="domaine"
                  onChange={handleChange}
                  placeholder="Expertise"
                  className="field-input"
                />
              </InputGroup>
              <InputGroup label="Rôle Système" icon={<Award size={18} />}>
                <select
                  name="role_id"
                  required
                  value={formData.role_id}
                  onChange={handleChange}
                  className="field-input appearance-none bg-slate-50 cursor-pointer font-bold">
                  <option value="" disabled>
                    Sélectionner un poste
                  </option>
                  <optgroup label="Direction BESD">
                    <option value="1">Chef BESD</option>
                    <option value="2">Chef-Adjoint BESD</option>
                    <option value="3">Secrétaire</option>
                  </optgroup>
                  <optgroup label="Cellule CPESSE">
                    <option value="4">Chef CPESSE</option>
                    <option value="5">Chef-Adjoint CPESSE</option>
                    <option value="6">CPESSE Conseiller</option>
                  </optgroup>
                  <optgroup label="Cellule CSEAG">
                    <option value="7">Chef CSEAG</option>
                    <option value="8">Chef-Adjoint CSEAG</option>
                    <option value="9">CSEAG Conseiller</option>
                  </optgroup>
                  <optgroup label="Cellule CCFESPP">
                    <option value="10">Chef CCFESPP</option>
                    <option value="11">Chef-Adjoint CCFESPP</option>
                    <option value="12">CCFESPP Conseiller</option>
                  </optgroup>
                </select>
              </InputGroup>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-200 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-80">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Patientez...
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .field-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          background-color: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 1rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: #334155;
          outline: none;
          transition: all 0.2s;
        }
        .field-input:focus {
          background-color: white;
          box-shadow: 0 0 0 4px rgba(21, 128, 61, 0.08);
          border-color: #15803d;
        }
      `}</style>
    </div>
  );
}

function InputGroup({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group flex items-center">
        <div className="absolute left-4 text-slate-400 group-focus-within:text-[#15803d] transition-colors z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
