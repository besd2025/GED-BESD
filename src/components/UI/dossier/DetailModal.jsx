"use client";

import { X } from "lucide-react";

export function DetailModal({ dossier, onClose, onOpenWorkspace }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-10 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2">
          <X size={20} />
        </button>

        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase border border-blue-100">
          Dossier en cours
        </span>

        <h2 className="text-2xl font-black text-slate-800 mt-4 mb-2">
          {dossier.titre}
        </h2>
        <p className="text-sm text-slate-500 mb-8">{dossier.description}</p>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-lg">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
              Agent Responsable
            </p>
            <p className="text-sm font-bold text-slate-800">
              {dossier.agents[0]}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
              Cellule
            </p>
            <p className="text-sm font-bold text-slate-800">
              {dossier.cellules[0]}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenWorkspace(dossier.id)}
          className="w-full mt-6 bg-slate-900 text-white font-black py-4 rounded-lg text-[11px] uppercase tracking-widest"
        >
          Ouvrir l'espace de travail
        </button>
      </div>
    </div>
  );
}
