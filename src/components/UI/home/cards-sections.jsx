import React,{useEffect,useState} from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  Archive,
  XCircle,
  InboxIcon,
} from "lucide-react";
import { fetchAPI } from "@/app/_utils/fetchApi";
// Définition de toutes les cartes disponibles
const ALL_CARDS = [
  {
    key: "total",
    label: "Dossier total",
    value: 550,
    color: "text-secondary",
    bg: "bg-red-50 dark:bg-red-200/10",
    icon: <FileText size={18} />,
  },
  {
    key: "en_traitement",
    label: "En traitement",
    value: 222,
    color: "text-background-foreground",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Clock size={18} />,
  },
  {
    key: "traites",
    label: "Traités",
    value: 50,
    color: "text-primary",
    bg: "bg-green-50 dark:bg-green-200/10",
    icon: <CheckCircle2 size={18} />,
  },
  {
    key: "archives",
    label: "Archivés",
    value: 100,
    color: "text-background-foreground/70",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Archive size={18} />,
  },
  {
    key: "rejetes",
    label: "Rejetés",
    value: 30,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-200/20",
    icon: <XCircle size={18} />,
  },
  {
    key: "a_traiter",
    label: "À traiter",
    value: 178,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-200/10",
    icon: <InboxIcon size={18} />,
  },
  {
    key: "a_archiver",
    label: "À archiver",
    value: 45,
    color: "text-background-foreground/70",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Archive size={18} />,
  },
];

// Cartes visibles par rôle
const CARDS_BY_ROLE = {
  // Chef voit tout
  chef: ["total", "en_traitement", "traites", "archives", "rejetes"],
  // Secrétariat
  secretariat: ["total", "a_traiter", "a_archiver"],
  // De cellule
  cellule: ["total", "en_traitement", "traites"],
  // Conseiller
  conseiller: ["total", "en_traitement", "traites"],
};

export default function CardsSections({ stats, role }) {
  // Récupérer les clés autorisées pour ce rôle (fallback : tout afficher)
const [data,setData]=useState([])
  useEffect(()=>{
   const fetchData=async()=>{
    const response=await fetchAPI("get","/dossiers/total-count/",{
      params:{},
      additionalHeaders:{},
      body:{}
    })

    const ALL_CARDS = [
  {
    key: "total",
    label: "Dossier total",
    value: response?.total_dossiers || 0,
    color: "text-secondary",
    bg: "bg-red-50 dark:bg-red-200/10",
    icon: <FileText size={18} />,
  },
  {
    key: "en_traitement",
    label: "En traitement",
    value: response?.total_par_etat?.total_in_processing || 0,
    color: "text-background-foreground",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Clock size={18} />,
  },
  {
    key: "traites",
    label: "Traités",
    value: response?.total_par_etat?.total_validated || 0,
    color: "text-primary",
    bg: "bg-green-50 dark:bg-green-200/10",
    icon: <CheckCircle2 size={18} />,
  },
  {
    key: "archives",
    label: "Archivés",
    value: response?.total_par_etat?.total_archived || 0,
    color: "text-background-foreground/70",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Archive size={18} />,
  },
  {
    key: "rejetes",
    label: "Rejetés",
    value: response?.total_par_etat?.total_reject || 0,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-200/20",
    icon: <XCircle size={18} />,
  },
  {
    key: "a_traiter",
    label: "À traiter",
    value: response?.total_par_etat?.total_to_process || 0,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-200/10",
    icon: <InboxIcon size={18} />,
  },
  {
    key: "a_archiver",
    label: "À archiver",
    value: 45,
    color: "text-background-foreground/70",
    bg: "bg-slate-50 dark:bg-slate-200/10",
    icon: <Archive size={18} />,
  },
];

    setData(ALL_CARDS)
   }
  fetchData()
   
  },[])
  const allowedKeys = CARDS_BY_ROLE[role] ?? data?.map((c) => c.key);
  // Filtrer les cartes seconslon le rôle
  const visibleCards = data?.filter((card) =>
    allowedKeys.includes(card.key),
  );

  // Nombre de colonnes dynamique selon le nombre de cartes
  const colClass =
    visibleCards.length <= 3
      ? "grid-cols-1 sm:grid-cols-3"
      : visibleCards.length === 4
        ? "grid-cols-2 md:grid-cols-4"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <div className={`grid ${colClass} gap-4 text-sm font-medium`}>
      {visibleCards.map((card) => (
        <MiniStat
          key={card.key}
          label={card.label}
          value={stats?.[card.key] ?? card.value}
          color={card.color}
          bg={card.bg}
          icon={card.icon}
        />
      ))}
    </div>
  );
}

function MiniStat({ label, value, color, bg, icon }) {
  return (
    <div
      className={`
        ${bg} ${color}  
        p-5 rounded-lg 
        border border-transparent 
        flex flex-col gap-3
        transition-all duration-300 ease-out
        cursor-pointer
        hover:-translate-y-2 shadow hover:shadow-2xl hover:shadow-slate-200 
      `}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 bg-sidebar dark:bg-background rounded-lg shadow-sm ">
          {icon}
        </div>
        <span className="text-4xl font-semibold">{value || 0}</span>
      </div>
      <p className="text-[15px] font-medium ml-1">{label}</p>
    </div>
  );
}
