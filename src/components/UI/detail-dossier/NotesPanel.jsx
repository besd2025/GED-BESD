import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageSquare, Send, User } from "lucide-react";

/**
 * NotesPanel — Panneau d'annotations permettant de consulter et d'ajouter des notes.
 * @param {{ notes: string[], note: string, onNoteChange: (val: string) => void, onAddNote: () => void }} props
 */
export default function NotesPanel({ data, note, onNoteChange, onAddNote }) {
  const notes =  data?.map((item)=>(
  

    {
      user: item?.user_full_name,
      status: item?.role_name,
      date: item?.date_action,
      note: item?.observation,
    }
  )) 

  return (
    <div className="bg-primary/40 p-4 rounded-lg shadow-sm h-max">
      <h3 className="text-sm font-medium  text-sidebar-foreground/80 mb-4 flex items-center gap-2">
        <MessageSquare size={20} /> Observations
      </h3>
      <div className="max-h-[300px] overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
        {notes.map((n, i) => (
          <div
            key={i}
            className="bg-sidebar/90 p-2 rounded-xl text-[10px] text-emerald-900 font-medium w-max"
          >
            <Badge className="bg-emerald-600/80 text-white text-xs -mb-2">
              {n.status}
            </Badge>
            <p className="bg-background rounded-lg p-1 w-max text-xs font-medium text-sidebar-foreground/60 flex items-center gap-2">
              <span className="text-xs font-medium text-sidebar-foreground flex items-center gap-2">
                <User
                  size={24}
                  className="border border-secondary p-1 rounded-full"
                />
                {n.user}
              </span>
              <span className="text-xs font-medium text-sidebar-foreground/60 flex items-center gap-2">
                {n.date}
              </span>
            </p>
            <p className="relative text-sm font-medium text-sidebar-foreground/90 mt-2 p-2 flex items-center gap-2 border-l-2 border-sidebar-foreground/60">
              {n.note}
            </p>
          </div>
        ))}
      </div>
      <div className="relative">
        <Textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Observation..."
          className="w-full bg-sidebar border-0 rounded-xl  text-xs  min-h-[70px] outline-none  transition-all"
        />
        <button
          onClick={onAddNote}
          className="absolute bottom-3 right-3 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
