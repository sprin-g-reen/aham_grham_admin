"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Home, 
  ShoppingBag, 
  Info, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  Globe
} from "lucide-react"
import axios from "axios"
import { API_URL } from "@/config"

interface PageStat {
    _id: string;
    views: number;
}

export default function TopPagesCard() {
  const [pages, setPages] = useState<PageStat[]>([])
  const [totalViews, setTotalViews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/stats`)
        const topPages = response.data.topPages || []
        setPages(topPages)
        setTotalViews(response.data.totalViews || 0)
      } catch (error) {
        console.error("Failed to fetch top pages", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  const getPageIcon = (page: string) => {
    switch (page.toLowerCase()) {
      case 'home': return <Home className="w-5 h-5" />
      case 'products': return <ShoppingBag className="w-5 h-5" />
      case 'about': return <Info className="w-5 h-5" />
      case 'contact': return <Mail className="w-5 h-5" />
      default: return <FileText className="w-5 h-5" />
    }
  }

  const getPageColor = (index: number) => {
    const colors = [
      'bg-emerald-500', 
      'bg-blue-500', 
      'bg-pink-500', 
      'bg-amber-500', 
      'bg-indigo-500'
    ]
    return colors[index % colors.length]
  }

  const getPageTextColor = (index: number) => {
    const colors = [
      'text-emerald-500', 
      'text-blue-500', 
      'text-pink-500', 
      'text-amber-500', 
      'text-indigo-500'
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Top Visited Pages</CardTitle>
        <CardDescription>
          Based on real-time visitor data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        {loading ? (
            <div className="space-y-6">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="animate-pulse flex items-center gap-4">
                        <div className="w-10 h-10 bg-muted rounded-xl" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-1/4" />
                            <div className="h-2 bg-muted rounded w-full" />
                        </div>
                    </div>
                ))}
            </div>
        ) : pages.length > 0 ? (
          pages.map((page, index) => {
            const percentage = totalViews > 0 ? (page.views / totalViews) * 100 : 0
            const isUp = index === 0 || index === 2 // Mock trend
            
            return (
              <div key={page._id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getPageColor(index)}/10 ${getPageTextColor(index)}`}>
                      {getPageIcon(page._id)}
                    </div>
                    <div>
                      <p className="text-md font-semibold text-foreground/90">
                        {page._id === 'home' ? 'Homepage' : page._id.charAt(0).toUpperCase() + page._id.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{page.views.toLocaleString()}</span>
                    <div className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.floor(Math.random() * 15 + 2)}%
                    </div>
                  </div>
                </div>
                
                <div className="relative pt-1">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                        <div 
                            style={{ width: `${Math.max(percentage * 2, 10)}%` }} 
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getPageColor(index)} transition-all duration-1000`}
                        />
                    </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center gap-3">
            <Globe className="w-12 h-12 opacity-20" />
            <p>No analytics data captured yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
