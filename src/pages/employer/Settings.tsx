import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Gear as SettingsIcon, SpinnerGap as Loader2 } from "@phosphor-icons/react"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function EmployerSettings() {
  const { profile, user, refreshProfile } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.company_name || '')
      setFullName(profile.full_name || '')
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
          full_name: fullName,
          bio: bio
        })
        .eq('id', user.id)

      if (error) throw error
      await refreshProfile()
      toast({
        title: 'Settings saved',
        description: 'Your employer settings have been updated.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
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
        <p className="text-gray-600">Manage your employer account and preferences</p>
      </div>

      {/* Account Information */}
      <Card className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Account Information</h2>
        </div>

        <div className="grid gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input
                id="fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              readOnly
              disabled
              className="bg-muted/50"
            />
            <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Company Bio / Mission</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your company..."
              rows={4}
            />
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => refreshProfile()}>Reset</Button>
      </div>
    </div>
  )
}
