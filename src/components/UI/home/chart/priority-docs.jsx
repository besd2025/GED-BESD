"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
import React, { useState, useEffect } from "react";
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
import { fetchAPI } from "@/app/_utils/fetchApi";
export const description = "A donut chart";

// const chartData = [
//   { priority: "Normal", dossiers: 275, fill: "var(--color-Normal)" },
//   {
//     priority: "Confidentiel",
//     dossiers: 200,
//     fill: "var(--color-Confidentiel)",
//   },
//   { priority: "Secret", dossiers: 187, fill: "var(--color-Secret)" },
// ];

const chartConfig = {
  dossiers: {
    label: "dossiers",
  },
  Normal: {
    label: "Normal",
    color: "#CE1126",
  },
  Confidentiel: {
    label: "Confidentiel",
    color: "var(--chart-2)",
  },
  Secret: {
    label: "Secret",
    color: "var(--chart-1)",
  },
};

export function PriorityDocs() {


  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responsePriority = await fetchAPI(
          "get",
          "/dossiers/classification_niveau_priorite/",
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const results = responsePriority?.resultats || [];

        const formattedData = results.map((item) => {
          if (item.niveau_priorite === "NORMALE") {
            return {
              priority: "Normal",
              dossiers: item.total,
              fill: "var(--color-Normal)",
            };
          }

          if (item.niveau_priorite === "URGENTE") {
            return {
              priority: "Secret",
              dossiers: item.total,
              fill: "var(--color-Secret)",
            };
          }

          if (item.niveau_priorite === "TRES_URGENTE") {
            return {
              priority: "Confidentiel",
              dossiers: item.total,
              fill: "var(--color-Confidentiel)",
            };
          }

          return null;
        }).filter(Boolean);

        setChartData(formattedData);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Niveaux de priorité</CardTitle>
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
