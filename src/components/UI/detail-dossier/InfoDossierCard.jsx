import {
  Building2,
  UserCircle2,
  CalendarDays,
  User,
  BetweenHorizontalEnd,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
/**
 * InfoDossierCard — Carte affichant les informations de cellule, assignation et date de fin.
 * //@param {{ dossier: { cellule?: string, assignation?: string, dateFin?: string } }} props
 */
export default function InfoDossierCard({ data }) {
  console.log(data);
  const dossier = {
    cellule: data?.utilisateur?.bureau_cellule,
    assignation: "Équipe IT",
    user:
      data?.utilisateur?.prenom +
      " " +
      [data?.utilisateur?.nom].join(" ").slice(0, 3) +
      ".",
    status: data?.utilisateur?.role,
    dateFin: data?.date_fin,
  };

  const infos = [
    {
      label: "Cellule",
      value: dossier.cellule || "Non définie",
      icon: BetweenHorizontalEnd,
      color: "text-sidebar-foreground uppercase",
      bg: "bg-background",
    },
    {
      label: "Assignation",
      value: dossier.assignation || "Non assigné",
      user: dossier.user,
      status: dossier.status,
      icon: UserCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Date de fin",
      value: dossier.dateFin || "Non définie",
      icon: CalendarDays,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
  ];

  return (
    <div className="bg-sidebar dark:bg-slate-800 p-4 rounded-lg">
      <h3 className="text-base font-medium text-sidebar-foreground/80 mb-4 uppercase">
        Informations Complémentaires
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {infos.map((info, idx) => {
          const Icon = info.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800"
            >
              <div
                className={`p-2 rounded-full flex items-center justify-center ${info.bg} ${info.color}`}
              >
                <Icon size={20} />
              </div>
              <div className="">
                <p className="text-sm  text-slate-500 dark:text-slate-400  mb-1">
                  {info.label}
                </p>
                {info.label === "Assignation" ? (
                  <p className="text-sm font-medium text-sidebar-foreground mt-1 flex flex-col items-center gap-1">
                    <span className="line-clamp-1 uppercase">{info.user}</span>
                    <Badge className="bg-emerald-600/80 text-white text-xs">
                      {info.status}
                    </Badge>
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {info.value}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
