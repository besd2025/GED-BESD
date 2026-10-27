import { Badge } from "@/components/ui/badge";
import { History, User } from "lucide-react";

/**
 * ActivityTimeline — Affiche l'historique des actions sur un dossier.
 * @param {{ historique: Array<{ action: string, user: string, date: string }> }} props
 */
export default function ActivityTimeline({ historiquesData }) {
  const historique = historiquesData?.map((item)=>(
     {
      action: item?.action,
      user: item?.user_full_name,
      date: item?.date_action,
      status: item?.role_name,
    } )
  ) 
  return (
    <div className="bg-sidebar backdrop-blur-3xl p-4 rounded-lg shadow-sm relative">
      <h3 className="text-sm font-medium  text-sidebar-foreground/60 mb-6 flex items-center gap-2  ">
        <History size={24} className="text-emerald-600" /> Activité récente
      </h3>
      <div className="space-y-6 max-h-[300px] overflow-y-auto px-2">
        {historiquesData?.length > 0 ? (
          historique.map((h, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-slate-300">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-secondary" />
              <p className="text-sm font-semibold text-sidebar-foreground/90 uppercase leading-none">
                {h.action}
              </p>
              <p className="text-xs font-medium text-sidebar-foreground/60 mt-1 flex items-center gap-2">
                <User size={18} className="text-emerald-600" />
                {h.user}
                <Badge className="bg-emerald-600/80 text-white text-xs">
                  {h.status}
                </Badge>
              </p>
              <p className="text-xs text-sidebar-foreground/60   mt-1">
                Le {h.date}
              </p>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-slate-400 italic">
            Aucun historique disponible.
          </p>
        )}
      </div>
    </div>
  );
}
