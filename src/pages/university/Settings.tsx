import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
            <div className="flex items-center gap-3">
              <Label>Activity Notifications</Label>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-transparent text-[10px] uppercase tracking-wider font-semibold">Coming in V2</Badge>
            </div>
            <Switch disabled checked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Student Milestone Alerts</Label>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-transparent text-[10px] uppercase tracking-wider font-semibold">Coming in V2</Badge>
            </div>
            <Switch disabled checked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label>Credential Issuance Reports</Label>
              <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-100 border-transparent text-[10px] uppercase tracking-wider font-semibold">Coming in V2</Badge>
            </div>
            <Switch disabled checked={true} />
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
