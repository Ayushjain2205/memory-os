"use client"

import { useState } from "react"
import {
  Plus,
  User,
  Briefcase,
  Heart,
  Plane,
  Settings,
  MoreHorizontal,
  Users,
  Check,
  Home,
  Star,
  Target,
  Calendar,
  Clock,
  Mail,
  Phone,
  Camera,
  Music,
  Book,
  Coffee,
  Car,
  Bike,
  Train,
  Ship,
  Rocket,
  Globe,
  Map,
  Compass,
  Mountain,
  Sun,
  Moon,
  Cloud,
  Zap,
  FlameIcon as Fire,
  Droplets,
  Leaf,
  Flower,
  TreesIcon as Tree,
  Gem,
  Shield,
  Lock,
  Key,
  Eye,
  Bell,
  Flag,
  Tag,
  Bookmark,
  Archive,
  Folder,
  FileText,
  Image,
  Video,
  Headphones,
  Mic,
  Speaker,
  Monitor,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Gamepad2,
  Joystick,
  Dice1,
  Puzzle,
  Trophy,
  Award,
  Medal,
  Crown,
  Gift,
  ShoppingBag,
  CreditCard,
  DollarSign,
  TrendingUp,
  BarChart,
  PieChart,
  Activity,
  CloudLightningIcon as Lightning,
  Battery,
  Wifi,
  Bluetooth,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AngryIcon as Surprised,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/components/profile-provider"

const iconOptions = [
  { name: "User", icon: User },
  { name: "Briefcase", icon: Briefcase },
  { name: "Heart", icon: Heart },
  { name: "Plane", icon: Plane },
  { name: "Settings", icon: Settings },
  { name: "Users", icon: Users },
  { name: "Home", icon: Home },
  { name: "Star", icon: Star },
  { name: "Target", icon: Target },
  { name: "Calendar", icon: Calendar },
  { name: "Clock", icon: Clock },
  { name: "Mail", icon: Mail },
  { name: "Phone", icon: Phone },
  { name: "Camera", icon: Camera },
  { name: "Music", icon: Music },
  { name: "Book", icon: Book },
  { name: "Coffee", icon: Coffee },
  { name: "Car", icon: Car },
  { name: "Bike", icon: Bike },
  { name: "Train", icon: Train },
  { name: "Ship", icon: Ship },
  { name: "Rocket", icon: Rocket },
  { name: "Globe", icon: Globe },
  { name: "Map", icon: Map },
  { name: "Compass", icon: Compass },
  { name: "Mountain", icon: Mountain },
  { name: "Sun", icon: Sun },
  { name: "Moon", icon: Moon },
  { name: "Cloud", icon: Cloud },
  { name: "Zap", icon: Zap },
  { name: "Fire", icon: Fire },
  { name: "Droplets", icon: Droplets },
  { name: "Leaf", icon: Leaf },
  { name: "Flower", icon: Flower },
  { name: "Tree", icon: Tree },
  { name: "Gem", icon: Gem },
  { name: "Shield", icon: Shield },
  { name: "Lock", icon: Lock },
  { name: "Key", icon: Key },
  { name: "Eye", icon: Eye },
  { name: "Bell", icon: Bell },
  { name: "Flag", icon: Flag },
  { name: "Tag", icon: Tag },
  { name: "Bookmark", icon: Bookmark },
  { name: "Archive", icon: Archive },
  { name: "Folder", icon: Folder },
  { name: "FileText", icon: FileText },
  { name: "Image", icon: Image },
  { name: "Video", icon: Video },
  { name: "Headphones", icon: Headphones },
  { name: "Mic", icon: Mic },
  { name: "Speaker", icon: Speaker },
  { name: "Monitor", icon: Monitor },
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop", icon: Laptop },
  { name: "Tablet", icon: Tablet },
  { name: "Watch", icon: Watch },
  { name: "Gamepad2", icon: Gamepad2 },
  { name: "Joystick", icon: Joystick },
  { name: "Dice1", icon: Dice1 },
  { name: "Puzzle", icon: Puzzle },
  { name: "Trophy", icon: Trophy },
  { name: "Award", icon: Award },
  { name: "Medal", icon: Medal },
  { name: "Crown", icon: Crown },
  { name: "Gift", icon: Gift },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "CreditCard", icon: CreditCard },
  { name: "DollarSign", icon: DollarSign },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "BarChart", icon: BarChart },
  { name: "PieChart", icon: PieChart },
  { name: "Activity", icon: Activity },
  { name: "Lightning", icon: Lightning },
  { name: "Battery", icon: Battery },
  { name: "Wifi", icon: Wifi },
  { name: "Bluetooth", icon: Bluetooth },
  { name: "Smile", icon: Smile },
  { name: "Frown", icon: Frown },
  { name: "Meh", icon: Meh },
  { name: "Laugh", icon: Laugh },
  { name: "Angry", icon: Angry },
  { name: "Surprised", icon: Surprised },
]

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-500", bgClass: "bg-blue-100", textClass: "text-blue-700" },
  { value: "green", label: "Green", class: "bg-green-500", bgClass: "bg-green-100", textClass: "text-green-700" },
  { value: "red", label: "Red", class: "bg-red-500", bgClass: "bg-red-100", textClass: "text-red-700" },
  { value: "purple", label: "Purple", class: "bg-purple-500", bgClass: "bg-purple-100", textClass: "text-purple-700" },
  { value: "orange", label: "Orange", class: "bg-orange-500", bgClass: "bg-orange-100", textClass: "text-orange-700" },
  { value: "pink", label: "Pink", class: "bg-pink-500", bgClass: "bg-pink-100", textClass: "text-pink-700" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500", bgClass: "bg-indigo-100", textClass: "text-indigo-700" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500", bgClass: "bg-yellow-100", textClass: "text-yellow-700" },
  { value: "teal", label: "Teal", class: "bg-teal-500", bgClass: "bg-teal-100", textClass: "text-teal-700" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500", bgClass: "bg-cyan-100", textClass: "text-cyan-700" },
]

