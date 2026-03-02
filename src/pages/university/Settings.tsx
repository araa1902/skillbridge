import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Gear as SettingsIcon } from "@phosphor-icons/react"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function UniversitySettings() {
  const { profile, user, refreshProfile } = useAuth()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || profile.full_name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: companyName,
          bio: bio,
        })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      toast({
        title: 'Settings saved',
        description: 'Your university profile has been updated.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save settings',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your university account and preferences</p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">University Name</Label>
            <Input
              id="name"
              placeholder="e.g. University of Bath"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Public Description (Bio)</Label>
            <Textarea
              id="bio"
              placeholder="Tell students about your institution..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              readOnly
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Platform Settings */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Platform Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Activity Notifications</Label>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Student Milestone Alerts</Label>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Credential Issuance Reports</Label>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
