import { Paperclip, FileCode, Download } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_IMAGE_URL || "";

/**
 * DocumentList — Grille de sélection des documents rattachés à un dossier.
 * @param {{ documents: object[], activeDoc: object|null, onSelect: (doc: object) => void }} props
 */
export default function DocumentList({ documents, activeDoc, onSelect }) {
  return (
    <div className="bg-sidebar p-4 rounded-lg  shadow-sm">
      <h3 className="text-base font-medium  text-sidebar-foreground/80 mb-6 flex items-center gap-2">
        <Paperclip size={16} className="text-primary" /> Documents rattachés
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`flex items-center justify-between p-4 rounded-2xl  transition-all cursor-pointer ${
              activeDoc?.id === doc.id
                ? "bg-emerald-50 border-primary/50 ring-1 ring-primary/50"
                : "bg-background hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  activeDoc?.id === doc.id
                    ? "bg-white text-emerald-600"
                    : "bg-white text-slate-400"
                }`}
              >
                <FileCode size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground/80 uppercase mb-1">
                  {doc.name}
                </p>
                <p className="text-xs font-medium text-sidebar-foreground/60 uppercase">
                  {doc.size} • {doc.date}
                </p>
              </div>
            </div>
            <a
              href={doc.url?.startsWith("http") ? doc.url : `${BACKEND_URL}${doc.url}`}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={e => e.stopPropagation()}
            >
              <Download
                size={24}
                className="text-sidebar-foreground/50 hover:text-primary"
                title="Télécharger ou afficher le document"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
