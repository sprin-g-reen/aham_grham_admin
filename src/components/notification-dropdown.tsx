import React, { useState, useEffect } from "react"
import { Bell, History, PlusCircle, Edit, Trash2, FileUp, LogIn, LogOut } from "lucide-react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type Notification = {
  _id: string
  action: string
  module: string
  description: string
  user: string
  createdAt: string
  unread?: boolean
}

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [lastViewed, setLastViewed] = useState<number>(() => {
    return parseInt(localStorage.getItem('notifications_last_viewed') || '0')
  })

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://aham-grham-website.vercel.app/api/activities')
      // Map and sort (assuming API already sorts by newest first)
      const data = response.data.map((n: any) => ({
        ...n,
        unread: new Date(n.createdAt).getTime() > lastViewed
      }))
      setNotifications(data.slice(0, 10)) // Show only top 10 in dropdown
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Optional: Refresh every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [lastViewed])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Don't clear unread immediately, but update state
    } else {
      // When closing, mark all as seen
      const now = Date.now()
      setLastViewed(now)
      localStorage.setItem('notifications_last_viewed', now.toString())
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    }
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE': return <PlusCircle className="w-4 h-4" />;
      case 'UPDATE': return <Edit className="w-4 h-4" />;
      case 'DELETE': return <Trash2 className="w-4 h-4" />;
      case 'IMPORT': return <FileUp className="w-4 h-4" />;
      case 'LOGIN': return <LogIn className="w-4 h-4" />;
      case 'LOGOUT': return <LogOut className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
      case 'UPDATE': return "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
      case 'DELETE': return "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400";
      case 'IMPORT': return "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
      case 'LOGIN': return "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
      case 'LOGOUT': return "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400";
      default: return "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return "just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return past.toLocaleDateString()
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full [&_svg]:size-5"
          >
            <Bell />
          </Button>

          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-2 h-2.5 w-2.5 rounded-full
              bg-destructive border-2 border-background animate-pulse" />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-xl border shadow-xl"
      >
        <DropdownMenuLabel className="px-4 py-3">
          <span>Notifications</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="h-96 overflow-y-auto">
          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground italic">
                No recent activity
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={cn(
                    "flex gap-3 px-4 py-3 cursor-pointer transition-colors border-b last:border-0",
                    item.unread
                      ? "bg-primary/5 hover:bg-primary/10"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback
                      className={cn(
                        "font-medium text-xs flex items-center justify-center",
                        getActionColor(item.action)
                      )}
                    >
                      {getActionIcon(item.action)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className="text-sm font-medium leading-none truncate">
                      {item.action} in {item.module}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                        {item.user}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {formatTimeAgo(item.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-2 border-t bg-muted/20">
          <Button 
            variant="ghost" 
            className="w-full text-xs font-medium"
            onClick={() => window.location.href = '/dashboard/activity'}
          >
            View Full Activity Log
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

