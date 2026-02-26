import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const Settings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || []);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: bio
        })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!user || !newSkill.trim() || skills.includes(newSkill.trim())) return;

    const updatedSkills = [...skills, newSkill.trim()];
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('id', user.id);

      if (error) throw error;
      setSkills(updatedSkills);
      setNewSkill("");
    } catch (error: any) {
      toast.error(error.message || "Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!user) return;

    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: updatedSkills })
        .eq('id', user.id);

      if (error) throw error;
      setSkills(updatedSkills);
    } catch (error: any) {
      toast.error(error.message || "Failed to remove skill");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">

      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 justify-center">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your profile details and photo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                    <div className="h-16 w-16 flex items-center justify-center rounded-full bg-muted text-xl font-semibold uppercase">
                      {fullName.substring(0, 2) || "ST"}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{fullName || "Profile Display Name"}</p>
                      <p className="text-sm text-muted-foreground">This is how you appear to others on the platform.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ""} readOnly disabled className="bg-muted/50" />
                    <p className="text-[10px] text-muted-foreground">Email cannot be changed here.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input id="university" value="University of Manchester" readOnly disabled className="bg-muted/50" />
                    <p className="text-[10px] text-muted-foreground">University is verified and cannot be changed.</p>
                  </div>


                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell employers about yourself..."
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle>Your Skills</CardTitle>
                  <CardDescription>
                    Add skills to showcase your abilities to employers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button onClick={handleAddSkill}>Add</Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm py-2 px-3">
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your applications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Project Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when new projects match your profile
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Application Updates</p>
                      <p className="text-sm text-muted-foreground">
                        Updates on your application status
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">
                        Notifications for new messages from employers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>

                    <Button>Update Password</Button>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
