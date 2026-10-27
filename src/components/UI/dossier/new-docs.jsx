"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Clock,
  Calendar,
  Folder,
  MoreHorizontal,
  SquareArrowOutUpRight,
  SquarePen,
  FolderPlus,
  GitPullRequestArrow,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { fetchAPI } from "@/app/_utils/fetchApi";
import { UserContext } from "@/src/components/UI/context/User_Context";
import PaginationContent from "@/components/ui/pagination-content";
import { DossierFilters } from "./DossierFilters";

export default function NewDocs() {
  // Fonction pour confirmer la réception d'un dossier
  const handleReceptionConfirm = async (dossierId) => {
    try {
      // Appel API pour confirmer la réception côté serveur (adapter l'endpoint si besoin)
      const response = await fetchAPI("PATCH", `/dossiers/${dossierId}/`, {
        body: { nouveau: false },
        additionalHeaders: {},
        params: {},
      });
      if (response?.status == 200 || response?.status == 201) {
        // window.location.reload()
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation de réception:", error);
    }
  };

  const [receptionStatus, setReceptionStatus] = useState({});

  const [dossiers, setDossiers] = useState([]);
  const { session } = useContext(UserContext);

  const [filters, setFilters] = useState({
    search: "",
    cellule: "Toutes",
    priorite: "Tous",
    agent: "",
    dateAjout: "",
    dateFin: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const pointer = (currentPage - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", "dossiers/", {
          params: {
            limit,
            offset: pointer,
            nouveau: true,
            cellule: filters.cellule !== "Toutes" ? filters.cellule : undefined,
            date_creation: filters.dateAjout || undefined,
            date_fin: filters.dateFin || undefined,
            search: filters.search || undefined,
          },
          additionalHeaders: {},
          body: {},
        });
        console.log(responseDossiers);
        const formattedData = responseDossiers?.results?.map((item) => ({
          id: item?.id,
          numero: item?.reference,
          objet: item?.objet,
          description: item?.description,
          statut: item?.status?.status,
          priorite: item?.niveau_priorite,
          assigne:
            item?.utilisateur == "Non assigné"
              ? "NON ASSIGNÉ"
              : item?.utilisateur,
          fonction: "",
          cellule: item?.utilisateur == "Non assigné" ? "-" : item?.cellule,
          deadline: item?.date_fin,
          dateAjout: item?.date_creation,
        }));
        setDossiers(formattedData);
        setTotalCount(responseDossiers?.count || 0);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [session, currentPage, limit, filters]);

  return (
    <TooltipProvider>
      <div className="bg-sidebar rounded-lg border border-background shadow-sm overflow-hidden mt-4">
        {/* En-tête avec titre agrandi mais sobre */}
        <div className="p-6 border-b border-background bg-sidebar">
          <div className="flex items-center gap-3">
            <FolderPlus size={22} className="text-primary" />
            <h3 className="text-lg font-semibold text-background-foreground opacity-70">
              Nouveau dossiers
            </h3>
          </div>
        </div>

        <div className="p-4 border-b border-background">
          <DossierFilters
            filters={filters}
            setFilters={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="">
                <TableHead className="px-8 py-3 text-xs font-medium uppercase ">
                  Dossiers/objet
                </TableHead>
                <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                  {"Date d'ajout"}
                </TableHead>
                <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                  Date de fin
                </TableHead>
                <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider text-center">
                  Réception
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.map((d) => (
                <TableRow key={d.id} className="group transition-colors">
                  {/* COLONNE DOSSIERS */}
                  <TableCell className="px-8 py-4 transition-colors group">
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-sidebar-foreground group-hover:text-primary transition-colors">
                        {(d.objet || d.titre)?.toString().substring(0, 15)}
                      </span>
                      <span className="text-[13px] text-secondary font-normal line-clamp-1">
                        {d.numero || d.id}
                      </span>
                    </div>
                  </TableCell>
                  {/* COLONNE DATE D'AJOUT */}
                  <TableCell className="px-8 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-secondary" />
                      {d.dateAjout
                        ? new Date(d.dateAjout)?.toLocaleDateString("fr-FR")
                        : ""}
                    </div>
                    <span className="ml-5 text-xs opacity-70">
                      {" "}
                      {d.dateAjout
                        ? new Date(d.dateAjout)?.toLocaleTimeString("fr-FR")
                        : ""}
                    </span>
                  </TableCell>
                  {/* COLONNE DATE DE FIN */}
                  <TableCell className="px-8 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-secondary" />
                      {d.deadline || "10/01/2026"}
                    </div>
                  </TableCell>

                  {/* COLONNE RÉCEPTION */}
                  <TableCell className="px-8 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {receptionStatus[d.id] === "confirmed" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                          <CheckCircle size={15} />
                          Confirmé
                        </span>
                      ) : receptionStatus[d.id] === "rejected" ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                          <XCircle size={15} />
                          Rejeté
                        </span>
                      ) : (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer rounded-full size-9 p-2 text-xs border-primary text-primary hover:bg-primary/20 hover:text-primary gap-1"
                                onClick={() => handleReceptionConfirm(d.id)}
                              >
                                <CheckCircle size={13} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Confirmer la réception {d.id}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="cursor-pointer rounded-full size-9 p-2 text-xs border-secondary/40 text-secondary bg-secondary/10 hover:bg-secondary/20 hover:text-secondary gap-1"
                                onClick={() =>
                                  setReceptionStatus((prev) => ({
                                    ...prev,
                                    [d.id]: "rejeté",
                                  }))
                                }
                              >
                                <XCircle size={13} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rejeter la réception</p>
                            </TooltipContent>
                          </Tooltip>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-4 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 p-0" variant="ghost">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="py-1">
                            Actions
                          </DropdownMenuLabel>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <SquareArrowOutUpRight />
                            Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <PaginationContent
          datapaginationlimit={(l) => setLimit(l)}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pointer={pointer}
          totalCount={totalCount}
          onLimitChange={(l) => {
            setLimit(l);
            setCurrentPage(1);
          }}
        />
      </div>
    </TooltipProvider>
  );
}
