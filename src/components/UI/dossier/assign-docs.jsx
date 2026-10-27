"use client";

import { useRef, useState, useEffect } from "react";
import {
  FolderPlus,
  X,
  ChevronLeft,
  ChevronRight,
  Archive,
  UserPlus,
  UserCheck,
  GitPullRequestArrow,
  BetweenHorizontalEnd,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/app/_utils/fetchApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const AGENTS = [
  "Jean NKURUNZIZA",
  "Florence KWIZERA",
  "Emmanuel NIYONGABO",
  "Alice BUZINGO",
];

const CELLULES = [
  "Cellule PESSE",
  "Cellule SEAG",
  "Cellule FESPP",
  "Cellule SEAG",
  "Cellule FESPP",
  "Cellule SEAG",
  "Cellule FESPP",
];

export function AssignModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [cellules, setCellules] = useState([]);
  const [agents, setAgents] = useState([]);
  const handleClose = () => {
    setStep(1);
    setSelectedCellule(null);
    setOpen(false);
  };

  const handleAgentSelect = (agent) => {
    handleClose();
    toast.promise(
      new Promise((resolve) =>
        setTimeout(() => resolve({ agent, cellule: selectedCellule }), 2000),
      ),
      {
        loading: "Assignation en cours...",
        success: (data) => `Dossier assigné à ${data.agent} (${data.cellule})`,
        error: "Erreur lors de l'assignation",
        position: "top-center",
      },
    );
  };

  useEffect(() => {
    const fetchCellules = async () => {
      try {
        const responseCellules = await fetchAPI("get", "Cellule/", {
          params: { limit: 10, offset: 0 },
          additionalHeaders: {},
          body: {},
        });
        const CELLULES = responseCellules?.results?.map((item) => ({
          id: item?.id,
          cellule_code: item?.code_cellule,
          cellule_name: item?.nom_cellule,
        }));
        setCellules(CELLULES);
        console.log(CELLULES);
        // setTotalCount(responseCellules?.count || 0);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchCellules();
  }, []);
  const handleCelluleSelect = async (cellule) => {
    setSelectedCellule(cellule);
    setStep(2);
    try {
      const responseUsers = await fetchAPI("get", "utilisateurs/", {
        params: { limit: 10, offset: 0 },
        additionalHeaders: {},
        body: { bureau_cellule: cellule },
      });
      const AGENTS = responseUsers?.results?.map((item) => ({
        id: item?.id,
        agent_name: item?.nom_utilisateur,
        agent_email: item?.email,
      }));
      setAgents(AGENTS);
      console.log(AGENTS);
      // setTotalCount(responseUsers?.count || 0);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className=" text-sidebar-foreground flex items-center gap-2 transition-all cursor-pointer">
          <GitPullRequestArrow />
          Assigner
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl p-0 bg-sidebar rounded-2xl shadow-2xl overflow-hidden">
        {/* Barre Burundi */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#00A651]" />
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase text-sidebar-foreground tracking-tight flex items-center gap-2">
              <GitPullRequestArrow size={28} className="text-secondary" />
              Assignation de dossier
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour assigner un dossier.
              Cliquez sur Enregistrer une fois terminé.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-start my-4 border-l-4 border-secondary pl-4">
            <p className="text-sm text-sidebar-foreground/80 font-medium flex items-center gap-2">
              Objet :
              <span className="text-sidebar-foreground  text-lg font-bold uppercase line-clamp-1"></span>
            </p>
            <p className="text-sm text-sidebar-foreground/80 font-medium">
              Dossier :{" "}
              <span className="text-secondary font-bold">#REF853/2026</span>
            </p>
          </div>

          {/* Barre de progression */}
          <div className="flex gap-2 mb-8">
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-background"}`}
            />
            <div
              className={`h-1 flex-1 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-background"}`}
            />
          </div>

          {/* Étape 1 : Cellule */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-1">
              <label className="text-xs text-sidebar-foreground/80 uppercase ml-1">
                Étape 1 : Choisir la cellule destinataire
              </label>
              <div className="relative ">
                <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 text-primary " />
                <Input
                  placeholder="Rechercher..."
                  // value={table.getColumn("cultivator")?.getFilterValue() ?? ""}
                  // onChange={(event) =>
                  //   table
                  //     .getColumn("cultivator")
                  //     ?.setFilterValue(event.target.value)
                  // }
                  className="pl-10 flex-1  w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
                {cellules.map((cellule, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedCellule(cellule?.cellule_code);
                      setStep(2);
                    }}
                    className="group bg-background/20 w-full flex items-center justify-between p-5 rounded-xl border border-background hover:border-primary hover:bg-primary/10 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-background/80 shadow-sm rounded-lg group-hover:scale-110 transition-transform">
                        <BetweenHorizontalEnd
                          className="text-primary"
                          size={20}
                        />
                      </div>
                      <span className="font-bold text-sidebar-foreground">
                        {cellule?.cellule_name}
                      </span>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-sidebar-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2 : Agent */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  size="icon"
                  className="p-1  rounded-md text-slate-400"
                >
                  <ChevronLeft size={20} />
                </Button>
                <label className="text-xs text-sidebar-foreground/80 uppercase ml-1">
                  Étape 2 : Sélectionner l'agent dans{" "}
                  <span className="text-secondary font-bold text-sm">
                    {" "}
                    {selectedCellule}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                {AGENTS.map((agent) => (
                  <button
                    key={agent}
                    onClick={() => handleAgentSelect(agent)}
                    className="group flex flex-col items-center justify-center p-6 rounded-xl border border-background hover:border-primary hover:bg-primary/10 transition-all gap-3 text-center"
                  >
                    <div className="w-12 h-12 bg-background/60 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <UserCheck
                        className="text-slate-400 group-hover:text-primary"
                        size={24}
                      />
                    </div>
                    <span className="font-bold text-sidebar-foreground">
                      {agent}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
        </div>

        <DialogFooter className="px-8 pb-4">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer rounded-lg">
              Annuler
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
