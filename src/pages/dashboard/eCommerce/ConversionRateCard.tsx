"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Bar, BarChart, XAxis } from "recharts"
import axios from "axios"
import { API_URL } from "@/config"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function ConversionRateCard() {
  const [sessions, setSessions] = useState(0)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/stats`)
        setSessions(response.data.totalSessions || 0)
      } catch (error) {
        console.error("Failed to fetch sessions", error)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  // Dummy chart data for look and feel, can be upgraded to real history later
  const chartData = [
    { name: "Day 1", sessions: sessions * 0.4 },
    { name: "Day 2", sessions: sessions * 0.7 },
    { name: "Day 3", sessions: sessions * 0.5 },
    { name: "Day 4", sessions: sessions * 0.9 },
    { name: "Day 5", sessions: sessions },
  ]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-3">
          <p className="text-md text-muted-foreground uppercase font-medium tracking-wider">Total Sessions</p>
          <h2 className="text-3xl font-semibold">{sessions.toLocaleString()}</h2>
        </div>

        <p className="text-sm flex gap-2 mb-5">
          <span className="text-blue-500 font-bold tracking-tight">ACTIVE</span>
          <span className="text-muted-foreground opacity-80 italic">30m timeout</span>
        </p>

        <ChartContainer config={chartConfig} className="h-14 w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <XAxis hide dataKey="name" />
            <Bar
              dataKey="sessions"
              fill="var(--color-sessions)"
              radius={2}
              maxBarSize={12}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
