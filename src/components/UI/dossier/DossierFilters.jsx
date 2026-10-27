"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  Calendar as CalendarIcon,
  RotateCcw,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AGENTS = [
  "Jean NKURUNZIZA",
  "Florence KWIZERA",
  "Emmanuel NIYONGABO",
  "Alice BUZINGO",
];

export function DossierFilters({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.search !== "" ||
    filters.cellule !== "Toutes" ||
    filters.priorite !== "Tous" ||
    (filters.agent !== "" && filters.agent !== "all_agents") ||
    filters.dateAjout !== "" ||
    filters.dateFin !== "";

  const clearFilters = () => {
    setFilters({
      search: "",
      cellule: "Toutes",
      priorite: "Tous",
      agent: "",
      dateAjout: "",
      dateFin: "",
    });
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-x-2 p-2 hover:bg-slate-50 rounded-lg transition-colors group cursor-pointer"
        >
          <div className="flex items-center text-lg font-semibold text-sidebar-foreground/80">
            <SlidersHorizontal size={18} className="mr-2 text-emerald-600" />
            Filtrage
          </div>
          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            } group-hover:text-emerald-600`}
          />
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 text-xs font-medium"
          >
            <RotateCcw size={14} className="mr-1.5" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[800px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full h-10 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all placeholder:text-slate-400"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>

          {/* Cellule */}
          <Select
            value={filters.cellule}
            onValueChange={(val) => setFilters({ ...filters, cellule: val })}
          >
            <SelectTrigger className="h-10 bg-slate-50 border-slate-100 rounded-lg text-sm font-medium text-slate-600">
              <SelectValue placeholder="Toutes les Cellules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Toutes">Toutes les Cellules</SelectItem>
              <SelectItem value="Cellule PESSE">Cellule PESSE</SelectItem>
              <SelectItem value="Cellule SEAG">Cellule SEAG</SelectItem>
              <SelectItem value="Cellule FESPP">Cellule FESPP</SelectItem>
            </SelectContent>
          </Select>

          {/* Priorité */}
          <Select
            value={filters.priorite}
            onValueChange={(val) => setFilters({ ...filters, priorite: val })}
          >
            <SelectTrigger className="h-10 bg-slate-50 border-slate-100 rounded-lg text-sm font-medium text-slate-600">
              <SelectValue placeholder="Toutes Priorités" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tous">Toutes Priorités</SelectItem>
              <SelectItem value="Urgent">Urgent uniquement</SelectItem>
            </SelectContent>
          </Select>

          {/* Agent */}
          <Select
            value={filters.agent || "all_agents"}
            onValueChange={(val) =>
              setFilters({ ...filters, agent: val === "all_agents" ? "" : val })
            }
          >
            <SelectTrigger className="h-10 bg-slate-50 border-slate-100 rounded-lg text-sm font-medium text-slate-600">
              <SelectValue placeholder="Tous les Agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_agents">Tous les Agents</SelectItem>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date d'ajout */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 px-1">
              Date d'ajout
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-10 justify-start text-left font-medium text-sm bg-slate-50 border-slate-100 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors",
                    !filters.dateAjout && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                  {filters.dateAjout ? (
                    format(new Date(filters.dateAjout), "PPP")
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateAjout ? new Date(filters.dateAjout) : undefined
                  }
                  onSelect={(date) =>
                    setFilters({
                      ...filters,
                      dateAjout: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date de fin */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-400 px-1">
              Date de fin
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full h-10 justify-start text-left font-medium text-sm bg-slate-50 border-slate-100 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors",
                    !filters.dateFin && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-emerald-600" />
                  {filters.dateFin ? (
                    format(new Date(filters.dateFin), "PPP")
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filters.dateFin ? new Date(filters.dateFin) : undefined
                  }
                  onSelect={(date) =>
                    setFilters({
                      ...filters,
                      dateFin: date ? format(date, "yyyy-MM-dd") : "",
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
