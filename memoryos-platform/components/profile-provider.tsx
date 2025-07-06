"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { AppLayout } from "./app-layout"
import { User, Briefcase, Heart, Plane } from "lucide-react"

interface Profile {
  id: string
  name: string
  icon: any
  color: string
  memoryCount: number
}

interface ProfileContextType {
  activeProfile: string
  setActiveProfile: (profileId: string) => void
  profiles: Profile[]
  addProfile: (profile: Omit<Profile, "memoryCount">) => void
  deleteProfile: (profileId: string) => void
  getActiveProfileName: () => string
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfile] = useState("personal")
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: "personal",
      name: "Personal",
      icon: User,
      color: "bg-blue-100 text-blue-700",
      memoryCount: 3,
    },
    {
      id: "work",
      name: "Work",
      icon: Briefcase,
      color: "bg-green-100 text-green-700",
      memoryCount: 5,
    },
    {
      id: "health",
      name: "Health",
      icon: Heart,
      color: "bg-red-100 text-red-700",
      memoryCount: 2,
    },
    {
      id: "travel",
      name: "Travel",
      icon: Plane,
      color: "bg-purple-100 text-purple-700",
      memoryCount: 1,
    },
  ])

  const addProfile = (newProfile: Omit<Profile, "memoryCount">) => {
    const profileWithCount = { ...newProfile, memoryCount: 0 }
    setProfiles((prev) => [...prev, profileWithCount])
  }

  const deleteProfile = (profileId: string) => {
    if (profiles.length <= 1) return // Don't delete if it's the last profile

    setProfiles((prev) => prev.filter((p) => p.id !== profileId))

    // If deleting active profile, switch to first remaining profile
    if (activeProfile === profileId) {
      const remainingProfiles = profiles.filter((p) => p.id !== profileId)
      if (remainingProfiles.length > 0) {
        setActiveProfile(remainingProfiles[0].id)
      }
    }
  }

  const getActiveProfileName = () => {
    const profile = profiles.find((p) => p.id === activeProfile)
    return profile?.name || "Personal"
  }

  const contextValue: ProfileContextType = {
    activeProfile,
    setActiveProfile,
    profiles,
    addProfile,
    deleteProfile,
    getActiveProfileName,
  }

  return (
    <ProfileContext.Provider value={contextValue}>
      <AppLayout
        activeProfile={activeProfile}
        onProfileChange={setActiveProfile}
        profiles={profiles.map((p) => ({ ...p, active: p.id === activeProfile }))}
      >
        {children}
      </AppLayout>
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
