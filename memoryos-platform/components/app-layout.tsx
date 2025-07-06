"use client"

import type React from "react"
import { Search, Bell, Settings, User, Plus, Briefcase, Heart, FileText, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const navigationItems = [
  {
    title: "Memory Vault",
    href: "/memory",
    icon: FileText,
    count: 24,
  },
  {
    title: "Files",
    href: "/files",
    icon: FileText,
    count: 8,
  },
  {
    title: "Connected Apps",
    href: "/apps",
    icon: Settings,
    count: 3,
  },
  {
    title: "Profiles",
    href: "/profiles",
    icon: Users,
    count: 3,
  },
]

interface Profile {
  id: string
  name: string
  icon: any
  active: boolean
  color: string
}

interface AppLayoutProps {
  children: React.ReactNode
  activeProfile?: string
  onProfileChange?: (profileId: string) => void
  profiles?: Profile[]
}

const defaultProfiles: Profile[] = [
  {
    id: "personal",
    name: "Personal",
    icon: User,
    active: true,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "work",
    name: "Work",
    icon: Briefcase,
    active: false,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "health",
    name: "Health",
    icon: Heart,
    active: false,
    color: "bg-red-100 text-red-700",
  },
]

export function AppLayout({
  children,
  activeProfile = "personal",
  onProfileChange,
  profiles = defaultProfiles,
}: AppLayoutProps) {
  const pathname = usePathname()

  const handleProfileClick = (profileId: string) => {
    if (onProfileChange) {
      onProfileChange(profileId)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MemoryOS" className="w-12 h-12" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">MemoryOS</h1>
            </div>
          </div>
        </div>

        {/* Add Memory Button */}
        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Memory
          </Button>
        </div>

        {/* Navigation */}
        <div className="px-4 pb-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">NAVIGATION</div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{item.count}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Active Profile */}
        <div className="px-4 pb-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">ACTIVE PROFILE</div>
          <div className="space-y-1">
            {profiles.map((profile) => {
              const Icon = profile.icon
              const isActive = profile.id === activeProfile

              return (
                <button
                  key={profile.id}
                  onClick={() => handleProfileClick(profile.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${profile.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span>{profile.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Search Shortcut */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Search className="w-4 h-4" />
            <span>Press</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">⌘K</kbd>
            <span>to search</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search your memory vault..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-6">
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full bg-blue-600 text-white hover:bg-blue-700">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  )
}
