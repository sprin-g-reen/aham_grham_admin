"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { 
  Search, 
  LayoutDashboard, 
  Activity, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  MapPin, 
  ShoppingCart, 
  User, 
  Settings, 
  FileText, 
  CreditCard,
  Plus,
  Box,
  Users,
  ShieldCheck,
  Zap
} from "lucide-react"

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  // Keyboard shortcut: Ctrl + K / Cmd + K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((path: string) => {
    setOpen(false)
    navigate(path)
  }, [navigate])

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full [&_svg]:size-5 text-muted-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(true)}
        title="Search (Ctrl+K)"
      >
        <Search />
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, sections, or actions..." />
        <CommandList className="max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Dashboard">
            <CommandItem onSelect={() => runCommand("/dashboard/overview")}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/dashboard/activity")}>
              <Activity className="mr-2 h-4 w-4" />
              <span>Activity Logs</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/dashboard/content-controller")}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Content Controller</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Management">
            <CommandItem onSelect={() => runCommand("/dashboard/programs")}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Programs</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/dashboard/events")}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Events</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/dashboard/testimonials")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Testimonials</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/dashboard/centers")}>
              <MapPin className="mr-2 h-4 w-4" />
              <span>Centers</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Store (eCommerce)">
            <CommandItem onSelect={() => runCommand("/eCommerce/product-list")}>
              <Box className="mr-2 h-4 w-4" />
              <span>Products</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/eCommerce/order-list")}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/eCommerce/customer-list")}>
              <Users className="mr-2 h-4 w-4" />
              <span>Customers</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Account">
            <CommandItem onSelect={() => runCommand("/account/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/account/edit-profile")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/pricing/pricing-tables")}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pricing & Plans</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Help">
            <CommandItem onSelect={() => runCommand("/docs")}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand("/faq")}>
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Security & FAQ</span>
            </CommandItem>
          </CommandGroup>
          
        </CommandList>
      </CommandDialog>
    </>
  )
}
