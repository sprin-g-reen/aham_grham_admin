import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, XAxis } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Today", orders: 0 },
]

const chartConfig = {
  orders: {
    label: "Orders",
    color: "hsl(var(--chart-3))",
  }
} satisfies ChartConfig

export default function TottalOrdersCard() {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="mb-3">
                    <p className="text-md text-muted-foreground">Total Orders</p>
                    <h2 className="text-3xl font-semibold">0</h2>
                 </div>
                  <p className="text-sm flex gap-2 mb-5">
                    <span className="text-muted-foreground">0%</span>
                    from last month
                  </p>
                <ChartContainer config={chartConfig} className="h-14 w-full">
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="fillOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-orders)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-orders)" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>
                        <XAxis hide dataKey="month" />
                        <Area
                            dataKey="orders"
                            type="monotone"
                            fill="url(#fillOrders)"
                            fillOpacity={0.1}
                            stroke="var(--color-orders)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                 </ChartContainer>
            </CardContent>
        </Card>
    )
}