export default function ProfilesPage() {
  const { activeProfile, setActiveProfile, profiles, addProfile, deleteProfile } = useProfile()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isIconDialogOpen, setIsIconDialogOpen] = useState(false)
  const { toast } = useToast()

  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    icon: "User",
    color: "blue",
    categories: "",
  })

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.name === iconName)
    return iconOption ? iconOption.icon : User
  }

  const getColorClasses = (color: string) => {
    const colorOption = colorOptions.find((opt) => opt.value === color)
    return colorOption
      ? {
          bg: colorOption.bgClass,
          text: colorOption.textClass,
          full: `${colorOption.bgClass} ${colorOption.textClass}`,
        }
      : {
          bg: "bg-blue-100",
          text: "text-blue-700",
          full: "bg-blue-100 text-blue-700",
        }
  }

  const handleProfileSwitch = (profileId: string) => {
    setActiveProfile(profileId)
    const profile = profiles.find((p) => p.id === profileId)
    toast({
      title: "Profile Switched",
      description: `Switched to ${profile?.name} profile.`,
    })
  }

  const createProfile = () => {
    if (!newProfile.name || !newProfile.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const colorClasses = getColorClasses(newProfile.color)
    const IconComponent = getIconComponent(newProfile.icon)

    const profile = {
      id: newProfile.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: newProfile.name,
      icon: IconComponent,
      color: colorClasses.full,
    }

    addProfile(profile)
    setNewProfile({
      name: "",
      description: "",
      icon: "User",
      color: "blue",
      categories: "",
    })
    setIsCreateDialogOpen(false)

    toast({
      title: "Profile Created",
      description: "Your new memory profile has been created successfully.",
    })
  }

  const handleDeleteProfile = (profileId: string) => {
    if (profiles.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one profile.",
        variant: "destructive",
      })
      return
    }

    deleteProfile(profileId)
    toast({
      title: "Profile Deleted",
      description: "Memory profile has been deleted.",
      variant: "destructive",
    })
  }

  const selectedIcon = iconOptions.find((icon) => icon.name === newProfile.icon)
  const SelectedIconComponent = selectedIcon ? selectedIcon.icon : User

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Memory Profiles</h1>
            <p className="text-gray-600">Organize your memories by context and switch between different profiles</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Memory Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Profile Name *</Label>
                    <Input
                      id="name"
                      value={newProfile.name}
                      onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                      placeholder="e.g., Work, Personal, Health"
                    />
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Dialog open={isIconDialogOpen} onOpenChange={setIsIconDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <SelectedIconComponent className="h-4 w-4 mr-2" />
                          {selectedIcon?.name || "Select Icon"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Choose an Icon</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-96">
                          <div className="grid grid-cols-8 gap-2 p-4">
                            {iconOptions.map((option) => {
                              const IconComponent = option.icon
                              const isSelected = newProfile.icon === option.name
                              return (
                                <button
                                  key={option.name}
                                  onClick={() => {
                                    setNewProfile({ ...newProfile, icon: option.name })
                                    setIsIconDialogOpen(false)
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all hover:bg-gray-50 flex flex-col items-center gap-1 ${
                                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <IconComponent className="h-6 w-6" />
                                  <span className="text-xs text-gray-600 text-center leading-tight">{option.name}</span>
                                </button>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newProfile.description}
                    onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                    placeholder="Describe what this profile will be used for..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Color Theme</Label>
                    <Select
                      value={newProfile.color}
                      onValueChange={(value) => setNewProfile({ ...newProfile, color: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${option.class}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="categories">Categories (comma-separated)</Label>
                    <Input
                      id="categories"
                      value={newProfile.categories}
                      onChange={(e) => setNewProfile({ ...newProfile, categories: e.target.value })}
                      placeholder="e.g., goals, preferences, tasks"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createProfile} className="bg-blue-600 hover:bg-blue-700">
                    Create Profile
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Profile Indicator */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const activeProfileData = profiles.find((p) => p.id === activeProfile)
                if (!activeProfileData) return null

                const IconComponent = activeProfileData.icon
                return (
                  <>
                    <div
                      className={`p-2 rounded-lg ${activeProfileData.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">Currently Active: {activeProfileData.name}</h3>
                      <p className="text-sm text-blue-700">{activeProfileData.memoryCount} memories stored</p>
                    </div>
                  </>
                )
              })()}
            </div>
            <Badge className="bg-blue-100 text-blue-800" variant="secondary">
              Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => {
          const IconComponent = profile.icon
          const isActive = profile.id === activeProfile

          return (
            <Card
              key={profile.id}
              className={`hover:shadow-md transition-all cursor-pointer group ${
                isActive ? "ring-2 ring-blue-500 shadow-md" : "hover:shadow-lg"
              }`}
              onClick={() => !isActive && handleProfileSwitch(profile.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${profile.color.replace("text-", "bg-").replace("-100", "-500")} text-white transition-transform group-hover:scale-105`}
                    >
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {profile.name}
                        {isActive && <Check className="h-4 w-4 text-blue-600" />}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{profile.memoryCount} memories</p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isActive && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleProfileSwitch(profile.id)
                          }}
                        >
                          Switch to Profile
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Duplicate Profile</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProfile(profile.id)
                        }}
                      >
                        Delete Profile
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    {isActive ? (
                      <Badge className="bg-blue-100 text-blue-800" variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Active Profile
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProfileSwitch(profile.id)
                        }}
                      >
                        Switch to Profile
                      </Button>
                    )}
                  </div>

                  {/* Memory Count */}
                  <div className="text-center pt-2 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-900">{profile.memoryCount}</div>
                    <div className="text-sm text-gray-500">Total Memories</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profiles created</h3>
          <p className="text-gray-600 mb-4">Create your first memory profile to organize your memories by context</p>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Profile
          </Button>
        </div>
      )}
    </div>
  )
}
