import { useAuth } from '@/contexts/AuthContext'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Settings as SettingsIcon } from 'lucide-react'

export default function EmployerSettings() {
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your employer settings have been updated.',
    })
  }

  return (
    <div className="space-y-6 p-6">
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={profile?.company_name || ''}
              readOnly
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

          <div>
            <Label htmlFor="fullname">Contact Person</Label>
            <Input
              id="fullname"
              value={profile?.full_name || ''}
              readOnly
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Email Notifications</Label>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Application Updates</Label>
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
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  )
}
