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
          className="cursor-default hover:bg-transparent h-14"
        >
          <div className="flex aspect-square size-12 items-center justify-center rounded-lg overflow-hidden">
            {typeof activeTeam.logo === "string" ? (
              <img src={activeTeam.logo} alt={activeTeam.name} className="size-full object-contain" />
            ) : (
              <div className="bg-sidebar-primary text-sidebar-primary-foreground size-full flex items-center justify-center">
                <activeTeam.logo className="size-4" />
              </div>
            )}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold tracking-tight">
              {activeTeam.name}
            </span>
            <span className="truncate text-[10px] text-muted-foreground">{activeTeam.plan}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
