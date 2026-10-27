"use client";

import { useState, useMemo, useRef,useEffect,useContext } from "react";

import {
  Plus,
  X,
  HardDrive,
  Search,
  MoreVertical,
  Eye,
  UserCheck,
  CheckCircle2,
  Box,
  User,
  Calendar,
  UploadCloud,
  File,
  Paperclip,
  AlertCircle,
  FolderOpen,
  Info,
} from "lucide-react";
import { UserContext } from "../context/User_Context";
import CardsSections from "./cards-sections";
import HomeAnalytics from "./chart/analytics";
import RecentDocx from "./recent-docx";
import { fetchAPI } from "@/app/_utils/fetchApi";

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function Overview() {
  const [dossiers, setDossiers] = useState([]);
  const { session } = useContext(UserContext);

  // Derive a simplified role string from the decoded JWT session (no local state)
  const role = useMemo(() => {
    console.log("Session in role computation:", session);
    if (!session || typeof session === "string") return "";
    const rawRole = session.role ;
    const tokenRole = rawRole ? String(rawRole).toUpperCase() : null;
    if (tokenRole === "SECRETAIRE") return "secretariat";
    if (tokenRole === "CHEF_BUREAU" || tokenRole === "CHEF_ADJOINT_BUREAU") return "chef";
    if (tokenRole === "CHEF_CELLULE" || tokenRole === "CHEF_CELLULE_ADJOINT") return "cellule";
    if (tokenRole === "CONSEILLER") return "conseiller";
    return "";
  }, [session]);


  const [filters, setFilters] = useState({
    search: "",
    priorite: "",
    cellule: "",
    agent: "",
  });
const [data,setData]=useState([])

    useEffect(() => {
      // Debug: inspect the session payload to know where the role comes from

      const fetchData = async () => {
        try {
          const responseDossiers = await fetchAPI("get", "dossiers/recent_dossiers/", {
            params: {},
            additionalHeaders: {},
            body: {},
          });
          const formattedData = responseDossiers?.map((item) => ({
      id: item?.id || 2,
      numero: item?.reference ,
      objet: item?.objet ,
      description: item?.description ,
      statut:  "Traité",
        priorite: item?.niveau_priorite ,
        assigne:  (item?.utilisateur == "Non assigné" || item?.utilisateur == " ") ? "NON ASSIGNÉ" : item?.utilisateur ,
      fonction:  "",
      cellule:  (item?.utilisateur == "Non assigné" || item?.utilisateur == " ") ? "-" : item?.cellule ,
      deadline: item?.date_fin ,
      dateAjout: item?.date_creation,
      status:item?.status
          }));
          setDossiers(formattedData);
        } catch (error) {
          console.error("Erreur:", error);
        }
      };

      fetchData();
    }, [session]);

  const agentsParCellule = {
    Cellule_FESPP: ["NDAYIRAGIJE J.M.V.", "BUZURU D."],
    Cellule_SEAG: ["KWIZERA Florence", "NIZIGIYIMANA J."],
    Cellule_PESSE: ["NIYONGABO E.", "MANIRAKIZA A."],
  };

  // Fonction pour réinitialiser
  const resetFilters = () => {
    setFilters({ search: "", priorite: "", cellule: "", agent: "", date: "" });
  };

  // Liste des agents affichée selon la cellule sélectionnée
  const agentsAffiches = filters.cellule
    ? agentsParCellule[filters.cellule]
    : [];
  const [activeMenu, setActiveMenu] = useState(null);

  // États Modaux
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingDossier, setViewingDossier] = useState(null);
  const [assigningDossier, setAssigningDossier] = useState(null);

  return (
    <div className="space-y-8 pb-10">
      {/* COMPTEURS (6 CARDS) */}
      <CardsSections role={role} />

      {/* SECTION ANALYTICS DYNAMIQUE */}
      <HomeAnalytics />

      {/* SECTION RÉCENTS - Style Équilibré Medium */}
      <RecentDocx dossiers={dossiers} />

      {/* --- MODALS --- */}
      {isAddOpen && (
        <AddDossierModal
          onClose={() => setIsAddOpen(false)}
          onSave={(newD) => setDossiers([newD, ...dossiers])}
        />
      )}
      {viewingDossier && (
        <DetailsModal
          dossier={viewingDossier}
          onClose={() => setViewingDossier(null)}
        />
      )}
      {assigningDossier && (
        <AssignModal
          dossier={assigningDossier}
          onClose={() => setAssigningDossier(null)}
          onAssign={(id, c, a, dl) => {
            setDossiers(
              dossiers.map((d) =>
                d.id === id
                  ? { ...d, cellule: c, assigne: a, deadline: dl }
                  : d,
              ),
            );
            setAssigningDossier(null);
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// SOUS-COMPOSANTS
// ==========================================

function AddDossierModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    objet: "",
    description: "",
    observation: "",
  });
  const [mainDoc, setMainDoc] = useState(null);
  const [annexes, setAnnexes] = useState([]);

  // Refs pour simuler le clic sur les inputs cachés
  const mainInputRef = useRef(null);
  const annexInputRef = useRef(null);

  const handleSave = () => {
    if (!form.objet) return alert("L'objet est obligatoire");

    onSave({
      ...form,
      id: Date.now(),
      numero: `BESD-26-${Math.floor(Math.random() * 900 + 100)}`,
      statut: "En cours",
      dateAjout: new Date().toLocaleDateString(),
      dossierPrincipal: mainDoc ? mainDoc.name : "Non fourni",
      annexes: annexes.map((f) => f.name),
    });
    onClose();
  };

  return (
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
                  onChange={(e) => setForm({ ...form, objet: e.target.value })}
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
                    className={mainDoc ? "text-[#15803d]" : "text-slate-300"}
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
                      setAnnexes([...annexes, ...Array.from(e.target.files)])
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
  );
}

function DetailsModal({ dossier, onClose }) {
  // Simulation des données si elles ne sont pas présentes dans l'objet dossier
  const observations = [
    "Observation 1 : Dossier prioritaire pour le prochain conseil d'administration.",
    "Observation 2 : Vérifier la conformité des signatures sur l'annexe technique.",
  ];

  const agents = dossier.agents || ["NDAYIRAGIJE J.M.V.", "KWIZERA Florence"];
  const piecesJointes = dossier.annexes || [
    "Note_Technique_V1.pdf",
    "Tableau_Charges.xlsx",
  ];

  return (
    <div className="w-full fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
      <div className="bg-white h-150 w-full max-w-5xl m-4 rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 ease-out">
        {/* HEADER : Drapeau & Titre */}
        <header className="relative bg-white  ">
          <div className="h-1.5 w-full flex">
            <div className="flex-1 bg-[#CE1126]" />
            <div className="flex-1 bg-white" />
            <div className="flex-1 bg-[#00A651]" />
          </div>

          <div className="p-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xl font-medium text-slate-900  ] ">
                Fiche de Suivi BESD
              </p>
              <h2 className="text-3xl font-medium text-slate-500">
                {dossier.numero || "BESD-2026-001"}
              </h2>
            </div>

            <div className="flex items-center">
              <span className="inline-flex items-center px-5 py-2 rounded-lg text-[12px] font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm uppercase">
                <span className="w-2 h-2 rounded-lg bg-amber-500 animate-pulse mr-2" />
                État : {dossier.statut || "En cours"}
              </span>
            </div>
          </div>
        </header>

        {/* CORPS DU MODAL */}
        <div className="p-4 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* COLONNE GAUCHE (7/12) */}
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h4 className="text-[12px] font-medium text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                <span>Objet du projet</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              <p className="text-lg font-medium text-slate-800 leading-tight">
                {dossier.objet}
              </p>
            </section>

            <section>
              <h4 className="text-[12px] font-medium text-slate-400   mb-4 flex items-center gap-2">
                <span>Description</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              <p className="text-[12px] font-medium text-slate-500 leading-relaxed  bg-slate-50 p-4 rounded-lg border border-slate-100">
                {dossier.description ||
                  "Aucune description détaillée n'a été saisie."}
              </p>
            </section>

            <section>
              <h4 className="text-[12px] font-medium text-slate-400   mb-4 flex items-center gap-2">
                <span>Observations</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              <div className="space-y-3">
                {observations.length > 0 ? (
                  observations.map((obs, i) => (
                    <div
                      key={i}
                      className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400 flex gap-3"
                    >
                      <Info
                        size={14}
                        className="text-amber-500 shrink-0 mt-1"
                      />
                      <p className="text-[12px] font-medium text-amber-800 leading-snug">
                        {obs}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-slate-400">
                    Aucune observation.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* COLONNE DROITE (5/12) */}
          <div className="lg:col-span-5 space-y-10">
            <section>
              <h4 className="text-[12px] font-medium text-slate-400  tracking-widest mb-4 flex items-center gap-2">
                <span>Responsabilité & Cellule</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              <div className="p-5 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-medium text-[#15803d] mb-3">
                  Cellule : {dossier.cellule || "Cellule FESPP"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {agents.map((agent, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm"
                    >
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-700 uppercase">
                        {agent.charAt(0)}
                      </div>
                      <span className="text-[12px] font-medium text-slate-700">
                        {agent}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-[12px] font-medium text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                <span>Documents & Pièces jointes</span>
                <div className="h-px flex-1 bg-slate-100" />
              </h4>
              <div className="space-y-3">
                {/* Principal */}
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <HardDrive size={18} className="text-[#15803d]" />
                    <span className="text-[12px] font-medium text-emerald-900 truncate max-w-[180px]">
                      {dossier.dossierPrincipal || "Document_Maitre.pdf"}
                    </span>
                  </div>
                  <span className="text-[12px] font-medium bg-emerald-200 text-emerald-700 px-2 py-1 rounded uppercase tracking-tighter">
                    Principal
                  </span>
                </div>

                {/* Annexes */}
                <div className="grid grid-cols-1 gap-2">
                  {piecesJointes.map((file, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 rounded-lg flex items-center gap-3 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Paperclip size={14} className="text-slate-400" />
                      <span className="text-[12px] font-medium text-slate-600 truncate">
                        {file}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="px-8 mt-4  flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-4 bg-[#15803d] text-white rounded-lg text-[15px] font-bold  hover:bg-emerald-700 transition-all active:scale-95 shadow-lg"
          >
            Fermer le dossier
          </button>
        </footer>
      </div>
    </div>
  );
}

function AssignModal({ dossier, onClose, onAssign }) {
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [deadline, setDeadline] = useState("");

  // Base de données des cellules et leurs agents respectifs
  const structure = {
    Cellule_FESPP: ["NDAYIRAGIJE J.M.V.", "BUZURU D.", "NKURUNZIZA P."],
    Cellule_SEAG: ["KWIZERA Florence", "NIZIGIYIMANA J.", "MABANO S."],
    Cellule_PESSE: ["NIYONGABO E.", "MANIRAKIZA A.", "HAKIZIMANA T."],
    Social: ["NININAHAZWE L.", "BUTOYI C."],
  };

  // Récupérer la liste de tous les agents possibles selon les cellules cochées
  const availableAgents = selectedCells.flatMap((cell) => structure[cell]);

  const toggleCell = (cell) => {
    if (selectedCells.includes(cell)) {
      setSelectedCells(selectedCells.filter((c) => c !== cell));
      // Nettoyer les agents qui appartenaient à cette cellule
      const agentsToRemove = structure[cell];
      setSelectedAgents(
        selectedAgents.filter((a) => !agentsToRemove.includes(a)),
      );
    } else {
      setSelectedCells([...selectedCells, cell]);
    }
  };

  const toggleAgent = (agent) => {
    selectedAgents.includes(agent)
      ? setSelectedAgents(selectedAgents.filter((a) => a !== agent))
      : setSelectedAgents([...selectedAgents, agent]);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200 text-left">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black uppercase italic text-[#15803d]">
              Assignation Multiple
            </h2>
            <p className="text-[10px] font-bold text-slate-400">
              Dossier : {dossier.numero}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* ÉTAPE 1 : CHOIX DES CELLULES */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-500">
                1
              </div>
              Sélectionner les Cellules
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(structure).map((cell) => (
                <button
                  key={cell}
                  onClick={() => toggleCell(cell)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${
                    selectedCells.includes(cell)
                      ? "bg-emerald-50 border-[#15803d] text-[#15803d]"
                      : "bg-white border-slate-200 text-slate-400 hover:border-emerald-200"
                  }`}
                >
                  {cell}
                </button>
              ))}
            </div>
          </section>

          {/* ÉTAPE 2 : CHOIX DES AGENTS (Dynamique) */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-500">
                2
              </div>
              Assigner aux Agents
            </h4>
            {selectedCells.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableAgents.map((agent) => (
                  <div
                    key={agent}
                    onClick={() => toggleAgent(agent)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      selectedAgents.includes(agent)
                        ? "bg-white border-[#15803d] shadow-sm"
                        : "bg-slate-50 border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${selectedAgents.includes(agent) ? "bg-[#15803d] border-[#15803d]" : "bg-white border-slate-300"}`}
                    >
                      {selectedAgents.includes(agent) && (
                        <CheckCircle2 size={10} className="text-white" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-black ${selectedAgents.includes(agent) ? "text-slate-800" : "text-slate-400"}`}
                    >
                      {agent}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <p className="text-[10px] font-bold text-slate-400 italic">
                  {"Veuillez d'abord sélectionner une cellule..."}
                </p>
              </div>
            )}
          </section>

          {/* ÉTAPE 3 : DEADLINE */}
          <section className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] text-slate-500">
                3
              </div>
              Date d'échéance (Deadline)
            </h4>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="date"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-[#15803d]"
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-8 bg-slate-50 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 font-black text-[10px] uppercase text-slate-400"
          >
            Annuler
          </button>
          <button
            onClick={() =>
              onAssign(dossier.id, selectedCells, selectedAgents, deadline)
            }
            disabled={selectedAgents.length === 0 || !deadline}
            className="flex-[2] bg-[#15803d] text-white py-5 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-emerald-700 disabled:opacity-30 transition-all active:scale-95"
          >
            Valider l'assignation ({selectedAgents.length})
          </button>
        </div>
      </div>
    </div>
  );
}
