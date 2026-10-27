"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import React, { useState, useEffect } from "react";
import { fetchAPI } from "@/app/_utils/fetchApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A donut chart";

const chartData = [
  { priority: "Archive", dossiers: 200, fill: "var(--color-Archive)" },
  {
    priority: "Dossiers_total",
    dossiers: 187,
    fill: "var(--color-Dossiers_total)",
  },
];

const chartConfig = {
  dossiers: {
    label: "dossiers",
  },
  Archive: {
    label: "Archive",
    color: "var(--chart-4)",
  },
  Dossiers_total: {
    label: "Dossiers total",
    color: "var(--chart-1)",
  },
};

export function DocsArchive() {
const [chartData, setChartData] = useState([]);
const [totalDossiers, setTotalDossiers] = useState(0)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const responseDossiers = await fetchAPI("get", "dossiers/total-count/", {
            params: {},
            additionalHeaders: {},
            body: {},
          });
const chartDat = [
  { priority: "Archive", dossiers: responseDossiers?.total_par_etat?.total_archived || 0, fill: "var(--color-Archive)" },
  {
    priority: "Dossiers_total",
    dossiers: responseDossiers?.total_dossiers || 0,
    fill: "var(--color-Dossiers_total)",
  },
];

          setTotalDossiers(responseDossiers?.total_dossiers || 0)
            setChartData(chartDat)
        } catch (error) {
          console.error("Erreur:", error);
        }
      };
  
      fetchData();
    }, []);
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Archivage</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="dossiers" hideLabel />}
            />
            <Pie data={chartData} dataKey="dossiers">
              <LabelList
                dataKey="dossiers"
                className="fill-sidebar-foreground"
                stroke="none"
                fontSize={16}
                fontWeight={700}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="priority" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
