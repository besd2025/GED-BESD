"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

export const description = "A bar chart with a label";
import { useEffect, useState, useContext } from "react";
import { fetchAPI } from "@/app/_utils/fetchApi";
import { UserContext } from "@/src/components/UI/context/User_Context";
const chartData = [
  { Cellules: "CC1", dossiers: 186, en_traitement: 48, traites: 138 },
  { Cellules: "CC2", dossiers: 305, en_traitement: 108, traites: 197 },
  { Cellules: "CC3", dossiers: 237, en_traitement: 70, traites: 230 },
  { Cellules: "CC4", dossiers: 73, en_traitement: 100, traites: 72 },
  { Cellules: "CC5", dossiers: 209, en_traitement: 115, traites: 207 },
  { Cellules: "CC6", dossiers: 214, en_traitement: 38, traites: 211 },
];

const chartConfig = {
  dossiers: {
    label: "Dossiers total",
    color: "var(--chart-1)",
  },
  en_traitement: {
    label: "En traitements",
    color: "var(--chart-4)",
  },
  traites: {
    label: "Traités",
    color: "var(--chart-2)",
  },
};

export function DocsPerCellules() {

  const [data, setData] = useState([])
  // UserContext provides { session } according to User_Context.jsx
  const { session } = useContext(UserContext);

  useEffect(() => {
    // Only fetch when we have a valid bureau_id
    const bureauId = session?.bureau_id
    if (!bureauId) {
      console.log("DocsPerCellules: bureau_id not available yet", { session });
      return;
    }

    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", `bureaux/${bureauId}/statistiques_dossiers/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });


        const formattedData = responseDossiers?.statistiques.map((item) => (
          {
            Cellules: item?.nom_cellule,
            dossiers: item?.total_dossiers,
            en_traitement: item?.par_status?.IN_PROCESSING,
            traites: item?.par_status?.PROCESSED

          }
        ));
        setData(formattedData);

      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, [session]);
  return (
    <Card className="h-max">
      <CardHeader>
        <CardTitle>Dossiers par cellule</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Cellules"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="en_traitement"
              stackId="a"
              fill="var(--color-en_traitement)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="traites"
              stackId="a"
              fill="var(--color-traites)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="dossiers"
              stackId="a"
              fill="var(--color-dossiers)"
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
