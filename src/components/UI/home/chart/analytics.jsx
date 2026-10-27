"use client";

import React, { useState,useContext, use } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { NewDocsChart } from "./new-docs-chart";
import { DocsPerCellules } from "./docs-per-cellules";
import { PriorityDocs } from "./priority-docs";
import { DocsChart } from "./docs-chart";
import { DocsArchive } from "./docs-archive";
import { DocsTraites } from "./docs-traites";
import { UserContext } from "@/src/components/UI/context/User_Context";
// Données pour le premier graphique (Flux)
const fluxPeriodes = {
  Jour: [
    { name: "Lun", dossiers: 4 },
    { name: "Mar", dossiers: 7 },
    { name: "Mer", dossiers: 5 },
    { name: "Jeu", dossiers: 9 },
    { name: "Ven", dossiers: 12 },
  ],
  Mois: [
    { name: "Jan", dossiers: 45 },
    { name: "Fév", dossiers: 52 },
    { name: "Mar", dossiers: 48 },
    { name: "Avr", dossiers: 61 },
  ],
  Année: [
    { name: "2023", dossiers: 450 },
    { name: "2024", dossiers: 580 },
    { name: "2025", dossiers: 720 },
    { name: "2026", dossiers: 150 },
  ],
};

// Données pour les Cellules (Barres verticales)
const dataCellules = [
  { name: "Cellule PESSE", total: 145, color: "#CE1126" },
  { name: "Cellule SEAG", total: 98, color: "#1EB53A" },
  { name: "Cellule FESPP", total: 67, color: "#708090" },
];

// Données de Priorité
const dataPriorite = [
  { name: "Normal", value: 60, color: "#CE1126" },
  { name: "Confidentiel", value: 30, color: "#1EB53A" },
  { name: "Secret", value: 10, color: "#708090" },
];

export default function HomeAnalytics() {
  const [periode, setPeriode] = useState("Mois");
const {session} = useContext(UserContext);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <NewDocsChart />
      {session && session?.type_service == "Bureau"? <DocsPerCellules /> : null}
      <PriorityDocs />
      <DocsChart />
      <DocsArchive />
      <DocsTraites />
    </div>
  );
}
