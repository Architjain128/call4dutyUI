import * as React from "react"
import { ChevronRight, Sparkle } from "lucide-react"

import { VersionSwitcher } from "@/components/version-switcher"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"
import {user} from "../data/dummydata"

// This is sample data.
const data = {
  versions: ["Call4Duty"],
  navMain: [
    {
      title: "Actions",
      url: "#",
      items: [
        {
          title: "All Incidents",
          url: "/incidents",
        },
      ],
    },
    {
      title: "Reporting",
      url: "#",
      items: [
        {
          title: "Insights",
          url: "/insights",
        },
        {
          title: "AI Insights",
          url: "/aiinsights",
          star: true
        }     
      ],
    },
    {
      title: "Entites",
      url: "#",
      items: [
        {
          title: "Teams",
          url: "/teams",
        },
        {
          title: "Users",
          url: "/users",
        },
        {
          title: "Services",
          url: "/services",
        },
        {
          title: "Schedules",
          url: "/schedules",
        },
        {
          title: "Escalation Policy",
          url: "/escaltionPolicy",
        },
     
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        {/* <SearchForm /> */}
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title} className="ml-0 border-l-0 px-3">
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>{item.star?<Sparkle/>:null} {item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user}></NavUser>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
