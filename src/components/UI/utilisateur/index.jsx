"use client";
import React, { useEffect, useState, useContext } from "react";
import {
  MoreHorizontal,
  SquarePen,
  UserX,
  UserCheck,
  User,
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
import { fetchAPI } from "@/app/_utils/fetchApi";
import { UserContext } from "@/src/components/UI/context/User_Context";
import PaginationContent from "@/components/ui/pagination-content";

export default function Users() {
  const [data, setData] = useState([]);
  const { session } = useContext(UserContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  const pointer = (currentPage - 1) * limit;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", "utilisateurs/", {
          params: { limit, offset: pointer },
          additionalHeaders: {},
          body: {},
        });
        const formattedData = responseDossiers?.results?.map((item) => ({
          id: item?.id,
          nom: item?.nom + " " + item?.prenom,
          email_professionnel: item?.email,
          bureau: "BESD",
          fonction: item?.role,
          cellule:
            item?.bureau_cellule == "BESD" ? "au Bureau" : item.bureau_cellule,
        }));
        setData(formattedData);
        setTotalCount(responseDossiers?.count || 0);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [session, currentPage, limit]);

  return (
    <div className="bg-sidebar rounded-lg border border-background shadow-sm overflow-hidden mt-4">
      {/* En-tête avec titre agrandi mais sobre */}
      <div className="p-6 border-b border-background bg-sidebar">
        <div className="flex items-center gap-3">
          <User size={22} className="text-primary" />
          <h3 className="text-lg font-semibold text-background-foreground opacity-70">
            Tous les utilisateurs
          </h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="">
              <TableHead className="px-8 py-3 text-xs font-medium uppercase ">
                Identité
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase ">
                Bureau
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                Cellule
              </TableHead>
              <TableHead className="px-8 py-3 text-xs font-medium uppercase tracking-wider ">
                Fonction
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d) => (
              <TableRow key={d.id} className="group transition-colors">
                {/* COLONNE UTILISATEURS */}
                <TableCell className="px-8 py-4 transition-colors group flex items-center gap-2">
                  <span className="p-2 bg-background rounded-full">
                    <User size={28} className="text-primary" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-sidebar-foreground group-hover:text-primary transition-colors uppercase">
                      {d.nom}
                    </span>
                    <span className="text-sm text-sidebar-foreground/80 font-medium line-clamp-1">
                      {d.email_professionnel}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium uppercase">
                      {Array.isArray(d.bureau) ? d.bureau[0] : d.bureau}
                    </span>
                  </div>
                </TableCell>
                {/* COLONNE BUREAU */}
                <TableCell className="px-8 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium uppercase">
                      {Array.isArray(d.cellule) ? d.cellule[0] : d.cellule}
                    </span>
                  </div>
                </TableCell>
                {/* COLONNE FONCTION */}
                <TableCell className="px-8 py-4 text-sm font-medium">
                  <div className="flex items-center gap-2 uppercase">
                    {Array.isArray(d.fonction) ? d.fonction[0] : d.fonction}
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
                          <UserCheck />
                          Profl
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserX />
                          Désactiver
                        </DropdownMenuItem>
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
