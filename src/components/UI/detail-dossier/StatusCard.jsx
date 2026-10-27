import { FileText } from "lucide-react";

/**
 * StatusCard — Carte d'en-tête affichant le titre et l'identifiant du dossier.
 * @param {{ dossier: { id: string, titre: string } }} props
 */
export default function StatusCard({ dossier }) {
  return (
    <div className="bg-linear-to-bl from-secondary/40 via-primary/90 to-primary/90 text-white p-8 rounded-lg s/hadow-xl shado/w-slate-900/20 relative overflow-hidden group w-full">
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
        <FileText size={80} />
      </div>
      <p className="text-sm font-bold uppercase text-primary-foreground/80 mb-2">
        Objet du dossier
      </p>
      <h2 className="text-2xl text-primary-foreground font-black uppercase mb-4 line-clamp-1">
        {dossier?.objet}
      </h2>
      <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary/80 animate-pulse" />
        <span className="text-sm uppercase tracking-wider">
          Ref: {dossier?.reference}
        </span>
      </div>
    </div>
  );
}
