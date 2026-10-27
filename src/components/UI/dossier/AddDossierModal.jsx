"use client";

import { useRef, useState } from "react";
import {
  HardDrive,
  FolderOpen,
  Plus,
  FileText,
  FolderPlus,
  ChevronDownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { fetchAPI } from "@/app/_utils/fetchApi";
export function AddDossierModal() {
  const [form, setForm] = useState({
    reference: "",
    objet: "",
    description: "",
    priorite: "",
    date_fin: "",
  });
  const [mainDoc, setMainDoc] = useState(null);
  const [annexes, setAnnexes] = useState([]);
  const mainInputRef = useRef(null);
  const annexInputRef = useRef(null);

  const handleSave = async () => {
    try {
      if (!form.reference || !form.objet || !form.priorite) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }
      const formData = new FormData();
      formData.append("reference", form.reference);
      formData.append("objet", form.objet);
      formData.append("niveau_priorite", form.priorite);
      formData.append("description", form.description);
      formData.append("date_fin", form.date_fin);
      if (mainDoc) formData.append("fichier", mainDoc);
      annexes.forEach((file, index) => {
        formData.append(`annexe[${index}]`, file);
      });
      const response = await fetchAPI("post", "/dossiers/", {
        params: {},
        additionalHeaders: {},
        body: formData,
      });
      if (response?.status === 201) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving dossier:", error);
    }
  };
  const [date, setDate] = useState();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-max bg-secondary text-white px-6 py-3 rounded-lg font-medium text-[15px] uppercase flex items-center gap-3 shadow-xl hover:bg-red-700 transition-all cursor-pointer">
          <Plus size={18} /> Nouveau Dossier
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-4xl  p-0 bg-sidebar overflow-hidden rounded-lg">
        {/* Barre Burundi */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#CE1126]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#00A651]" />
        </div>

        <div className="px-8">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase text-sidebar-foreground tracking-tight flex items-center gap-2">
              <FolderPlus size={28} className="text-secondary" />
              Création de Dossier
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations ci-dessous pour créer un nouveau
              dossier. Cliquez sur Enregistrer une fois terminé.
            </DialogDescription>
          </DialogHeader>

          {/* Fields */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-8 max-h-[60vh] w-full px-2  overflow-y-auto">
            {/* Section Gauche : Texte */}
            <div className="space-y-5">
              <div className="space-y-2">
                {/* Champ Date de fin supprimé, remplacé par le calendrier ci-dessous */}
                <Label
                  htmlFor="reference"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Référence du dossier
                </Label>
                <Input
                  id="reference"
                  type="text"
                  placeholder="Ex: 2025/001"
                  className="w-full rounded-lg text-sm font-medium outline-none  transition-all h-12"
                  onChange={(e) =>
                    setForm({ ...form, reference: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="objet"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Objet du dossier
                </Label>
                <Input
                  id="objet"
                  type="text"
                  placeholder="Ex: Audit financier ODECA"
                  className="w-full rounded-lg text-sm font-medium outline-none  transition-all h-12"
                  onChange={(e) => setForm({ ...form, objet: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="priorite"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Priorité du dossier
                </Label>
                <select
                  id="priorite"
                  className="w-full rounded-lg text-sm font-medium outline-none transition-all h-12"
                  value={form.priorite}
                  onChange={(e) =>
                    setForm({ ...form, priorite: e.target.value })
                  }
                >
                  <option value="">Sélectionner</option>
                  <option value="CONFIDENTIEL">Confidentiele</option>
                  <option value="URGENTE">Urgente</option>
                  <option value="NORMALE">Normale</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Détails du dossier..."
                  className="w-full p-4 rounded-lg text-base font-medium h-28 outline-none  resize-none"
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              {/* 
              <div className="space-y-2">
                <Label
                  htmlFor="observation"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Observations
                </Label>
                <Textarea
                  id="observation"
                  placeholder="Notes ou remarques particulières..."
                  className="w-full p-4  rounded-lg text-sm font-medium h-24 outline-none  resize-none text-slate-500"
                  onChange={(e) =>
                    setForm({ ...form, observation: e.target.value })
                  }
                />
              </div>
             
              </div> */}
              <div className="space-y-2">
                <Label
                  htmlFor="observation"
                  className="text-base font-medium text-background-foreground ml-1"
                >
                  Date limite
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!date}
                      className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal rounded-lg bg-secondary/10"
                    >
                      {date ? (
                        format(date, "PPP", { locale: fr })
                      ) : (
                        <span>Ajouter une date</span>
                      )}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 " align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selected) => {
                        setDate(selected);
                        if (selected) {
                          const formatted = format(selected, "yyyy-MM-dd");
                          setForm((prev) => ({ ...prev, date_fin: formatted }));
                        }
                      }}
                      defaultMonth={date}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Section Droite : Fichiers */}
            <div className="space-y-6">
              {/* Document Principal */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-background-foreground ml-1">
                  Document Principal
                </Label>
                <div
                  onClick={() => mainInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setMainDoc(e.dataTransfer.files[0]);
                  }}
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:border-primary
                    bg-background`}
                >
                  <Input
                    type="file"
                    ref={mainInputRef}
                    className="hidden"
                    onChange={(e) => setMainDoc(e.target.files[0])}
                  />
                  <FolderOpen
                    size={24}
                    className={mainDoc ? "text-[#15803d]" : "text-slate-300"}
                  />
                  <p className="text-sm font-medium text-center leading-tight">
                    {mainDoc
                      ? mainDoc.name
                      : "Glisser ou cliquer pour le fichier maître"}
                  </p>
                </div>
              </div>

              {/* Annexes */}
              <div className="space-y-2">
                <Label className="text-base font-medium text-background-foreground ml-1">
                  Annexes /Notes
                </Label>
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
                  className="border-2 border-dashed  rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-background hover:border-primary transition-all"
                >
                  <Input
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
                  <FileText size={24} className="text-slate-300" />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Glisser ou cliquer ici
                    </p>
                    {annexes.length > 0 && (
                      <p className="text-sm text-[#15803d] font-bold mt-1">
                        {annexes.length} fichiers ajoutés
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="my-8">
            <DialogClose>
              <Button variant="outline" className="cursor-pointer rounded-lg">
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={handleSave}
              className="bg-[#15803d] cursor-pointer rounded-lg text-white hover:bg-emerald-700 shadow-xl shadow-emerald-200 active:scale-95 transition-all"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
