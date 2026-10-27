"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

export const description = "A donut chart with text";
import { useEffect, useState } from "react";
import { fetchAPI } from "@/app/_utils/fetchApi";
const chartConfig = {
  dossiers: {
    label: "Dossiers",
  },
  non_assignes: {
    label: "Non assignés",
    color: "#CE1126",
  },
  assignes: {
    label: "Assignés",
    color: "var(--chart-1)",
  },
};



export function DocsChart() {

  const [data, setData] = useState([])
const [totalDossiers, setTotalDossiers] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDossiers = await fetchAPI("get", "dossiers/total-count/", {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        const chartData = [
          { browser: "non_assignes", dossiers: responseDossiers?.dossier_non_assigne || 0, fill: "var(--color-non_assignes)" },
          {
            browser: "assignes",
            dossiers: responseDossiers?.total_par_etat?.total_assign || 0,
            fill: "var(--color-assignes)",
          },
         
        ];
        setTotalDossiers(responseDossiers?.total_dossiers || 0)
          setData(chartData)
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchData();
  }, []);
  // Correct reduce usage: provide the initial accumulator as the 2nd argument to reduce
  // and guard against undefined dossier counts.
  // const totalDossiers = React.useMemo(() => {
  //   return data.reduce((acc, curr) => acc + Number(curr?.dossiers || 0), 0);
  // }, [data]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Dossiers</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Pie
              data={data}
              dataKey="dossiers"
              nameKey="browser"
              innerRadius={55}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDossiers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total dossiers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
