import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, XAxis } from "recharts"
import axios from "axios"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function VisitorsCard() {
  const [data, setData] = useState<{ totalVisitors: number; chartData: any[] }>({
    totalVisitors: 0,
    chartData: []
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/analytics/stats')
        setData({
          totalVisitors: response.data.totalVisitors,
          chartData: response.data.chartData.length > 0 ? response.data.chartData : [
            { date: "N/A", visitors: 0 }
          ]
        })
      } catch (error) {
        console.error("Failed to fetch analytics stats", error)
      }
    }
    fetchStats()
    // Poll every 30 seconds for real-time feel
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-3">
          <p className="text-md text-muted-foreground">Visitors</p>
          <h2 className="text-3xl font-semibold">{data.totalVisitors.toLocaleString()}</h2>
        </div>

        <p className="text-sm flex gap-2 mb-5">
          <span className="text-green-600 font-semibold">+ Real-time</span>
          tracking active
        </p>

        <ChartContainer config={chartConfig} className="h-14 w-full">
          <AreaChart
            accessibilityLayer
            data={data.chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis hide dataKey="date" />

            <Area
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-visitors)"
              fill="url(#fillVisitors)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
