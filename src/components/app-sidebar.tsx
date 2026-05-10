"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Tv,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Gauge,
  ShoppingCart,
  LayoutGrid,
  File,
  Grid2x2,
  Landmark,
  LockKeyhole,
  CircleUserRound,
  ChartNoAxesCombined,
  TriangleAlert,
  Code,
  Droplet,
  Library,
  Calendar,
  Eye,
  MessageSquareQuote,
  Sparkles
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Jhon Deo",
    email: "m@example.com",
    avatar: "https://github.com/evilrabbit.png",
  },
  teams: [
    {
      name: "Aham Grham",
      logo: GalleryVerticalEnd,
      plan: "Admin Dashboard",
    },
  ],
  overview: [
    {
      title: "Overview",
      url: "dashboard/overview",
      icon: Gauge,
    },
    {
      title: "Programs",
      url: "dashboard/program-details",
      icon: Eye,
    },
    {
      title: "Events",
      url: "dashboard/event-details",
      icon: Eye,
    },
    {
      title: "Add Testimonials",
      url: "dashboard/testimonials",
      icon: MessageSquareQuote,
    },
    {
      title: "Page Content",
      url: "dashboard/hero",
      icon: Sparkles,
    },
    {
      title: "Our Centers",
      url: "dashboard/centers",
      icon: Landmark,
    },
    {
      title: "Content Controller",
      url: "dashboard/content-controller",
      icon: Settings2,
    },
    {
      title: "Footer Section",
      url: "dashboard/footer",
      icon: LayoutGrid,
    },
    {
      title: "Products",
      url: "eCommerce/product-list",
      icon: ShoppingCart,
    },
    {
      title: "Categories",
      url: "eCommerce/categories",
      icon: ShoppingCart,
    },
    {
      title: "Orders",
      url: "eCommerce/order-list",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      url: "eCommerce/customer-list",
      icon: ShoppingCart,
    },
    {
      title: "Accounts",
      url: "#",
      icon: CircleUserRound,
      items: [
        {
          title: "Profile",
          url: "account/profile",
        },
        {
          title: "Edit Profile",
          url: "account/edit-profile",
        },
        {
          title: "Password Setting",
          url: "account/password-setting",
        },
        {
          title: "Noitifications",
          url: "account/notifications",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: Code,
      items: [
        {
          title: "Docs",
          url: "docs",
        },
        {
          title: "Upload",
          url: "forms/file-upload",
        },
      ],
    },
    {
      title: "Pricing",
      url: "pricing/pricing-tables",
      icon: Landmark,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon"
     {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.overview} label="Dashboard" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
