"use client";
import React, { useState, useContext } from "react";
import { Clock, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserContext } from "@/src/components/UI/context/User_Context";
import PaginationContent from "@/components/ui/pagination-content";

export default function RecentDocx({ dossiers }) {
  const { session } = useContext(UserContext);

  // Pagination locale (découpage du tableau reçu en prop)
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const totalCount = dossiers?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const pointer = (currentPage - 1) * limit;

  const paginatedDossiers = (dossiers || []).slice(pointer, pointer + limit);

  return (
    <div className="bg-sidebar rounded-lg border border-background shadow-sm overflow-hidden">
      {/* En-tête avec titre agrandi mais sobre */}
      <div className="p-6 border-b border-background bg-sidebar">
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-primary" />
          <h3 className="text-lg font-medium text-background-foreground">
            Dossiers récemment ajoutés
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="px-8 py-3 text-xs font-medium uppercase ">
                Dossiers/objet
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                Date d'ajout
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                Date de fin
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDossiers.map((d, index) => (
              <TableRow key={index} className="group transition-colors">
                {/* COLONNE DOSSIERS */}
                <TableCell className="px-8 py-4 transition-colors group">
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-sidebar-foreground group-hover:text-primary transition-colors">
                      {(d.objet || d.titre)?.substring(0, 15)}
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
                      ? new Date(d.dateAjout).toLocaleDateString("fr-FR")
                      : ""}
                  </div>
                  <span className="ml-6 text-xs opacity-70">
                    {d.dateAjout
                      ? new Date(d.dateAjout).toLocaleTimeString("fr-FR")
                      : ""}
                  </span>
                </TableCell>
                {/* COLONNE DATE DE FIN */}
                <TableCell className="px-8 py-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-secondary" />
                    {d.deadline || ""}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* <PaginationContent
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
      /> */}
    </div>
  );
}
