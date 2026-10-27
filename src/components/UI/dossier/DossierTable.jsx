"use client";

import {
  MoreVertical,
  ChevronRight,
  UserPlus,
  Eye,
  X,
  Archive,
  UserCheck,
  UserMinus,
} from "lucide-react";

export function DossierTable({
  dossiers,
  activeMenu,
  setActiveMenu,
  onAssign,
  onDetail,
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 px-8 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-400 border-b border-slate-100 text-left">
            <th className="px-8 py-6">ID / Cellule</th>
            <th className="px-8 py-6">Objet du Dossier</th>
            <th className="px-8 py-6">Agent Responsable</th>
            <th className="px-8 py-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {dossiers.map((d) => (
            <tr
              key={d.id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              {/* ID / Cellule */}
              <td className="px-8 py-4">
                <div className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {d.id}
                </div>
                <div className="text-[13px] text-slate-500 font-normal line-clamp-1">
                  {d.cellules[0]}
                </div>
              </td>

              {/* Titre */}
              <td className="px-8 py-5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {d.titre}
                  </span>
                </div>
              </td>

              {/* Agent */}
              <td className="px-8 py-5">
                {d.agents.length > 0 ? (
                  <span className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-600">
                    <UserCheck className="text-[#1EB53A]" size={15} />
                    {d.agents[0]}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-600">
                    <UserMinus className="text-[#CE1126]" size={15} /> Non
                    assigné
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-2 py-2 text-right relative">
                <div className="inline-block relative">
                  {/* Bouton déclencheur */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === d.id ? null : d.id);
                    }}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      activeMenu === d.id
                        ? "text-slate-400 shadow-lg scale-110"
                        : "hover:text-slate-400"
                    }`}
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Menu contextuel */}
                  {activeMenu === d.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 py-3 animate-in fade-in zoom-in-95 duration-200"
                    >
                      {/* Assigner ou Ouvrir */}
                      {d.agents.length === 0 ? (
                        <button
                          onClick={() => {
                            onAssign(d);
                            setActiveMenu(null);
                          }}
                          className="group/btn w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium text-[#1EB53A] hover:bg-emerald-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1EB53A] text-white rounded-lg">
                              <UserPlus size={18} />
                            </div>
                            <span>Assigner un agent</span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="opacity-0 group-hover/btn:opacity-100 transition-all"
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            onDetail(d);
                            setActiveMenu(null);
                          }}
                          className="group/btn w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium text-[#1EB53A] hover:bg-emerald-50 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1EB53A] text-white rounded-lg">
                              <Eye size={18} />
                            </div>
                            <span>Ouvrir le dossier</span>
                          </div>
                          <ChevronRight
                            size={14}
                            className="opacity-0 group-hover/btn:opacity-100 transition-all"
                          />
                        </button>
                      )}

                      {/* Rejeter */}
                      <button
                        onClick={() => {
                          console.log("Rejeté:", d.id);
                          setActiveMenu(null);
                        }}
                        className="group/btn w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-[#CE1126] hover:bg-red-50 transition-all"
                      >
                        <div className="p-2 text-white bg-[#CE1126] rounded-lg">
                          <X size={18} />
                        </div>
                        <div className="text-left">
                          <p>Rejeter le dossier</p>
                          <p className="text-[12px] font-medium text-[#CE1126] opacity-0 group-hover/btn:opacity-100 transition-opacity">
                            Action définitive
                          </p>
                        </div>
                      </button>

                      {/* Archiver */}
                      <button className="group/btn w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-slate-500 hover:bg-slate-50 transition-all">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover/btn:text-slate-900 transition-colors">
                          <Archive size={18} />
                        </div>
                        <span>Archiver</span>
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
