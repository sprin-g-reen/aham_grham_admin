"use client"

import * as React from "react"
import {
  LayoutDashboard,
  History,
  GraduationCap,
  Calendar,
  Quote,
  FileText,
  MapPin,
  ShieldCheck,
  Layout,
  Package,
  Tags,
  ClipboardList,
  Users,
  UserCircle,
  FileCode,
  CreditCard,
  GalleryVerticalEnd,
  Settings2,
  ShoppingBag
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
      icon: LayoutDashboard,
    },
    {
      title: "Activity",
      url: "dashboard/activity",
      icon: History,
    },
    {
      title: "Programs",
      url: "dashboard/program-details",
      icon: GraduationCap,
    },
    {
      title: "Events",
      url: "dashboard/event-details",
      icon: Calendar,
    },
    {
      title: "Testimonials",
      url: "dashboard/testimonials",
      icon: Quote,
    },
    {
      title: "Page Content",
      url: "dashboard/hero",
      icon: FileText,
    },
    {
      title: "Centers",
      url: "dashboard/centers",
      icon: MapPin,
    },
    {
      title: "Content Controller",
      url: "dashboard/content-controller",
      icon: ShieldCheck,
    },
    {
      title: "Footer Section",
      url: "dashboard/footer",
      icon: Layout,
    },
    {
      title: "eCommerce",
      url: "#",
      icon: ShoppingBag,
      items: [
        {
          title: "Products",
          url: "eCommerce/product-list",
        },
        {
          title: "Categories",
          url: "eCommerce/categories",
        },
        {
          title: "Orders",
          url: "eCommerce/order-list",
        },
        {
          title: "Customers",
          url: "eCommerce/customer-list",
        },
      ],
    },
    {
      title: "Accounts",
      url: "#",
      icon: UserCircle,
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
      icon: FileCode,
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
      icon: CreditCard,
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
