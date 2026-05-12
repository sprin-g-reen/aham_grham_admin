import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { NotificationDropdown } from "@/components/notification-dropdown"
import axios from "axios"
import { API_URL } from "@/config"
import { Button } from "@/components/ui/button"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { GlobalSearch } from "@/components/global-search"



import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"


export default function AppLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />

      <SidebarInset>
        {/* HEADER */}
        <header
          className={cn(
            "sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 transition-all duration-200 border-b",
            scrolled
              ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
              : "bg-transparent"
          )}
        >
          <div className="flex items-center gap-2 px-6">
            <SidebarTrigger
              size="icon"
              className="rounded-full h-9 w-9 [&_svg]:size-5 hover:bg-muted/60 transition-colors"
            />

            <Separator orientation="vertical" className="h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="ml-auto px-6">
            <div className="flex items-center gap-1">
              <GlobalSearch />
              <ThemeToggle />
              <div className="relative">
                <NotificationDropdown />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                  5
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

        {/* LAST ACTIVITY FOOTER (Gmail Style) */}
        <LastActivityFooter />

      </SidebarInset>
    </SidebarProvider>
  )
}

function LastActivityFooter() {
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [allActivities, setAllActivities] = useState<any[]>([]);

  const fetchLatest = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/activities`);
      if (data && data.length > 0) {
        setLastActivity(data[0]);
        setAllActivities(data.slice(0, 10)); // Top 10 for the details popup
      }
    } catch (error) {
      console.error("Failed to fetch activity");
    }
  };

  useEffect(() => {
    fetchLatest();
    const interval = setInterval(fetchLatest, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (!lastActivity) return null;

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="mt-auto px-6 py-3 border-t bg-background/50 flex flex-col md:flex-row justify-between items-center text-[10px] text-muted-foreground gap-2">
      <div className="flex gap-4">
        <span>Programme Policies</span>
        <span>Powered by Aham Grham</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span>Last account activity: {timeAgo(lastActivity.createdAt)}</span>
        <button 
          onClick={() => setShowDetails(true)}
          className="text-primary hover:underline font-medium"
        >
          Details
        </button>
      </div>

      {/* MINI MODAL FOR DETAILS */}
      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-sm">Activity on this account</h3>
              <button onClick={() => setShowDetails(false)} className="hover:bg-muted p-1 rounded-full">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-xs mb-4">This table shows information about the last activity on this admin panel.</p>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-[10px] uppercase tracking-wider">
                    <th className="px-3 py-2 border font-bold">Access Type</th>
                    <th className="px-3 py-2 border font-bold">Location (IP)</th>
                    <th className="px-3 py-2 border font-bold">Date/Time</th>
                  </tr>
                </thead>
                <tbody>
                  {allActivities.map((act) => (
                    <tr key={act._id} className="text-[11px] hover:bg-muted/30">
                      <td className="px-3 py-2 border">{act.module} ({act.action})</td>
                      <td className="px-3 py-2 border font-mono text-[9px]">{act.ip || 'Unknown'}</td>
                      <td className="px-3 py-2 border">{new Date(act.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t bg-muted/10 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
