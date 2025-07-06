"use client"

import { useState } from "react"
import { Shield, Key, Clock, Eye, EyeOff, AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface SecurityLog {
  id: string
  action: string
  app: string
  timestamp: string
  status: "success" | "warning" | "error"
  details: string
}

const securityLogs: SecurityLog[] = [
  {
    id: "1",
    action: "Memory Access",
    app: "ChatGPT Assistant",
    timestamp: "2024-01-15 14:30:22",
    status: "success",
    details: "Read access to preferences and goals",
  },
  {
    id: "2",
    action: "Permission Change",
    app: "Notion Workspace",
    timestamp: "2024-01-15 09:15:10",
    status: "warning",
    details: "Requested additional write permissions",
  },
  {
    id: "3",
    action: "Failed Access",
    app: "Unknown App",
    timestamp: "2024-01-14 22:45:33",
    status: "error",
    details: "Unauthorized access attempt blocked",
  },
]

export default function SecurityPage() {
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [autoExpiry, setAutoExpiry] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [accessLogging, setAccessLogging] = useState(true)
  const [showLogs, setShowLogs] = useState(false)
  const { toast } = useToast()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "error":
        return AlertTriangle
      default:
        return Shield
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleSecurityToggle = (setting: string, enabled: boolean) => {
    toast({
      title: "Security Setting Updated",
      description: `${setting} has been ${enabled ? "enabled" : "disabled"}.`,
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Security & Privacy</h1>
        <p className="text-gray-600">Manage your data security, encryption, and access controls</p>
      </div>

      <div className="space-y-8">
        {/* Security Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Security Score</h3>
                  <p className="text-2xl font-bold text-green-600">92/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Encrypted Items</h3>
                  <p className="text-2xl font-bold text-blue-600">47/52</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Active Sessions</h3>
                  <p className="text-2xl font-bold text-orange-600">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encryption Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Encryption & Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">End-to-End Encryption</Label>
                <p className="text-sm text-gray-600 mt-1">All memory items are encrypted with your personal key</p>
              </div>
              <Switch
                checked={encryptionEnabled}
                onCheckedChange={(checked) => {
                  setEncryptionEnabled(checked)
                  handleSecurityToggle("End-to-end encryption", checked)
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Auto-Expiry for Sensitive Data</Label>
                <p className="text-sm text-gray-600 mt-1">Automatically delete sensitive memories after set time</p>
              </div>
              <Switch
                checked={autoExpiry}
                onCheckedChange={(checked) => {
                  setAutoExpiry(checked)
                  handleSecurityToggle("Auto-expiry", checked)
                }}
              />
            </div>

            {autoExpiry && (
              <div className="ml-4 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">Default Expiry Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Separator />

            <div>
              <Label className="text-base font-medium">Encryption Key Management</Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Your encryption keys are stored securely and never shared
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Rotate Keys
                </Button>
                <Button variant="outline" size="sm">
                  Export Backup
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Two-Factor Authentication</Label>
                <p className="text-sm text-gray-600 mt-1">Require additional verification for sensitive operations</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  setTwoFactorEnabled(checked)
                  handleSecurityToggle("Two-factor authentication", checked)
                }}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Access Logging</Label>
                <p className="text-sm text-gray-600 mt-1">Log all access attempts and permission changes</p>
              </div>
              <Switch
                checked={accessLogging}
                onCheckedChange={(checked) => {
                  setAccessLogging(checked)
                  handleSecurityToggle("Access logging", checked)
                }}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Session Management</Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">Manage active sessions and automatic logout</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Session Timeout</Label>
                  <Select defaultValue="24">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Max Concurrent Sessions</Label>
                  <Select defaultValue="5">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 session</SelectItem>
                      <SelectItem value="3">3 sessions</SelectItem>
                      <SelectItem value="5">5 sessions</SelectItem>
                      <SelectItem value="10">10 sessions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Access Transparency Logs
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowLogs(!showLogs)}>
                {showLogs ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showLogs ? "Hide Logs" : "Show Logs"}
              </Button>
            </div>
          </CardHeader>

          {showLogs && (
            <CardContent>
              <div className="space-y-4">
                {securityLogs.map((log) => {
                  const StatusIcon = getStatusIcon(log.status)

                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <StatusIcon
                        className={`h-5 w-5 mt-0.5 ${
                          log.status === "success"
                            ? "text-green-600"
                            : log.status === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{log.action}</h4>
                          <Badge className={getStatusColor(log.status)} variant="secondary">
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>App: {log.app}</span>
                          <span>Time: {log.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    Load More Logs
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Data Export & Deletion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-medium">Export Your Data</Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">Download a complete copy of your memory data</p>
              <Button variant="outline">Export All Data</Button>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium text-red-700">Delete All Data</Label>
              <p className="text-sm text-gray-600 mt-1 mb-3">
                Permanently delete all your memories, files, and settings
              </p>
              <Button variant="destructive">Delete All Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
