"use client";

import { useState, useMemo, useEffect, useContext } from "react";
import { DossierFilters } from "./DossierFilters";
import { DossierTable } from "./DossierTable";
import { AddDossierModal } from "./AddDossierModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AllDocs from "./all-docs";
import NewDocs from "./new-docs";
import NoAssignedDocs from "./no-assigned-docs";
import AssignedDocs from "./assigned-docs";
import { FolderOpen, HardDrive, Plus, UserPlus } from "lucide-react";
import { UserContext } from "@/src/components/UI/context/User_Context";
import { fetchAPI } from "@/app/_utils/fetchApi";
// --- GÉNÉRATEUR DE DONNÉES ---
const generateDossiersComplet = () => {
  const data = {};
  const cellules = ["Cellule PESSE", "Cellule SEAG", "Cellule FESPP"];
  const agents = [
    "Jean NKURUNZIZA",
    "Florence KWIZERA",
    "Emmanuel NIYONGABO",
    "Alice BUZINGO",
  ];

  for (let i = 1; i <= 20; i++) {
    const id = `BESD-26-${i < 10 ? "00" + i : "0" + i}`;
    const isAssigned = i % 3 !== 0;
    data[id] = {
      id,
      reference: `REF-2026-${100 + i}`,
      titre:
        i % 2 === 0 ? `Dossier Technique ${id}` : `Audit Infrastructure ${id}`,
      description: "Analyse des systèmes et monitoring 2026.",
      date_creation: `2026-01-10`,
      statut: isAssigned ? "En cours" : "Nouveau",
      urgence: i % 5 === 0,
      confidentialite: i % 4 === 0 ? "Secret" : "Normale",
      cellules: [cellules[i % 3]],
      agents: isAssigned ? [agents[i % 4]] : [],
      categories: [
        { nom: "Plans", fichiers: [{ id: 1, name: "Doc.pdf", url: "#" }] },
      ],
      historique: [{ action: "Création", user: "Système", date: "10/01/2026" }],
    };
  }
  return data;
};
const DATA = generateDossiersComplet();

// Mapping des agents par cellule
const agentsParCellule = {
  "Cellule PESSE": ["Emmanuel NIYONGABO", "Alice BUZINGO"],
  "Cellule SEAG": ["Florence KWIZERA", "Jean NKURUNZIZA"],
  "Cellule FESPP": ["Jean NKURUNZIZA", "Alice BUZINGO"],
};

