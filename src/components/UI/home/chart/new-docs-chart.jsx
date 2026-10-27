"use client";

import React, { useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { fetchAPI } from "@/app/_utils/fetchApi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A line chart";

const dataByPeriode = {
  Jour: [
    { label: "Lun", dossiers: 12 },
    { label: "Mar", dossiers: 19 },
    { label: "Mer", dossiers: 8 },
    { label: "Jeu", dossiers: 23 },
    { label: "Ven", dossiers: 15 },
    { label: "Sam", dossiers: 6 },
  ],
  Mois: [
    { label: "Janvier", dossiers: 186 },
    { label: "Février", dossiers: 305 },
    { label: "Mars", dossiers: 237 },
    { label: "Avril", dossiers: 73 },
    { label: "Mai", dossiers: 209 },
    { label: "Juin", dossiers: 214 },
    { label: "Juillet", dossiers: 190 },
    { label: "Août", dossiers: 145 },
    { label: "Septembre", dossiers: 260 },
    { label: "Octobre", dossiers: 310 },
    { label: "Novembre", dossiers: 280 },
    { label: "Décembre", dossiers: 175 },
  ],
  Année: [
    { label: "2020", dossiers: 1200 },
    { label: "2021", dossiers: 1850 },
    { label: "2022", dossiers: 2100 },
    { label: "2023", dossiers: 2450 },
    { label: "2024", dossiers: 2780 },
    { label: "2025", dossiers: 3050 },
  ],
};

const descriptionByPeriode = {
  Jour: "Cette semaine",
  Mois: "Janvier – Décembre 2024",
  Année: "2020 – 2025",
};

const chartConfig = {
  dossiers: {
    label: "Dossiers",
    color: "var(--chart-3)",
  },
};

export function NewDocsChart() {
  const [periode, setPeriode] = useState("Mois");
  const [dataByPeriod, setDataByPeriod] = useState({}); // ← nouveau nom
  const [isLoading, setIsLoading] = React.useState(true);

  const handleTimePeriodChange = (value) => {
    setPeriode(value);
  };

  React.useEffect(() => {
    async function getData() {
      try {
        const periodParam =
          periode === "jour"
            ? "jour"
            : periode === "semaine"
              ? "semaine"
              : periode === "annee"
                ? "annee"
                : "mois";
        const results = await fetchAPI(
          "get",
          `/dossiers/statistiques/?periode=${periodParam}`,
          { params: {}, additionalHeaders: {}, body: {} },
        );
        if (!Array.isArray(results)) return;

        const chartData = results.map((item) => {
          let label;
          if (periode === "Jour") {
            label = new Date(item.period).toLocaleDateString("fr-FR", {
              weekday: "short",
            });
          } else if (periode === "Mois") {
            label = new Date(item.period).toLocaleDateString("fr-FR", {
              month: "short",
            });
          } else if (periode === "Année") {
            label = new Date(item.period).getFullYear().toString();
          } else {
            label = item.period;
          }
          return {
            label,
            dossiers: item.count,
          };
        });

        setDataByPeriod((prev) => ({
          ...prev,
          [periode]: chartData,
        }));
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [periode]);

  const chartData = dataByPeriode[periode];

  return (
    <Card className="border-none h-max">
      <CardHeader className="relative">
        <CardTitle>Dossiers enregistrés</CardTitle>
        {/* <CardDescription>{descriptionByPeriode[periode]}</CardDescription> */}
        <Select value={periode} onValueChange={handleTimePeriodChange}>
          <SelectTrigger className="absolute top-0 right-3 w-[120px]">
            <SelectValue placeholder="Periode" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Jour">Jour</SelectItem>
              <SelectItem value="Mois">Mois</SelectItem>
              <SelectItem value="Année">Année</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={dataByPeriod[periode]}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="dossiers"
              type="natural"
              stroke="var(--color-dossiers)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-dossiers)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
