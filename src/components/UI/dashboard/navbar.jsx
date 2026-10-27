"use client";
import { useState, useRef, useEffect, useContext } from "react";
import Link from "next/link";
import {
  Bell,
  UserCircle,
  Clock,
  MessageSquare,
  UserPlus,
  XCircle,
  FileText,
  CheckCircle2,
  Pin,
  PinOff,
  ChevronRight,
  Menu,
  Trash2,
  Folder,
} from "lucide-react";
import { UserContext } from "@/src/components/UI/context/User_Context";
import { ModeToggle } from "@/components/ui/dark-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar({
  onViewDossier,
  isSidebarLocked,
  setIsSidebarLocked,
  isExpanded,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const [items, setItems] = useState([
    {
      id: 1,
      dossierId: "BESD-24-001",
      type: "deadline",
      title: "Urgent : Échéance",
      desc: "Le dossier BESD-24-001 arrive à expiration demain.",
      time: "10 min",
      isUnread: true,
      icon: <Clock size={16} />,
      color: "text-[#CE1126] bg-secondary/5 border-secondary/10",
    },
    {
      id: 2,
      dossierId: "ANAGESSA-02",
      type: "message",
      title: "Nouvelle Observation",
      desc: "Le Directeur a ajouté une note technique sur 'ANAGESSA'.",
      time: "1h",
      isUnread: true,
      icon: <MessageSquare size={16} />,
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      id: 3,
      dossierId: "RN1-CONST",
      type: "rejet",
      title: "Dossier Rejeté",
      desc: "Le dossier 'Construction RN1' a été marqué comme non-conforme.",
      time: "3h",
      isUnread: true,
      icon: <XCircle size={16} />,
      color: "text-slate-600 bg-slate-50 border-slate-100",
    },
    {
      id: 5,
      dossierId: "RN1-CONST2",
      type: "rejet",
      title: "Nouveau dossier ajoute",
      desc: "Le dossier 'Construction RN1' a été ajoute.",
      time: "3h",
      isUnread: true,
      icon: <Folder size={16} />,
      color: "text-slate-600 bg-slate-50 border-slate-100",
    },
    {
      id: 4,
      dossierId: "AUDIT-24",
      type: "assign",
      title: "Nouvelle Assignation",
      desc: "On vous a confié le suivi du dossier 'Audit Carburant'.",
      time: "Hier",
      isUnread: false,
      icon: <UserPlus size={16} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ]);

  const unreadCount = items.filter((i) => i.isUnread).length;

  const handleNotificationClick = (notif) => {
    setItems(
      items.map((item) =>
        item.id === notif.id ? { ...item, isUnread: false } : item,
      ),
    );
    setShowNotifications(false);
    if (onViewDossier) onViewDossier(notif.dossierId);
    window.location.href = `/dashboard/dossier?open=${notif.dossierId}`;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { session } = useContext(UserContext);
  return (
    <header
      className={`fixed overflow-hidden top-0 right-0 h-20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-sidebar backdrop-blur-xl border-b border-background/60 px-8 flex items-center justify-between z-[50] shadow-sm ${
        isExpanded ? "left-64" : "left-20"
      }`}
    >
      {/* Côté Gauche : Logo & Lock */}
      <div className="flex items-center gap-6">
        <button
          onClick={() => setIsSidebarLocked(!isSidebarLocked)}
          className={`group p-2.5 rounded-lg transition-all duration-300 border  ${
            isSidebarLocked
              ? "bg-primary text-white border-primary shadow-lg shadow-emerald-200"
              : "bg-sidebar text-slate-400 dark:text-sidebar-foreground border-background hover:border-primary hover:text-primary"
          }`}
        >
          {isSidebarLocked ? (
            <Menu size={20} className="rotate-180" />
          ) : (
            <Menu size={20} />
          )}
        </button>

        <div className="flex flex-col">
          <h2 className="text-[20px]  font-black text-primary leading-none">
            Système de Gestion des Dossiers
          </h2>
          <p className="text-lg font-semibold text-secondary mt-1">| BESD |</p>
        </div>
      </div>
      <div className="absolute top-0 right-36 w-full h-full pointer-events-none ">
        <div className="absolute top-0 left-0 w-full h-full border-120 border-primary/70 bg-primary/80 rotate-45 transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Côté Droit : Actions */}
      <div className="flex items-center gap-6">
        <ModeToggle
          className="text-sidebar-foreground bg-background"
          strokeWidth={2}
        />
        {/* Centre de Notifications */}
        <div className="relative" ref={notificationRef}>
          {/* <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-all duration-300 ${
              showNotifications
                ? "bg-primary text-primary-foreground scale-95"
                : "bg-background text-sidebar-foreground"
            }`}
          >
            <Bell size={24} strokeWidth={1.5} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-lg h-3 w-3 bg-[#CE1126] border-2 border-white"></span>
              </span>
            )}
          </button> */}
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Button
                variant="outline"
                className={`relative p-2 rounded-full transition-all duration-300 ${
                  showNotifications
                    ? "bg-primary text-primary-foreground scale-95"
                    : "bg-background text-sidebar-foreground"
                }`}
              >
                <Bell size={24} strokeWidth={1.5} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-lg h-3 w-3 bg-[#CE1126] border-2 border-white"></span>
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-max scrollbar-hide shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)]"
              align="left"
            >
              <div className="   backdrop-blur-2xl rounded-lg   overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                <div className="p-4 bg-linear-to-br from-primary/80 to-sidebar flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-sidebar-foreground">
                      Notifications
                    </h3>
                  </div>
                  <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm  tracking-tighter shadow-md shadow-emerald-100">
                    {unreadCount} Nouvelles
                  </span>
                </div>

                <div className="max-h-[350px] max-w-[450px] overflow-y-auto scrollbar-hide">
                  {items.map((n, i = 0) => (
                    <>
                      <DropdownMenuItem className="" id={n.id}>
                        <div
                          key={i + 1}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full group p-5  cursor-pointer transition-all flex gap-4 relative ${
                            n.isUnread ? "" : ""
                          }`}
                        >
                          <div
                            className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border ${n.color} transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm`}
                          >
                            {n.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <span
                                className={`text-sm font-bold uppercase tracking-tight ${n.isUnread ? "text-[#15803d]" : "text-slate-400"}`}
                              >
                                {n.title}
                              </span>
                              <span className="text-xs font-medium text-slate-400">
                                {n.time}
                              </span>
                            </div>
                            <p className="text-xs leading-snug text-slate-600 line-clamp-2 font-medium ">
                              {n.desc}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-xs  font-medium px-2 py-0.5 bg-background dark:bg-sidebar text-slate-500 rounded-lg">
                                Ref: {n.dossierId}
                              </span>
                              <ChevronRight
                                size={14}
                                className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0"
                              />
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setItems(items.map((i) => ({ ...i, isUnread: false })))
                  }
                  className="w-full flex justify-center py-4 text-sm  text-background-foreground hover:text-secondary/80 hover:bg-secondary/5 transition-all bg-sidebar border-t border-background shadow"
                >
                  <span className="flex items-center justify-center gap-1">
                    <Trash2 size={22} />
                  </span>
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profil Utilisateur */}
        <Link
          href="/dashboard/utilisateur"
          className="flex items-center gap-4 pl-10 border-l border-slate-200 group no-underline z-10"
        >
          <div className="text-right hidden sm:block">
            <p className=" text-base font-medium text-primary-foreground leading-none group-hover:text-background transition-colors">
              {session?.prenom}
            </p>
            <p className="text-xs text-primary-foreground/80 uppercase tracking-tight mt-1">
              {session?.type_service === "Bureau" ||
              session?.type_service === "Secretariat"
                ? session?.role
                : session?.role + " " + session?.cellule}
            </p>
          </div>
          <div className="relative">
            <div className="w-12 h-12 bg-sidebar rounded-lg border-2 border-slate-100 flex items-center justify-center text-slate-400 group-hover:border-emerald-500 group-hover:bg-emerald-50 group-hover:text-[#15803d] transition-all duration-500 shadow-sm overflow-hidden">
              <UserCircle size={28} strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-lg shadow-sm"></div>
          </div>
        </Link>
      </div>
    </header>
  );
}