export default function Dossier() {
  const [dossiers] = useState(DATA);
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    cellule: "Toutes",
    priorite: "Tous",
    agent: "",
    view: "Assignés",
  });
  const [modals, setModals] = useState({
    add: false,
    assign: null,
    detail: null,
  });
  const [activeMenu, setActiveMenu] = useState(null);

  // Fermer le menu contextuel au clic extérieur
  useEffect(() => {
    const closeAllMenus = () => setActiveMenu(null);
    window.addEventListener("click", closeAllMenus);
    return () => window.removeEventListener("click", closeAllMenus);
  }, []);
  const { session } = useContext(UserContext);
  // Filtrage
  const filteredDossiers = useMemo(() => {
    return Object.values(dossiers).filter((d) => {
      const matchSearch =
        d.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.reference.toLowerCase().includes(filters.search.toLowerCase()) ||
        d.id.includes(filters.search);
      const matchCellule =
        filters.cellule === "Toutes" || d.cellules.includes(filters.cellule);
      const matchPriorite =
        filters.priorite === "Tous" ||
        (filters.priorite === "Urgent" ? d.urgence : !d.urgence);
      const matchAgent = !filters.agent || d.agents.includes(filters.agent);
      const isAssigned = d.agents.length > 0;
      const matchView =
        filters.view === "Tous" ||
        (filters.view === "Assignés" ? isAssigned : !isAssigned);

      return (
        matchSearch && matchCellule && matchPriorite && matchAgent && matchView
      );
    });
  }, [filters, dossiers]);
  const [countData, setCountData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI(
          "get",
          "dossiers/count_dossiers",
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        // setDossiers(formattedData);
        setCountData(responseDossiers);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [session]);

  return (
    <div className="min-h-screen  p-2  rounded-lg">
      <div className=" space-y-6">
        {/* Barre d'actions */}
        <div className=" items-center justify-between gap-4 bg-sidebar p-2 rounded-lg">
          <div className="flex flex-col gap-8 p-2 w-full">
            <AddDossierModal />
            <Tabs defaultValue="overview" className="w-full ">
              <TabsList className="rounded-lg p-2 h-28">
                <TabsTrigger
                  value="overview"
                  className="text-base rounded-lg p-4  data-active:border-primary/60"
                >
                  Tous{" "}
                  <Badge variant="outline">{countData?.total_dossiers}</Badge>
                </TabsTrigger>
                {session && session?.type_service == "Secretariat" ? null : (
                  <>
                    <TabsTrigger
                      value="new"
                      className="text-base rounded-lg p-4 data-active:border-primary/60"
                    >
                      Nouveau{" "}
                      <Badge className="animate-bounce">
                        {countData?.dossiers_nouveaux}
                      </Badge>
                    </TabsTrigger>

                    <TabsTrigger
                      value="no-assigned"
                      className="text-base rounded-lg p-4 data-active:border-primary/60"
                    >
                      Non assignés{" "}
                      <Badge variant="destructive">
                        {countData?.dossiers_non_assignes}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="assigned"
                      className="text-base rounded-lg p-4 data-active:border-primary/60"
                    >
                      Assignés{" "}
                      <Badge variant="outline">
                        {countData?.dossiers_assignes}
                      </Badge>
                    </TabsTrigger>
                  </>
                )}
              </TabsList>
              <TabsContent value="overview">
                <AllDocs />
              </TabsContent>
              <TabsContent value="none">
                {/* Filtres */}
                <DossierFilters filters={filters} setFilters={setFilters} />
                {/* Tableau */}
                <DossierTable
                  dossiers={filteredDossiers}
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  onAssign={(d) => setModals({ ...modals, assign: d })}
                  onDetail={(d) => setModals({ ...modals, detail: d })}
                />
              </TabsContent>
              <TabsContent value="new">
                <NewDocs />
              </TabsContent>
              <TabsContent value="no-assigned">
                <NoAssignedDocs />
              </TabsContent>
              <TabsContent value="assigned">
                <AssignedDocs />
              </TabsContent>
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and options. Customize
                      your experience to fit your needs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-muted-foreground text-sm">
                    Configure notifications, security, and themes.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* --- MODALES --- */}

      {/* 1. AddModal (Nouveau Dossier) */}
      {modals.add && (
        <div className="fixed inset-0 z-300 flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-3xl h-max  rounded-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Header */}
            <div className="h-1.5 w-full flex">
              <div className="flex-1 bg-[#CE1126]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#00A651]" />
            </div>
            <div className="p-8">
              <div className="p-1  flex justify-between items-center bg-white">
                <h2 className="text-xl font-medium uppercase  text-slate-800 tracking-tight">
                  Création de Dossier
                </h2>
                {/* <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} />
          </button> */}
              </div>

              <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[75vh] overflow-y-auto">
                {/* Section Gauche : Informations Textuelles */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium  text-slate-400 ml-1">
                      Objet du dossier
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Audit financier ODECA"
                      className="w-full p-4 bg-slate-50 rounded-lg text-sm font-medium outline-none border border-transparent focus:border-[#15803d] transition-all"
                      onChange={(e) =>
                        setForm({ ...form, objet: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-medium  text-slate-400 ml-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Détails du dossier..."
                      className="w-full p-4 bg-slate-50 rounded-lg text-sm font-medium h-24 outline-none border border-transparent focus:border-[#15803d] resize-none"
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] font-medium  text-slate-400 ml-1">
                      Observations
                    </label>
                    <textarea
                      placeholder="Notes ou remarques particulières..."
                      className="w-full p-4 bg-slate-50 rounded-lg text-sm font-medium h-24 outline-none border border-transparent focus:border-[#15803d] resize-none text-slate-500"
                      onChange={(e) =>
                        setForm({ ...form, observation: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Section Droite : Gestion des Fichiers */}
                <div className="space-y-6">
                  {/* Zone 1 : Dossier Principal */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium text-slate-400 ml-1">
                      Document Principal
                    </label>
                    <div
                      onClick={() => mainInputRef.current.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setMainDoc(e.dataTransfer.files[0]);
                      }}
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-emerald-900 ${mainDoc ? "border-[#15803d] bg-emerald-50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <input
                        type="file"
                        ref={mainInputRef}
                        className="hidden"
                        onChange={(e) => setMainDoc(e.target.files[0])}
                      />
                      <HardDrive
                        size={24}
                        className={
                          mainDoc ? "text-[#15803d]" : "text-slate-300"
                        }
                      />
                      <p className="text-[12px] font-medium text-center leading-tight">
                        {mainDoc
                          ? mainDoc.name
                          : "Glisser ou cliquer pour le fichier maître"}
                      </p>
                    </div>
                  </div>

                  {/* Zone 2 : Annexes et Import de Dossiers */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-medium  text-slate-400 ml-1">
                      Annexes / Importation Dossier
                    </label>
                    <div
                      onClick={() => annexInputRef.current.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setAnnexes([
                          ...annexes,
                          ...Array.from(e.dataTransfer.files),
                        ]);
                      }}
                      className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:border-emerald-900 transition-all"
                    >
                      <input
                        type="file"
                        ref={annexInputRef}
                        className="hidden"
                        multiple
                        webkitdirectory="true"
                        directory="true"
                        onChange={(e) =>
                          setAnnexes([
                            ...annexes,
                            ...Array.from(e.target.files),
                          ])
                        }
                      />
                      <FolderOpen size={24} className="text-slate-300" />
                      <div className="text-center">
                        <p className="text-[12px] font-medium">
                          Glisser ou cliquer ici
                        </p>
                        {annexes.length > 0 && (
                          <p className="text-[9px] text-[#15803d] font-bold mt-1  ">
                            {annexes.length} fichiers ajoutés
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <div className="bg-blue-50 p-4 rounded-xl flex gap-3 border border-blue-100">
              <Info size={16} className="text-blue-500 shrink-0" />
              <p className="text-[9px] text-blue-700 font-bold leading-tight uppercase">
                L'importation de dossier scanne tous les sous-fichiers pour une
                indexation complète au BESD.
              </p>
            </div> */}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="w-full    px-24 mt-10 bg-white flex flex-row justify-between gap-x-8">
                <button
                  onClick={onClose}
                  className=" px-3 py-2 border border-slate-600 rounded-lg  text-base text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  className=" bg-[#15803d] text-white px-3 py-2 rounded-lg text-base  shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-95 transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AssignModal (Pour dossiers non assignés) */}
      {modals.assign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Barre de couleur Burundi Style */}
            <div className="h-1.5 w-full flex">
              <div className="flex-1 bg-[#CE1126]" />
              <div className="flex-1 bg-white" />
              <div className="flex-1 bg-[#00A651]" />
            </div>

            <div className="p-8">
              {/* Header dynamique */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                    <UserPlus className="text-emerald-600" size={28} />
                    Assignation
                  </h2>
                  <p className="text-sm text-slate-400 font-medium">
                    Dossier :{" "}
                    <span className="text-slate-900 font-bold">
                      {modals.assign.id}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModals({ ...modals, assign: null });
                    setAssignStep(1);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Barre de progression discrète */}
              <div className="flex gap-2 mb-8">
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${assignStep >= 1 ? "bg-emerald-500" : "bg-slate-100"}`}
                />
                <div
                  className={`h-1 flex-1 rounded-full transition-all ${assignStep >= 2 ? "bg-emerald-500" : "bg-slate-100"}`}
                />
              </div>

              {/* ÉTAPE 1 : CHOIX DE LA CELLULE */}
              {assignStep === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Étape 1 : Choisir la cellule destinataire
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Cellule PESSE", "Cellule SEAG", "Cellule FESPP"].map(
                      (cellule) => (
                        <button
                          key={cellule}
                          onClick={() => {
                            setSelectedCellule(cellule);
                            setAssignStep(2);
                          }}
                          className="group w-full flex items-center justify-between p-5 rounded-xl border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white shadow-sm rounded-lg group-hover:scale-110 transition-transform">
                              <Archive className="text-emerald-600" size={20} />
                            </div>
                            <span className="font-bold text-slate-700">
                              {cellule}
                            </span>
                          </div>
                          <ChevronRight
                            size={18}
                            className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all"
                          />
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : CHOIX DE L'AGENT */}
              {assignStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAssignStep(1)}
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-400"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Étape 2 : Sélectionner l'agent dans {selectedCellule}
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {agentsAffiches.map((agent) => (
                      <button
                        key={agent}
                        onClick={() => {
                          // Logique finale ici
                          console.log(
                            `Assigné à ${agent} de la ${selectedCellule}`,
                          );
                          setModals({ ...modals, assign: null });
                          setAssignStep(1);
                        }}
                        className="group flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50 transition-all gap-3 text-center"
                      >
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <UserCheck
                            className="text-slate-400 group-hover:text-emerald-600"
                            size={24}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-tighter leading-tight">
                          {agent}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => {
                    setModals({ ...modals, assign: null });
                    setAssignStep(1);
                  }}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-rose-500 transition-colors"
                >
                  Abandonner l'assignation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. DetailModal (Pour dossiers assignés) */}
      {modals.detail && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-10 shadow-2xl relative">
            <button
              onClick={() => setModals({ ...modals, detail: null })}
              className="absolute top-6 right-6 p-2"
            >
              <X size={20} />
            </button>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase border border-blue-100">
              Dossier en cours
            </span>
            <h2 className="text-2xl font-black text-slate-800 mt-4 mb-2">
              {modals.detail.titre}
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              {modals.detail.description}
            </p>
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-lg">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Agent Responsable
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {modals.detail.agents[0]}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                  Cellule
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {modals.detail.cellules[0]}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedId(modals.detail.id);
                setModals({ ...modals, detail: null });
              }}
              className="w-full mt-6 bg-slate-900 text-white font-black py-4 rounded-lg text-[11px] uppercase tracking-widest"
            >
              Ouvrir l'espace de travail
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
