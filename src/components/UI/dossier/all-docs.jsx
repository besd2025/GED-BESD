"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  Clock,
  Calendar,
  Folder,
  MoreHorizontal,
  SquareArrowOutUpRight,
  SquarePen,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import Link from "next/link";
import { fetchAPI } from "@/app/_utils/fetchApi";
import { UserContext } from "@/src/components/UI/context/User_Context";
import PaginationContent from "@/components/ui/pagination-content";
import { DossierFilters } from "./DossierFilters";

export default function AllDocs() {
  const [is_validate, setValidate] = useState("false");
  const [dossiers, setDossiers] = useState([]);
  const { session } = useContext(UserContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    cellule: "Toutes",
    priorite: "Tous",
    agent: "",
    dateAjout: "",
    dateFin: "",
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const pointer = (currentPage - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", "dossiers/", {
          params: {
            limit,
            offset: pointer,
            cellule: filters.cellule !== "Toutes" ? filters.cellule : undefined,
            date_creation: filters.dateAjout || undefined,
            date_fin: filters.dateFin || undefined,
            search: filters.search || undefined,
          },
          additionalHeaders: {},
          body: {},
        });
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
    <div className="bg-sidebar rounded-lg border border-background shadow-sm overflow-hidden mt-4">
      {/* En-tête avec titre agrandi mais sobre */}
      <div className="p-6 border-b border-background bg-sidebar">
        <div className="flex items-center gap-3">
          <Folder size={22} className="text-primary" />
          <h3 className="text-lg font-semibold text-background-foreground opacity-70">
            Tous les dossiers
          </h3>
        </div>
      </div>

      <div className="p-4 border-b border-background">
        <DossierFilters
          filters={filters}
          setFilters={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1); // Reset to first page on filter change
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
              {session && session?.type_service == "Secretariat" ? null : (
                <>
                  <TableHead className="px-8 py-3 text-xs font-medium uppercase ">
                    Cellule
                  </TableHead>

                  <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                    Assignation
                  </TableHead>
                </>
              )}
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                {"Date d'ajout"}
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                Date de fin
              </TableHead>

              {session && session?.type_service == "Secretariat" ? null : (
                <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                  Status
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dossiers.map((d, index) => (
              <TableRow key={index} className="group transition-colors">
                {/* COLONNE DOSSIERS */}
                <TableCell className="px-8 py-4 transition-colors group">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-sidebar-foreground group-hover:text-primary transition-colors">
                      {(d.objet || d.titre)?.toString().substring(0, 15)}
                    </span>
                    <span className="text-[13px] text-secondary font-normal line-clamp-1"></span>
                    <span className="text-[13px] text-secondary font-normal line-clamp-1">
                      {d.numero || d.id}
                    </span>
                  </div>
                </TableCell>
                {session && session?.type_service == "Secretariat" ? null : (
                  <>
                    <TableCell className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium uppercase">
                          {Array.isArray(d.cellules)
                            ? d.cellules[0]
                            : d.cellule}
                        </span>
                      </div>
                    </TableCell>
                    {/* COLONNE ASSIGNATION */}
                    <TableCell className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium uppercase">
                          {Array.isArray(d.agents)
                            ? d.agents[0]
                            : typeof d.assigne === "object" &&
                                d.assigne !== null
                              ? `${d.assigne.nom} ${d.assigne.prenom}`
                              : d.assigne || "Non assigné"}
                        </span>
                        <span className="text-xs font-medium text-primary uppercase">
                          {Array.isArray(d.fonction)
                            ? d.fonction[0]
                            : d.fonction}
                        </span>
                      </div>
                    </TableCell>
                  </>
                )}
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
                    {d.deadline}
                  </div>
                </TableCell>
                {session && session?.type_service == "Secretariat" ? null : (
                  <>
                    <TableCell className="px-8 py-4 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Badge variant={is_validate ? "default" : "outline"}>

                          {d.statut == "IN_PROCESSING"
                            ? "En cours"
                            : d.statut == "PROCESSED"
                              ? "Terminé"
                              : d.statut == "ARCHIVED"
                                ? "Archivé"
                                : "Assigné"}
                        </Badge>
                      </div>
                    </TableCell>
                  </>
                )}
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
                        <Link
                          href={`/dashboard/dossier/details-dossier/?id_dossier=${d.id}`}
                        >
                          <DropdownMenuItem>
                            <SquareArrowOutUpRight />
                            Details
                          </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem>
                          <SquarePen />
                          Modifier
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
  );
}
