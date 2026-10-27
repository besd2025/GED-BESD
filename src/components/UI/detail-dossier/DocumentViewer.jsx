"use client";
import { useEffect, useState } from "react";
import {
  Eye,
  ExternalLink,
  X,
  Monitor,
  Save,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";

/**
 * Détecte le type de document à partir du nom de fichier ou du type MIME.
 */
function getDocType(doc) {
  if (!doc) return null;
  const name = (doc.name || "").toLowerCase();
  if (name.endsWith(".pdf") || doc.type === "PDF") return "pdf";
  if (
    name.endsWith(".docx") ||
    name.endsWith(".doc") ||
    doc.type === "DOCX" ||
    doc.type === "DOC"
  )
    return "docx";
  if (
    name.endsWith(".xlsx") ||
    name.endsWith(".xls") ||
    doc.type === "XLSX" ||
    doc.type === "XLS"
  )
    return "xlsx";
  return "other";
}

/** Rendu PDF — utilise l'iframe natif du navigateur */
function PdfViewer({ url }) {
  return (
    <iframe
      src={url}
      className="w-full border-none"
      style={{ minHeight: "520px", height: "100%" }}
      title="Aperçu PDF"
    />
  );
}

/** Rendu DOCX — convertit via mammoth.js en HTML */
function DocxViewer({ url }) {
  const [html, setHtml] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setHtml(null);

    (async () => {
      try {
        const mammoth = (await import("mammoth")).default;
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        if (!cancelled) setHtml(result.value);
      } catch (e) {
        if (!cancelled) setError("Impossible de lire ce fichier DOCX.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) return <LoadingState label="Conversion DOCX en cours..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div
      className="p-8 prose prose-sm max-w-none overflow-auto bg-white text-slate-800"
      style={{ minHeight: "520px" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Rendu XLSX — parse via xlsx et affiche un tableau HTML */
function XlsxViewer({ url }) {
  const [tableHtml, setTableHtml] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [workbook, setWorkbook] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const XLSX = await import("xlsx");
        const res = await fetch(url);
        const arrayBuffer = await res.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        if (!cancelled) {
          setWorkbook(wb);
          setSheetNames(wb.SheetNames);
          const ws = wb.Sheets[wb.SheetNames[0]];
          setTableHtml(XLSX.utils.sheet_to_html(ws));
        }
      } catch (e) {
        if (!cancelled) setError("Impossible de lire ce fichier Excel.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const switchSheet = async (idx) => {
    if (!workbook) return;
    const XLSX = await import("xlsx");
    const ws = workbook.Sheets[workbook.SheetNames[idx]];
    setActiveSheet(idx);
    setTableHtml(XLSX.utils.sheet_to_html(ws));
  };

  if (loading) return <LoadingState label="Lecture du fichier Excel..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="flex flex-col" style={{ minHeight: "520px" }}>
      {/* Onglets des feuilles */}
      {sheetNames.length > 1 && (
        <div className="flex gap-1 border-b px-4 pt-2 bg-slate-50">
          {sheetNames.map((name, i) => (
            <button
              key={name}
              onClick={() => switchSheet(i)}
              className={`px-3 py-1 text-xs font-medium rounded-t-md border-b-2 transition-colors ${
                i === activeSheet
                  ? "border-primary text-primary bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      {/* Tableau */}
      <div
        className="overflow-auto flex-1 p-4 bg-white text-xs text-slate-700 [&_table]:border-collapse [&_td]:border [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-slate-200 [&_th]:px-2 [&_th]:py-1 [&_th]:bg-slate-100 [&_th]:font-semibold"
        dangerouslySetInnerHTML={{ __html: tableHtml }}
      />
    </div>
  );
}

function LoadingState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-xs font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-red-400">
      <AlertTriangle size={32} />
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
}

/**
 * DocumentViewer — Visualiseur multi-format (PDF, DOCX, XLSX).
 * @param {{ activeDoc: object|null, onClose: () => void }} props
 */
export default function DocumentViewer({ activeDoc, onClose }) {
  const docType = getDocType(activeDoc);
  const isBlob = activeDoc?.url?.startsWith("blob:");

  const renderContent = () => {
    if (!activeDoc) return null;

    // Fichiers locaux (blob URL)
    if (isBlob) {
      if (docType === "pdf") return <PdfViewer url={activeDoc.url} />;
      if (docType === "docx") return <DocxViewer url={activeDoc.url} />;
      if (docType === "xlsx") return <XlsxViewer url={activeDoc.url} />;
    }

    // Fichiers distants → Google Docs Viewer
    return (
      <iframe
        key={activeDoc.id}
        src={`https://docs.google.com/viewer?url=${encodeURIComponent(activeDoc.url)}&embedded=true`}
        className="w-full border-none"
        style={{ minHeight: "520px" }}
        title="Viewer"
      />
    );
  };

  return (
    <div className="rounded-lg relative overflow-y-auto shadow-sm h-[550px] max-h-screen flex flex-col">
      {/* Barre de titre */}
      <div className="bg-primary/30 sticky z-10 top-0 backdrop-blur-sm p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <FileText
            className={
              activeDoc
                ? "text-secondary animate-pulse"
                : "text-sidebar-foreground/70"
            }
          />
          <span className="text-sm font-semibold uppercase text-sidebar-foreground">
            {activeDoc
              ? `Visualisation : ${activeDoc.name}`
              : "Aperçu du document"}
          </span>
        </div>
        {activeDoc && (
          <div className="flex items-center gap-2">
            <a
              href={activeDoc.url}
              download={activeDoc.name}
              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors"
              title="Télécharger"
            >
              <Save size={14} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Zone d'affichage */}
      <div className="flex-1 flex flex-col bg-slate-50/30 relative">
        {activeDoc ? (
          renderContent()
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center group">
              <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform duration-500">
                <FileText
                  size={40}
                  className="text-slate-200 group-hover:text-primary transition-colors"
                />
              </div>
              <p className="text-slate-400 text-sm font-medium uppercase  mt-6">
                Sélectionnez un fichier pour l&apos;examiner
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pied de page */}
      {activeDoc && (
        <div className="p-3 bg-white border-t border-slate-100 flex justify-center gap-8">
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            <Monitor size={12} />
            {isBlob ? "Rendu Local" : "Rendu Cloud"}
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
            <Save size={12} /> Lecture Seule
          </div>
        </div>
      )}
    </div>
  );
}
