"use client"

import { Brain, FileText, Settings, Users, Search, Shield, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Memory Vault",
    url: "/memory",
    icon: Brain,
  },
  {
    title: "Files",
    url: "/files",
    icon: FileText,
  },
  {
    title: "Connected Apps",
    url: "/apps",
    icon: Settings,
  },
  {
    title: "Profiles",
    url: "/profiles",
    icon: Users,
  },
]

const quickActions = [
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Security",
    url: "/security",
    icon: Shield,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="MemoryOS" className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">MemoryOS</h1>
            <p className="text-sm text-gray-500">Your AI Memory Vault</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-gray-700 hover:bg-gray-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-700 font-medium">Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-gray-700 hover:bg-gray-100 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-gray-700 hover:bg-gray-100">
              <User className="h-4 w-4" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
