"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import axios from "axios"
import { API_URL } from "@/config"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  views: {
    label: "Page Views",
  },
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
  views_data: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Helper to get all dates of the current month
const getAllDatesInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = new Date(year, month, 1);
    const dates = [];
    while (date.getMonth() === month) {
        dates.push(new Date(date).toISOString().split('T')[0]);
        date.setDate(date.getDate() + 1);
    }
    return dates;
};

export default function SalesAnalysisCard() {
  const [activeChart, setActiveChart] = React.useState<"visitors" | "views_data">("visitors")
  const [data, setData] = React.useState<any[]>([])
  const [totals, setTotals] = React.useState({ visitors: 0, views: 0 })

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/stats`)
        const { chartData, totalVisitors, totalViews } = response.data
        
        // 1. Get all dates for the current month
        const allMonthDates = getAllDatesInMonth();
        
        // 2. Map real data to a dictionary for easy lookup
        const dataMap = (chartData || []).reduce((acc: any, curr: any) => {
            acc[curr.date] = curr;
            return acc;
        }, {});

        // 3. Merge: Fill all dates with real data or 0
        const formatted = allMonthDates.map(date => ({
            date,
            visitors: dataMap[date]?.visitors || 0,
            views_data: dataMap[date]?.views || 0
        }));

        setData(formatted)
        setTotals({ visitors: totalVisitors, views: totalViews })
      } catch (error) {
        console.error("Failed to fetch sales analysis data", error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-xl">Analytics Analysis</CardTitle>
          <CardDescription className="text-md">
            Daily activity for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </CardDescription>
        </div>
        <div className="flex">
          {[
            { key: "visitors", label: "Visitors", value: totals.visitors },
            { key: "views_data", label: "Views", value: totals.views }
          ].map((item) => {
            return (
              <button
                key={item.key}
                data-active={activeChart === item.key}
                className="data-[active=true]:bg-muted/50 relative z-30
                           flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left
                           even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(item.key as any)}
                  >
                <span className="text-muted-foreground text-md">
                  {item.label}
                </span>
                <span className="text-lg leading-none font-semibold sm:text-3xl">
                  {item.value.toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[330px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />

            <Bar 
                dataKey={activeChart} 
                radius={2} 
                fill={`var(--color-${activeChart})`}
                barSize={window.innerWidth < 640 ? 4 : 8} // Thin bars like the requested image
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
