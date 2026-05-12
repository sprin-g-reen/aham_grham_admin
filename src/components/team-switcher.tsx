import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType | string
    plan: string
  }[]
}) {
  const [activeTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent h-24"
        >
          <div className="flex items-center justify-center rounded-lg overflow-hidden w-full h-20">
            {typeof activeTeam.logo === "string" ? (
              <img src={activeTeam.logo} alt={activeTeam.name} className="h-full w-auto object-contain" />
            ) : (
              <div className="bg-sidebar-primary text-sidebar-primary-foreground size-full flex items-center justify-center">
                <activeTeam.logo className="size-4" />
              </div>
            )}
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
