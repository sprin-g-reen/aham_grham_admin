"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User } from "lucide-react"
import { useAuth } from "@/lib/AuthContext"
import { toast } from "sonner"
import axios from "axios"
import { API_URL } from "@/config"

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSaveProfile = async () => {
    if (!name || !email) {
      toast.error("Name and Email are required")
      return
    }

    try {
      setIsUpdating(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
      
      const { data } = await axios.put(`${API_URL}/admins/profile`, { name, email }, config)
      
      updateUser({ name: data.name, email: data.email })
      toast.success("Profile updated successfully")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateSecurity = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    try {
      setIsUpdating(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
      
      await axios.put(`${API_URL}/admins/password`, { 
        oldPassword: currentPassword, 
        newPassword 
      }, config)
      
      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex justify-center pb-10">
      <Card className="w-full max-w-4xl p-8">

        <h2 className="text-xl font-semibold mb-6">
          Edit Profile
        </h2>

        <Tabs defaultValue="profile" className="w-full">

          {/* Tabs Header */}
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* ================= PROFILE TAB ================= */}
          <TabsContent value="profile" className="space-y-6">

            <div className="flex items-center gap-6 flex-wrap">
              <div className="w-28 h-28 rounded-full shadow-md bg-muted flex items-center justify-center">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <Button variant="outline" className="rounded-full px-6">
                  Upload new image
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  1200x1200 px • PNG or JPG
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>

            <Button 
              className="rounded-full px-8 h-11" 
              onClick={handleSaveProfile}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>

          </TabsContent>

          {/* ================= SECURITY TAB ================= */}
          <TabsContent value="security" className="space-y-6">

            <div className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div>
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input 
                  type="password" 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border rounded-xl p-4">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">
                  Add extra security to your account
                </p>
              </div>
              <Switch />
            </div>

            <Button 
              className="rounded-full px-8 h-11" 
              onClick={handleUpdateSecurity}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Security"}
            </Button>

          </TabsContent>

        </Tabs>
      </Card>
    </div>
  )
}
