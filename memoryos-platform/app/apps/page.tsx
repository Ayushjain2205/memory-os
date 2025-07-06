"use client"

import { useState } from "react"
import {
  Calendar,
  Activity,
  Mail,
  Github,
  Plus,
  Search,
  Settings,
  Pause,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Zap,
  Link,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface ConnectedApp {
  id: string
  name: string
  description: string
  icon: any
  iconColor: string
  status: "connected" | "syncing" | "error" | "paused" | "disconnected"
  lastSync: string
  syncFrequency: "realtime" | "hourly" | "daily" | "weekly"
  dataTypes: string[]
  memoriesCreated: number
  category: "productivity" | "health" | "social" | "entertainment" | "work"
}

const availableApps: ConnectedApp[] = [
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync events and meetings",
    icon: Calendar,
    iconColor: "text-blue-600",
    status: "connected",
    lastSync: "2 min ago",
    syncFrequency: "realtime",
    dataTypes: ["Events", "Meetings", "Reminders"],
    memoriesCreated: 47,
    category: "productivity",
  },
  {
    id: "google-fit",
    name: "Google Fit",
    description: "Track fitness and health",
    icon: Activity,
    iconColor: "text-green-600",
    status: "connected",
    lastSync: "5 min ago",
    syncFrequency: "hourly",
    dataTypes: ["Steps", "Workouts", "Heart Rate"],
    memoriesCreated: 23,
    category: "health",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Important emails and contacts",
    icon: Mail,
    iconColor: "text-red-600",
    status: "syncing",
    lastSync: "Syncing...",
    syncFrequency: "realtime",
    dataTypes: ["Important Emails", "Contacts"],
    memoriesCreated: 89,
    category: "work",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Code commits and projects",
    icon: Github,
    iconColor: "text-gray-900",
    status: "connected",
    lastSync: "30 min ago",
    syncFrequency: "hourly",
    dataTypes: ["Commits", "Pull Requests", "Issues"],
    memoriesCreated: 78,
    category: "work",
  },
]

export default function AppsPage() {
  const [apps, setApps] = useState<ConnectedApp[]>(availableApps)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedApp, setSelectedApp] = useState<ConnectedApp | null>(null)
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false)
  const [isMCPDialogOpen, setIsMCPDialogOpen] = useState(false)
  const { toast } = useToast()

  const filteredApps = apps.filter((app) => app.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const connectedApps = apps.filter((app) => app.status !== "disconnected")
  const totalMemories = connectedApps.reduce((sum, app) => sum + app.memoriesCreated, 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return CheckCircle
      case "syncing":
        return RefreshCw
      case "error":
        return XCircle
      case "paused":
        return Pause
      case "disconnected":
        return Plus
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      connected: "bg-green-100 text-green-700",
      syncing: "bg-blue-100 text-blue-700",
      error: "bg-red-100 text-red-700",
      paused: "bg-yellow-100 text-yellow-700",
      disconnected: "bg-gray-100 text-gray-600",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleAppAction = (appId: string, action: string) => {
    setApps(
      apps.map((app) => {
        if (app.id === appId) {
          switch (action) {
            case "connect":
              return { ...app, status: "syncing" as const, lastSync: "Connecting..." }
            case "disconnect":
              return { ...app, status: "disconnected" as const, lastSync: "Never", memoriesCreated: 0 }
            case "pause":
              return { ...app, status: "paused" as const }
            case "resume":
              return { ...app, status: "connected" as const, lastSync: "Just now" }
            case "sync":
              return { ...app, status: "syncing" as const, lastSync: "Syncing..." }
            default:
              return app
          }
        }
        return app
      }),
    )

    toast({
      title: `${apps.find((a) => a.id === appId)?.name} ${action}ed`,
      description: "Action completed successfully.",
    })
  }

  const handleMCPConnect = () => {
    toast({
      title: "MCP Connection Initiated",
      description: "Connecting to Model Context Protocol server...",
    })
    // Simulate MCP connection process
    setTimeout(() => {
      toast({
        title: "MCP Connected",
        description: "Successfully connected via Model Context Protocol.",
      })
      setIsMCPDialogOpen(false)
    }, 2000)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Connected Apps</h1>
            <p className="text-gray-600">Sync data from your apps to build memories automatically</p>
          </div>

          <Button
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100"
            onClick={() => setIsMCPDialogOpen(true)}
          >
            <Link className="h-4 w-4 mr-2" />
            Connect via MCP
          </Button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">{connectedApps.length} connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">{totalMemories} memories created</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Apps List */}
      <div className="space-y-3">
        {filteredApps.map((app) => {
          const Icon = app.icon
          const StatusIcon = getStatusIcon(app.status)

          return (
            <Card key={app.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  {/* Left side - App info */}
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <Icon className={`h-6 w-6 ${app.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-600">{app.description}</p>
                    </div>
                  </div>

                  {/* Center - Status and sync info */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <Badge className={`${getStatusColor(app.status)} border-0`} variant="secondary">
                        <StatusIcon className={`h-3 w-3 mr-1 ${app.status === "syncing" ? "animate-spin" : ""}`} />
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{app.lastSync}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{app.memoriesCreated}</p>
                      <p className="text-xs text-gray-500">memories</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 capitalize">{app.syncFrequency}</p>
                      <p className="text-xs text-gray-500">sync</p>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center gap-2">
                    {app.status === "disconnected" ? (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleAppAction(app.id, "connect")}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApp(app)
                            setIsConfigDialogOpen(true)
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAppAction(app.id, "sync")}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync Now
                            </DropdownMenuItem>
                            {app.status === "paused" ? (
                              <DropdownMenuItem onClick={() => handleAppAction(app.id, "resume")}>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleAppAction(app.id, "pause")}>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleAppAction(app.id, "disconnect")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Disconnect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* MCP Connection Dialog */}
      <Dialog open={isMCPDialogOpen} onOpenChange={setIsMCPDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Link className="h-6 w-6 text-purple-600" />
              Connect via MCP
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-medium text-purple-900 mb-2">Model Context Protocol</h3>
              <p className="text-sm text-purple-700">
                Connect to any MCP-compatible server to sync custom data sources and tools directly into your memory
                vault.
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">MCP Server URL</Label>
              <Input placeholder="ws://localhost:3001/mcp" className="mt-1" />
              <p className="text-xs text-gray-500 mt-1">Enter the WebSocket URL of your MCP server</p>
            </div>

            <div>
              <Label className="text-sm font-medium">Server Name</Label>
              <Input placeholder="My Custom Server" className="mt-1" />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Connection Options</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto-sync on connection</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Enable real-time updates</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Create memories automatically</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsMCPDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleMCPConnect}
              >
                <Link className="h-4 w-4 mr-2" />
                Connect MCP Server
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configuration Dialog */}
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedApp && (
                <>
                  <selectedApp.icon className={`h-6 w-6 ${selectedApp.iconColor}`} />
                  Configure {selectedApp.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Sync Frequency */}
              <div>
                <Label className="text-sm font-medium">Sync Frequency</Label>
                <Select defaultValue={selectedApp.syncFrequency}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Types */}
              <div>
                <Label className="text-sm font-medium">Data to Sync</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {selectedApp.dataTypes.map((dataType) => (
                    <div key={dataType} className="flex items-center space-x-2">
                      <Checkbox id={dataType} defaultChecked />
                      <Label htmlFor={dataType} className="text-sm">
                        {dataType}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div>
                <Label className="text-sm font-medium">Settings</Label>
                <div className="space-y-3 mt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Create memories for important items only</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-tag memories with app name</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
