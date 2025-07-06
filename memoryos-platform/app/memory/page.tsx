"use client"

import { useState, type KeyboardEvent } from "react"
import { Brain, Star, Lightbulb, FileText, Book, Calendar, Filter, Plus, X, Edit, ArrowRight, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/components/profile-provider"

interface MemoryItem {
  id: string
  type: "goal" | "preference" | "fact" | "note" | "document"
  title: string
  description: string
  tags: Array<{
    label: string
    color: string
  }>
  createdAt: string
  relevance: "low" | "medium" | "high"
  isPrivate: boolean
  icon: any
  profileId: string
}

const profileMemories: Record<string, MemoryItem[]> = {
  personal: [
    {
      id: "1",
      type: "goal",
      title: "Read Atomic Habits",
      description: 'Complete reading "Atomic Habits" by James Clear. Focus on implementing the 1% better principle.',
      tags: [
        { label: "goal", color: "bg-green-100 text-green-700" },
        { label: "medium", color: "bg-yellow-100 text-yellow-700" },
        { label: "books", color: "bg-gray-100 text-gray-700" },
        { label: "self-improvement", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "20/01/2024",
      relevance: "medium",
      isPrivate: false,
      icon: Brain,
      profileId: "personal",
    },
    {
      id: "2",
      type: "preference",
      title: "Communication Style",
      description: "I prefer casual, conversational tone in emails and messages. Avoid overly formal language.",
      tags: [
        { label: "preference", color: "bg-purple-100 text-purple-700" },
        { label: "high", color: "bg-red-100 text-red-700" },
        { label: "communication", color: "bg-gray-100 text-gray-700" },
        { label: "style", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "15/01/2024",
      relevance: "high",
      isPrivate: false,
      icon: Star,
      profileId: "personal",
    },
    {
      id: "3",
      type: "preference",
      title: "Workout Schedule",
      description: "I prefer evening workouts after 6 PM. Mornings are better for focused work.",
      tags: [
        { label: "preference", color: "bg-purple-100 text-purple-700" },
        { label: "medium", color: "bg-yellow-100 text-yellow-700" },
        { label: "fitness", color: "bg-gray-100 text-gray-700" },
        { label: "schedule", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "15/01/2024",
      relevance: "medium",
      isPrivate: false,
      icon: Star,
      profileId: "personal",
    },
  ],
  work: [
    {
      id: "4",
      type: "goal",
      title: "Complete Q1 Project",
      description:
        "Finish the new feature development and testing by end of Q1. Focus on user experience improvements.",
      tags: [
        { label: "goal", color: "bg-green-100 text-green-700" },
        { label: "high", color: "bg-red-100 text-red-700" },
        { label: "project", color: "bg-gray-100 text-gray-700" },
        { label: "development", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "18/01/2024",
      relevance: "high",
      isPrivate: false,
      icon: Brain,
      profileId: "work",
    },
    {
      id: "5",
      type: "fact",
      title: "Team Meeting Schedule",
      description: "Weekly team meetings are held every Tuesday at 10 AM. Monthly all-hands on first Friday.",
      tags: [
        { label: "fact", color: "bg-blue-100 text-blue-700" },
        { label: "low", color: "bg-gray-100 text-gray-700" },
        { label: "meetings", color: "bg-gray-100 text-gray-700" },
        { label: "schedule", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "16/01/2024",
      relevance: "low",
      isPrivate: false,
      icon: Lightbulb,
      profileId: "work",
    },
    {
      id: "6",
      type: "note",
      title: "Code Review Guidelines",
      description:
        "Always check for security vulnerabilities, performance implications, and code readability. Use descriptive commit messages.",
      tags: [
        { label: "note", color: "bg-gray-100 text-gray-700" },
        { label: "medium", color: "bg-yellow-100 text-yellow-700" },
        { label: "development", color: "bg-gray-100 text-gray-700" },
        { label: "guidelines", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "14/01/2024",
      relevance: "medium",
      isPrivate: false,
      icon: FileText,
      profileId: "work",
    },
  ],
  health: [
    {
      id: "7",
      type: "goal",
      title: "Daily Exercise Routine",
      description: "Maintain a consistent daily exercise routine with 30 minutes of cardio and strength training.",
      tags: [
        { label: "goal", color: "bg-green-100 text-green-700" },
        { label: "high", color: "bg-red-100 text-red-700" },
        { label: "fitness", color: "bg-gray-100 text-gray-700" },
        { label: "health", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "17/01/2024",
      relevance: "high",
      isPrivate: false,
      icon: Brain,
      profileId: "health",
    },
    {
      id: "8",
      type: "fact",
      title: "Dietary Restrictions",
      description: "Lactose intolerant and prefer plant-based meals. Avoid dairy products and processed foods.",
      tags: [
        { label: "fact", color: "bg-blue-100 text-blue-700" },
        { label: "high", color: "bg-red-100 text-red-700" },
        { label: "diet", color: "bg-gray-100 text-gray-700" },
        { label: "health", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "12/01/2024",
      relevance: "high",
      isPrivate: true,
      icon: Lightbulb,
      profileId: "health",
    },
  ],
  travel: [
    {
      id: "9",
      type: "preference",
      title: "Travel Preferences",
      description: "Prefer aisle seats on flights, hotels with good WiFi, and destinations with rich cultural history.",
      tags: [
        { label: "preference", color: "bg-purple-100 text-purple-700" },
        { label: "medium", color: "bg-yellow-100 text-yellow-700" },
        { label: "travel", color: "bg-gray-100 text-gray-700" },
        { label: "planning", color: "bg-gray-100 text-gray-700" },
      ],
      createdAt: "19/01/2024",
      relevance: "medium",
      isPrivate: false,
      icon: Star,
      profileId: "travel",
    },
  ],
}

const memoryTypeConfig = {
  goal: {
    icon: Brain,
    color: "bg-green-100",
    iconColor: "text-green-600",
    tagColor: "bg-green-100 text-green-700",
    borderColor: "border-green-200",
    label: "Goal",
    description: "Something you want to achieve",
  },
  preference: {
    icon: Star,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    tagColor: "bg-purple-100 text-purple-700",
    borderColor: "border-purple-200",
    label: "Preference",
    description: "Your personal preferences and style",
  },
  fact: {
    icon: Lightbulb,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    tagColor: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-200",
    label: "Fact",
    description: "Important information to remember",
  },
  note: {
    icon: FileText,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
    tagColor: "bg-gray-100 text-gray-700",
    borderColor: "border-gray-200",
    label: "Note",
    description: "General notes and observations",
  },
  document: {
    icon: Book,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    tagColor: "bg-indigo-100 text-indigo-700",
    borderColor: "border-indigo-200",
    label: "Document",
    description: "Reference documents and files",
  },
}

const relevanceConfig = {
  low: {
    color: "bg-gray-100 text-gray-700",
    label: "Low",
    dotColor: "bg-gray-400",
    borderColor: "border-gray-200",
    description: "Nice to know, but not critical",
  },
  medium: {
    color: "bg-yellow-100 text-yellow-700",
    label: "Medium",
    dotColor: "bg-yellow-400",
    borderColor: "border-yellow-200",
    description: "Important for context and decisions",
  },
  high: {
    color: "bg-red-100 text-red-700",
    label: "High",
    dotColor: "bg-red-400",
    borderColor: "border-red-200",
    description: "Critical information for AI interactions",
  },
}

// Predefined tag colors for common tags
const tagColorMap: Record<string, string> = {
  // Categories
  communication: "bg-blue-100 text-blue-700",
  work: "bg-green-100 text-green-700",
  personal: "bg-purple-100 text-purple-700",
  health: "bg-red-100 text-red-700",
  fitness: "bg-orange-100 text-orange-700",
  travel: "bg-indigo-100 text-indigo-700",
  finance: "bg-emerald-100 text-emerald-700",
  learning: "bg-cyan-100 text-cyan-700",

  // Activities
  reading: "bg-amber-100 text-amber-700",
  exercise: "bg-orange-100 text-orange-700",
  meeting: "bg-slate-100 text-slate-700",
  project: "bg-teal-100 text-teal-700",

  // Attributes
  important: "bg-red-100 text-red-700",
  urgent: "bg-orange-100 text-orange-700",
  routine: "bg-gray-100 text-gray-700",
  goal: "bg-green-100 text-green-700",
  habit: "bg-blue-100 text-blue-700",
}

const getTagColor = (tag: string): string => {
  const lowerTag = tag.toLowerCase().trim()
  return tagColorMap[lowerTag] || "bg-gray-100 text-gray-700"
}

interface FormData {
  type: MemoryItem["type"]
  title: string
  description: string
  tags: Array<{ label: string; color: string }>
  relevance: MemoryItem["relevance"]
  isPrivate: boolean
  profileId: string
}

interface FormErrors {
  title?: string
  description?: string
  tags?: string
}

// Custom Tag Input Component
function TagInput({
  tags,
  onTagsChange,
  placeholder = "Type a tag and press Enter...",
}: {
  tags: Array<{ label: string; color: string }>
  onTagsChange: (tags: Array<{ label: string; color: string }>) => void
  placeholder?: string
}) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()

      // Check if tag already exists
      if (!tags.some((tag) => tag.label.toLowerCase() === newTag.toLowerCase())) {
        const newTagObj = {
          label: newTag,
          color: getTagColor(newTag),
        }
        onTagsChange([...tags, newTagObj])
      }
      setInputValue("")
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty and backspace is pressed
      onTagsChange(tags.slice(0, -1))
    }
  }

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-3 border border-gray-200 rounded-md bg-white">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            className={`${tag.color} border-0 text-xs font-medium px-2 py-1 flex items-center gap-1`}
            variant="secondary"
          >
            {tag.label}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 hover:bg-black/10 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="border-0 shadow-none focus-visible:ring-0 flex-1 min-w-[120px] h-6 p-0"
        />
      </div>
      <p className="text-xs text-gray-500">
        Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to add tags.{" "}
        <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Backspace</kbd> to remove.
      </p>
    </div>
  )
}

export default function MemoryPage() {
  const { activeProfile, setActiveProfile, profiles, getActiveProfileName } = useProfile()
  const [memoryData, setMemoryData] = useState<Record<string, MemoryItem[]>>(profileMemories)
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMemory, setEditingMemory] = useState<MemoryItem | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<FormData>({
    type: "goal",
    title: "",
    description: "",
    tags: [],
    relevance: "medium",
    isPrivate: false,
    profileId: activeProfile,
  })

  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get current profile memories
  const currentMemories = memoryData[activeProfile] || []

  // Validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    if (!formData.title.trim()) {
      errors.title = "Title is required"
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters"
    } else if (formData.title.trim().length > 100) {
      errors.title = "Title must be less than 100 characters"
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters"
    } else if (formData.description.trim().length > 500) {
      errors.description = "Description must be less than 500 characters"
    }

    if (formData.tags.length > 10) {
      errors.tags = "Maximum 10 tags allowed"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Add type and relevance tags
      const typeConfig = memoryTypeConfig[formData.type]
      const relevanceConfigItem = relevanceConfig[formData.relevance]

      const allTags = [
        { label: typeConfig.label.toLowerCase(), color: typeConfig.tagColor },
        { label: formData.relevance, color: relevanceConfigItem.color },
        ...formData.tags,
      ]

      if (editingMemory) {
        // Update existing memory
        const updatedMemory: MemoryItem = {
          ...editingMemory,
          type: formData.type,
          title: formData.title.trim(),
          description: formData.description.trim(),
          tags: allTags,
          relevance: formData.relevance,
          isPrivate: formData.isPrivate,
          icon: typeConfig.icon,
          profileId: formData.profileId,
        }

        // Remove from old profile and add to new profile
        setMemoryData((prev) => {
          const newData = { ...prev }

          // Remove from old profile
          if (newData[editingMemory.profileId]) {
            newData[editingMemory.profileId] = newData[editingMemory.profileId].filter((m) => m.id !== editingMemory.id)
          }

          // Add to new profile
          if (!newData[formData.profileId]) {
            newData[formData.profileId] = []
          }
          newData[formData.profileId] = [updatedMemory, ...newData[formData.profileId]]

          return newData
        })

        toast({
          title: "Memory Updated",
          description: `Memory has been updated${
            editingMemory.profileId !== formData.profileId
              ? ` and moved to ${profiles.find((p) => p.id === formData.profileId)?.name} profile`
              : ""
          }.`,
        })
      } else {
        // Create new memory
        const newMemory: MemoryItem = {
          id: Date.now().toString(),
          type: formData.type,
          title: formData.title.trim(),
          description: formData.description.trim(),
          tags: allTags,
          createdAt: new Date().toLocaleDateString("en-GB"),
          relevance: formData.relevance,
          isPrivate: formData.isPrivate,
          icon: typeConfig.icon,
          profileId: formData.profileId,
        }

        setMemoryData((prev) => ({
          ...prev,
          [formData.profileId]: [newMemory, ...(prev[formData.profileId] || [])],
        }))

        toast({
          title: "Memory Created",
          description: `Your ${formData.type} has been successfully added to your ${
            profiles.find((p) => p.id === formData.profileId)?.name
          } profile.`,
        })
      }

      // Reset form
      setFormData({
        type: "goal",
        title: "",
        description: "",
        tags: [],
        relevance: "medium",
        isPrivate: false,
        profileId: activeProfile,
      })

      setFormErrors({})
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)
      setEditingMemory(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save memory. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form field changes
  const handleFieldChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear specific field error when user starts typing
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Handle edit memory
  const handleEditMemory = (memory: MemoryItem) => {
    setEditingMemory(memory)
    setFormData({
      type: memory.type,
      title: memory.title,
      description: memory.description,
      tags: memory.tags.filter(
        (tag) => !["goal", "preference", "fact", "note", "document", "low", "medium", "high"].includes(tag.label),
      ),
      relevance: memory.relevance,
      isPrivate: memory.isPrivate,
      profileId: memory.profileId,
    })
    setIsEditDialogOpen(true)
  }

  // Handle copy memory to another profile
  const handleCopyMemory = (memory: MemoryItem, targetProfileId: string) => {
    const copiedMemory: MemoryItem = {
      ...memory,
      id: Date.now().toString(),
      profileId: targetProfileId,
      createdAt: new Date().toLocaleDateString("en-GB"),
    }

    setMemoryData((prev) => ({
      ...prev,
      [targetProfileId]: [copiedMemory, ...(prev[targetProfileId] || [])],
    }))

    const targetProfile = profiles.find((p) => p.id === targetProfileId)
    toast({
      title: "Memory Copied",
      description: `Memory has been copied to ${targetProfile?.name} profile.`,
    })
  }

  // Filter memories
  const filteredMemories = currentMemories.filter((item) => {
    if (filterType === "all") return true
    return item.type === filterType
  })

  // Sort memories
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    switch (sortBy) {
      case "updated":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "created":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "title":
        return a.title.localeCompare(b.title)
      case "relevance":
        const relevanceOrder = { high: 3, medium: 2, low: 1 }
        return relevanceOrder[b.relevance] - relevanceOrder[a.relevance]
      default:
        return 0
    }
  })

  const selectedTypeConfig = memoryTypeConfig[formData.type]
  const selectedRelevanceConfig = relevanceConfig[formData.relevance]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Memory Vault</h1>
            <p className="text-gray-600">
              {currentMemories.length} items in {getActiveProfileName().toLowerCase()} profile
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Memory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Memory</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profile Selection */}
                <div>
                  <Label className="text-sm font-medium">Add to Profile</Label>
                  <Select value={formData.profileId} onValueChange={(value) => handleFieldChange("profileId", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const selectedProfile = profiles.find((p) => p.id === formData.profileId)
                          if (!selectedProfile) return null
                          const IconComponent = selectedProfile.icon
                          return (
                            <>
                              <div
                                className={`p-2 rounded-lg ${selectedProfile.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{selectedProfile.name}</span>
                            </>
                          )
                        })()}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => {
                        const IconComponent = profile.icon
                        return (
                          <SelectItem key={profile.id} value={profile.id} className="h-12">
                            <div className="flex items-center gap-3 w-full">
                              <div
                                className={`p-2 rounded-lg ${profile.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{profile.name}</div>
                                <div className="text-xs text-gray-500">{profile.memoryCount} memories</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Memory Type */}
                <div>
                  <Label className="text-sm font-medium">Memory Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedTypeConfig.color}`}>
                          <selectedTypeConfig.icon className={`h-4 w-4 ${selectedTypeConfig.iconColor}`} />
                        </div>
                        <span className="font-medium">{selectedTypeConfig.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(memoryTypeConfig).map(([key, config]) => {
                        const Icon = config.icon
                        return (
                          <SelectItem key={key} value={key} className="h-12">
                            <div className="flex items-center gap-3 w-full">
                              <div className={`p-2 rounded-lg ${config.color}`}>
                                <Icon className={`h-4 w-4 ${config.iconColor}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{config.label}</div>
                                <div className="text-xs text-gray-500">{config.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label className="text-sm font-medium">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Enter a clear, descriptive title..."
                    className={`mt-1 ${formErrors.title ? "border-red-500" : ""}`}
                  />
                  {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Provide detailed information about this memory..."
                    rows={4}
                    className={`mt-1 ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                </div>

                {/* Relevance */}
                <div>
                  <Label className="text-sm font-medium">Relevance</Label>
                  <Select value={formData.relevance} onValueChange={(value) => handleFieldChange("relevance", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${selectedRelevanceConfig.dotColor}`} />
                        <span className="font-medium">{selectedRelevanceConfig.label} Relevance</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(relevanceConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key} className="h-12">
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-4 h-4 rounded-full ${config.dotColor}`} />
                            <div className="flex-1">
                              <div className="font-medium">{config.label} Relevance</div>
                              <div className="text-xs text-gray-500">{config.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-1">
                    <TagInput
                      tags={formData.tags}
                      onTagsChange={(tags) => handleFieldChange("tags", tags)}
                      placeholder="Type a tag and press Enter..."
                    />
                  </div>
                  {formErrors.tags && <p className="text-sm text-red-600 mt-1">{formErrors.tags}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Common tags get auto-colored! Try: work, personal, health, communication, important
                  </p>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Private Memory</Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Private memories require additional authentication to view
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => handleFieldChange("isPrivate", checked)}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setFormData({
                        type: "goal",
                        title: "",
                        description: "",
                        tags: [],
                        relevance: "medium",
                        isPrivate: false,
                        profileId: activeProfile,
                      })
                      setFormErrors({})
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Memory"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Memory</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Profile Selection */}
                <div>
                  <Label className="text-sm font-medium">Move to Profile</Label>
                  <Select value={formData.profileId} onValueChange={(value) => handleFieldChange("profileId", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const selectedProfile = profiles.find((p) => p.id === formData.profileId)
                          if (!selectedProfile) return null
                          const IconComponent = selectedProfile.icon
                          return (
                            <>
                              <div
                                className={`p-2 rounded-lg ${selectedProfile.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{selectedProfile.name}</span>
                            </>
                          )
                        })()}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map((profile) => {
                        const IconComponent = profile.icon
                        return (
                          <SelectItem key={profile.id} value={profile.id} className="h-12">
                            <div className="flex items-center gap-3 w-full">
                              <div
                                className={`p-2 rounded-lg ${profile.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                              >
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{profile.name}</div>
                                <div className="text-xs text-gray-500">{profile.memoryCount} memories</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Memory Type */}
                <div>
                  <Label className="text-sm font-medium">Memory Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleFieldChange("type", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${selectedTypeConfig.color}`}>
                          <selectedTypeConfig.icon className={`h-4 w-4 ${selectedTypeConfig.iconColor}`} />
                        </div>
                        <span className="font-medium">{selectedTypeConfig.label}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(memoryTypeConfig).map(([key, config]) => {
                        const Icon = config.icon
                        return (
                          <SelectItem key={key} value={key} className="h-12">
                            <div className="flex items-center gap-3 w-full">
                              <div className={`p-2 rounded-lg ${config.color}`}>
                                <Icon className={`h-4 w-4 ${config.iconColor}`} />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">{config.label}</div>
                                <div className="text-xs text-gray-500">{config.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label className="text-sm font-medium">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    placeholder="Enter a clear, descriptive title..."
                    className={`mt-1 ${formErrors.title ? "border-red-500" : ""}`}
                  />
                  {formErrors.title && <p className="text-sm text-red-600 mt-1">{formErrors.title}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleFieldChange("description", e.target.value)}
                    placeholder="Provide detailed information about this memory..."
                    rows={4}
                    className={`mt-1 ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                </div>

                {/* Relevance */}
                <div>
                  <Label className="text-sm font-medium">Relevance</Label>
                  <Select value={formData.relevance} onValueChange={(value) => handleFieldChange("relevance", value)}>
                    <SelectTrigger className="mt-1 h-12">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${selectedRelevanceConfig.dotColor}`} />
                        <span className="font-medium">{selectedRelevanceConfig.label} Relevance</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(relevanceConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key} className="h-12">
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-4 h-4 rounded-full ${config.dotColor}`} />
                            <div className="flex-1">
                              <div className="font-medium">{config.label} Relevance</div>
                              <div className="text-xs text-gray-500">{config.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags */}
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-1">
                    <TagInput
                      tags={formData.tags}
                      onTagsChange={(tags) => handleFieldChange("tags", tags)}
                      placeholder="Type a tag and press Enter..."
                    />
                  </div>
                  {formErrors.tags && <p className="text-sm text-red-600 mt-1">{formErrors.tags}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Common tags get auto-colored! Try: work, personal, health, communication, important
                  </p>
                </div>

                {/* Privacy Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">Private Memory</Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Private memories require additional authentication to view
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPrivate}
                    onCheckedChange={(checked) => handleFieldChange("isPrivate", checked)}
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditingMemory(null)
                      setFormData({
                        type: "goal",
                        title: "",
                        description: "",
                        tags: [],
                        relevance: "medium",
                        isPrivate: false,
                        profileId: activeProfile,
                      })
                      setFormErrors({})
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Filter:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 h-8 text-sm">
                {filterType === "all" ? (
                  <SelectValue />
                ) : (
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded ${memoryTypeConfig[filterType as keyof typeof memoryTypeConfig]?.color}`}
                    >
                      {(() => {
                        const Icon = memoryTypeConfig[filterType as keyof typeof memoryTypeConfig]?.icon
                        return Icon ? (
                          <Icon
                            className={`h-3 w-3 ${memoryTypeConfig[filterType as keyof typeof memoryTypeConfig]?.iconColor}`}
                          />
                        ) : null
                      })()}
                    </div>
                    <span>{memoryTypeConfig[filterType as keyof typeof memoryTypeConfig]?.label || filterType}</span>
                  </div>
                )}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(memoryTypeConfig).map(([key, config]) => {
                  const Icon = config.icon
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${config.color}`}>
                          <Icon className={`h-3 w-3 ${config.iconColor}`} />
                        </div>
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="relevance">Relevance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Memory Items */}
      <div className="space-y-4">
        {sortedMemories.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${memoryTypeConfig[item.type].color}`}
                >
                  <Icon className={`w-5 h-5 ${memoryTypeConfig[item.type].iconColor}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.isPrivate && (
                        <Badge variant="outline" className="text-xs">
                          Private
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleEditMemory(item)} className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <div className="px-2 py-1 text-xs font-medium text-gray-500">Copy to Profile</div>
                          {profiles
                            .filter((p) => p.id !== item.profileId)
                            .map((profile) => {
                              const IconComponent = profile.icon
                              return (
                                <DropdownMenuItem key={profile.id} onClick={() => handleCopyMemory(item, profile.id)}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`p-1 rounded ${profile.color.replace("text-", "bg-").replace("-100", "-500")} text-white`}
                                    >
                                      <IconComponent className="h-3 w-3" />
                                    </div>
                                    <span>{profile.name}</span>
                                    <ArrowRight className="h-3 w-3 ml-auto" />
                                  </div>
                                </DropdownMenuItem>
                              )
                            })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">{item.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className={`${tag.color} border-0 text-xs font-medium px-2 py-1`}
                        variant="secondary"
                      >
                        {tag.label}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sortedMemories.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No memories found</h3>
          <p className="text-gray-600 mb-4">
            {filterType !== "all"
              ? `No ${filterType}s found in your ${getActiveProfileName().toLowerCase()} profile. Try changing your filter.`
              : `Start building your ${getActiveProfileName().toLowerCase()} memory vault by adding your first memory.`}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Memory
          </Button>
        </div>
      )}
    </div>
  )
}
