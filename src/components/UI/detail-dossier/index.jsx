"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { FolderCheck, FolderOpen, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { DATA_DOSSIERS as MOCK_DATA_DOSSIERS } from "./data/dossiers-data";
import StatusCard from "./StatusCard";
import InfoDossierCard from "./InfoDossierCard";
import ActivityTimeline from "./ActivityTimeline";
import NotesPanel from "./NotesPanel";
import DocumentViewer from "./DocumentViewer";
import DocumentList from "./DocumentList";
import { fetchAPI } from "@/app/_utils/fetchApi";
// ─────────────────────────────────────────────
// Composant principal : Gestionnaire de documents
// ─────────────────────────────────────────────

export default function DocumentManagerDetails() {
  const [DATA_DOSSIERS, setDATA_DOSSIERS] = useState(MOCK_DATA_DOSSIERS);
  const [selectedId, setSelectedId] = useState(() => {
    const keys = Object.keys(MOCK_DATA_DOSSIERS);
    return keys.length > 0 ? keys[0] : null;
  });
  const [activeDoc, setActiveDoc] = useState(null);
  const [note, setNote] = useState("");
  const [localNotes, setLocalNotes] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const fileInputRef = useRef(null);
  const dossier = selectedId && DATA_DOSSIERS[selectedId]
    ? DATA_DOSSIERS[selectedId]
    : null;

  // Synchronisation avec le paramètre d'URL ?open=<id>
  const searchParams = useSearchParams();
  useEffect(() => {
    const openId = searchParams.get("open");
    const id = searchParams.get("id_dossier");
    const fetchData = async () => {
      try {
        const responseDoc = await fetchAPI("get", `dossiers/${id}/documents/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        if (responseDoc && Array.isArray(responseDoc.documents)) {
          // Build a DATA_DOSSIERS-like object with one dossier for this id
          const newDossier = {
            [id]: {
              id,
              titre: `Dossier ${id}`,
              statut: "Actif",
              documents: responseDoc.documents.map((item) => ({
                id: item.id,
                name: item.fichier,
                size: item.size || "2.4 Mo",
                date: item.date || "20/01/2026",
                type: item.type || "PDF",
                url: item.fichier,
                content: item.content || "Contenu du rapport technique...",
              })),
            },
          };
          setDATA_DOSSIERS(newDossier);
          if (openId && newDossier[openId]) {
            setSelectedId(openId);
          } else {
            setSelectedId(id);
          }
        } else {
          // fallback to mock if API fails
          setDATA_DOSSIERS(MOCK_DATA_DOSSIERS);
        }
      } catch (e) {
        setDATA_DOSSIERS(MOCK_DATA_DOSSIERS);
      }
    };
    if (id) fetchData();
  }, [searchParams]);

  const id = searchParams.get("id_dossier");
  const handleAddNote = async() => {
    if (!note.trim()) return;
    const response= await fetchAPI("get", `dossiers/${id}`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });

    setLocalNotes((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || dossier.notes), note],
    }));
    setNote("");
  };

  const handleAddDocumentNote = async() => {
    if (documentFile) {
      try {
        const formData = new FormData();
        formData.append("fichier", documentFile);

        const response = await fetchAPI("post", `dossiers/${id}/add-document/`, {
          params: {},
          additionalHeaders: {},
          body: formData,
        });

        if (response?.status === 200 || response?.status === 201) {
          window.location.reload();
        } else {
          alert("Erreur lors de l'envoi du document.");
        }
      } catch (error) {
        alert("Erreur lors de l'envoi du document.");
        console.error(error);
      }
    }

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      const newDoc = {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " Ko",
        date: new Date().toLocaleDateString(),
        type: file.type.split("/")[1].toUpperCase(),
        mimeType: file.type,
        url: URL.createObjectURL(file),
        content: "Document importé avec succès.",
      };
      dossier.documents.push(newDoc);
      setIsUploading(false);
      setActiveDoc(newDoc);
setDocumentFile(file)
    }, 1500);
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    // Debug: inspect the session payload to know where the role comes from

    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", `dossiers/${id}`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        setData(responseDossiers);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [id]);

  const [dataRecent, setDataRecent] = useState([]);
  const [observtaions, setObservations] = useState([]);


  useEffect(() => {
    // Debug: inspect the session payload to know where the role comes from

    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI(
          "get",
          `dossiers/${id}/activite-recente/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const responseObserations = await fetchAPI(
          "get",
          `dossiers/${id}/observations/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        setDataRecent(responseDossiers);
        setObservations(responseObserations.data);

      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className=" mx-auto min-h-screen p-4 md:p-8 bg-sidebar/60 backdrop-blur-2xl rounded-lg text-slate-900">
      {/* Input File invisible */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key="detail"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* ── Barre de navigation ── */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-lg font-bold text-sidebar-foreground uppercase flex items-center gap-2">
              <FolderOpen />
              Details du dossier
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className={`className="w-max bg-sidebar text-sidebar-foreground px-6 py-3 rounded-lg font-medium text-[15px] uppercase flex items-center gap-3 shadow-xl hover:bg-secondary hover:text-white transition-all cursor-pointer
                  `}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-primary rounded-full animate-spin" />
                    Téléversement...
                  </>
                ) : (
                  <>
                    <Plus
                      size={18}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Nouveau document
                  </>
                )}
              </button>
              <button
                onClick={handleAddDocumentNote}
                disabled={isUploading}
                className={`className="w-max bg-primary text-white px-6 py-3 rounded-lg font-medium text-[15px] uppercase flex items-center gap-3 shadow-xl hover:bg-red-700 transition-all cursor-pointer
                  `}
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-primary rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <FolderCheck
                      size={18}
                      className="group-hover:rotate-90 transition-transform"
                    />
                    Finaliser
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Grille principale ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Colonne gauche */}
            <div className=" lg:col-span-8 space-y-6">
              <StatusCard dossier={data} />
              <InfoDossierCard data={data} />
              <DocumentViewer
                activeDoc={activeDoc}
                onClose={() => setActiveDoc(null)}
              />
            </div>

            {/* Colonne droite */}
            <div className="lg:col-span-4 space-y-6">
              <DocumentList
                documents={dossier.documents}
                activeDoc={activeDoc}
                onSelect={setActiveDoc}
              />
            </div>
            <div className="lg:col-span-12 grid grid-cols-2 gap-6">
              <ActivityTimeline historiquesData={dataRecent} />
              <NotesPanel
                data={observtaions}
                note={note}
                onNoteChange={setNote}
                onAddNote={handleAddNote}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
