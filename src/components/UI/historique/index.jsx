"use client";

import { useState, useMemo } from "react";
import {
  History,
  Search,
  Filter,
  Calendar,
  ArrowRight,
  User,
  FileEdit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- COMPOSANT DE LIGNE D'HISTORIQUE ---
function HistoryRow({ id, date, heure, utilisateur, action, dossier, detail }) {
  const getActionStyle = (act) => {
    switch (act.toLowerCase()) {
      case "création":
        return "text-blue-600 bg-blue-50 border-blue-100";
      case "modification":
        return "text-amber-600 bg-amber-50 border-amber-100";
      case "validation":
        return "text-green-600 bg-green-50 border-green-100";
      case "rejet":
        return "text-red-600 bg-red-50 border-red-100";
      default:
        return "text-slate-600 bg-slate-50 border-slate-100";
    }
  };

  const getIcon = (act) => {
    switch (act.toLowerCase()) {
      case "création":
        return <Clock size={14} />;
      case "modification":
        return <FileEdit size={14} />;
      case "validation":
        return <CheckCircle size={14} />;
      case "rejet":
        return <XCircle size={14} />;
      default:
        return <History size={14} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 p-5 hover:bg-slate-50/80 transition-all border-b border-slate-100 group">
      {/* Date et Heure */}
      <div className="w-32 shrink-0">
        <p className="text-xs font-black text-slate-800 tracking-tighter">
          {date}
        </p>
        <p className="text-[10px] font-bold text-slate-400 italic">{heure}</p>
      </div>

      {/* Utilisateur */}
      <div className="w-48 shrink-0 flex items-center gap-2">
        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
          <User size={14} />
        </div>
        <p className="text-[11px] font-black text-slate-700 uppercase truncate">
          {utilisateur}
        </p>
      </div>

      {/* Action Badge */}
      <div className="w-32 shrink-0">
        <span
          className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border flex items-center gap-1.5 w-fit ${getActionStyle(
            action
          )}`}>
          {getIcon(action)} {action}
        </span>
      </div>

      {/* Détails du Dossier */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-red-600 uppercase bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
            {dossier}
          </span>
          <p className="text-xs font-bold text-slate-600 truncate">{detail}</p>
        </div>
      </div>

      {/* Action bouton (optionnel) */}
      <div className="w-12 text-right opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          title="Voir le dossier"
          className="p-2 hover:bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 shadow-sm">
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// --- COMPOSANT PRINCIPAL ---
export default function HistoriquePage() {
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");

  const logs = [
    {
      id: 1,
      date: "14 Jan 2026",
      heure: "14:20",
      utilisateur: "NDAYIRAGIJE J.M.V.",
      action: "Validation",
      dossier: "BESD-24-001",
      detail: "Rapport final validé pour ODECA",
    },
    {
      id: 2,
      date: "14 Jan 2026",
      heure: "11:05",
      utilisateur: "KWIZERA Florence",
      action: "Modification",
      dossier: "BESD-24-002",
      detail: "Mise à jour des pièces jointes",
    },
    {
      id: 3,
      date: "13 Jan 2026",
      heure: "16:45",
      utilisateur: "Admin System",
      action: "Création",
      dossier: "BESD-24-009",
      detail: "Nouveau dossier ouvert pour ANAGESSA",
    },
    {
      id: 4,
      date: "13 Jan 2026",
      heure: "09:30",
      utilisateur: "NDAYIRAGIJE J.M.V.",
      action: "Rejet",
      dossier: "BESD-24-005",
      detail: "Documents incomplets",
    },
  ];

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (l) =>
        (l.dossier.toLowerCase().includes(search.toLowerCase()) ||
          l.utilisateur.toLowerCase().includes(search.toLowerCase())) &&
        (filterAction === "" || l.action === filterAction)
    );
  }, [search, filterAction]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 mt-16">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Historique des Actions
          </h1>
          <p className="text-slate-500 font-medium text-sm italic">
            Traçabilité complète des dossiers BESD
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 shadow-sm transition-all active:scale-95">
          <Download size={16} /> Exporter le log
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* BARRE DE FILTRES */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher par dossier ou utilisateur..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-red-600 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase outline-none cursor-pointer shadow-sm">
              <option value="">Toutes les actions</option>
              <option value="Création">Création</option>
              <option value="Modification">Modification</option>
              <option value="Validation">Validation</option>
              <option value="Rejet">Rejet</option>
            </select>
            <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 transition-all shadow-sm">
              <Calendar size={18} />
            </button>
          </div>
        </div>

        {/* LISTE DES LOGS */}
        <div className="min-h-[400px]">
          {filteredLogs.map((log) => (
            <HistoryRow key={log.id} {...log} />
          ))}
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
              <History size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">
                Aucune activité enregistrée pour cette recherche.
              </p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/10">
          <p className="text-[10px] font-black uppercase text-slate-400 italic">
            Logs enregistrés : {filteredLogs.length}
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 disabled:opacity-30">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
