import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, XAxis } from "recharts"
import axios from "axios"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  views: {
    label: "Views",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export default function TotalRevenueCard() {
  const [data, setData] = useState({
    totalViews: 0,
    chartData: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/stats')
        setData({
          totalViews: response.data.totalViews,
          chartData: response.data.chartData || [] // We can use the same daily stats for simplicity
        })
      } catch (error) {
        console.error("Failed to fetch analytics stats", error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-3">
          <p className="text-md text-muted-foreground">Page Views</p>
          <h2 className="text-3xl font-semibold">{data.totalViews.toLocaleString()}</h2>
        </div>

        <p className="text-sm flex gap-2 mb-5">
          <span className="text-green-600 font-semibold">+ Real-time</span>
          tracking active
        </p>

        <ChartContainer config={chartConfig} className="h-14 w-full">
          <BarChart
            accessibilityLayer
            data={data.chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis hide dataKey="date" />

            <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-views)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--color-views)" stopOpacity={0.7} />
                </linearGradient>
            </defs>

            <Bar
              dataKey="visitors" // Using visitors data for the bar trend
              fill="url(#viewsGradient)"
              radius={4}
              maxBarSize={12}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
