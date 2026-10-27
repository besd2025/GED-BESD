"use client";

import { Plus, UserMinus, UserCheck } from "lucide-react";

export function DossierToolbar({ filters, setFilters, onNewDossier }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-100">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onNewDossier}
          className="bg-[#CE1126] text-white px-8 py-4 rounded-lg font-medium text-[15px] uppercase flex items-center gap-3 shadow-xl hover:bg-red-700 transition-all"
        >
          <Plus size={18} /> Nouveau Dossier
        </button>
      </div>
    </div>
  );
}
