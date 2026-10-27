"use client";

import React, { useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  Bar,
  XAxis,
  ComposedChart,
} from "recharts";
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
import { fetchAPI } from "@/app/_utils/fetchApi";
const dataByPeriode = {
  Jour: [
    { label: "Lun", dossiers: 9 },
    { label: "Mar", dossiers: 14 },
    { label: "Mer", dossiers: 6 },
    { label: "Jeu", dossiers: 18 },
    { label: "Ven", dossiers: 11 },
    { label: "Sam", dossiers: 4 },
  ],
  Mois: [
    { label: "Janvier", dossiers: 140 },
    { label: "Février", dossiers: 270 },
    { label: "Mars", dossiers: 200 },
    { label: "Avril", dossiers: 60 },
    { label: "Mai", dossiers: 185 },
    { label: "Juin", dossiers: 195 },
    { label: "Juillet", dossiers: 160 },
    { label: "Août", dossiers: 120 },
    { label: "Septembre", dossiers: 230 },
    { label: "Octobre", dossiers: 290 },
    { label: "Novembre", dossiers: 250 },
    { label: "Décembre", dossiers: 155 },
  ],
  Année: [
    { label: "2020", dossiers: 980 },
    { label: "2021", dossiers: 1520 },
    { label: "2022", dossiers: 1800 },
    { label: "2023", dossiers: 2100 },
    { label: "2024", dossiers: 2450 },
    { label: "2025", dossiers: 2700 },
  ],
};

const descriptionByPeriode = {
  Jour: "Cette semaine",
  Mois: "Janvier – Décembre 2024",
  Année: "2020 – 2025",
};

const chartConfig = {
  dossiers: {
    label: "Dossiers traités",
    color: "var(--chart-3)",
  },
};

export function DocsTraites() {
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
        <CardTitle>Dossiers traités</CardTitle>
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
          <ComposedChart
            accessibilityLayer
            data={dataByPeriod[periode]}
            margin={{ top: 20, left: 12, right: 12 }}
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

            {/* Bar layer */}
            <Bar
              dataKey="dossiers"
              fill="var(--color-dossiers)"
              radius={[4, 4, 0, 0]}
              opacity={0.5}
              tooltipType="none"
            />
            {/* Line layer on top */}
            <Line
              dataKey="dossiers"
              type="natural"
              stroke="var(--color-dossiers)"
              strokeWidth={2}
              dot={{ fill: "var(--color-dossiers)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
