import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, SpinnerGap as Loader2, MagnifyingGlass as SearchIcon } from "@phosphor-icons/react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { ALL_SKILLS } from "@/data/skills";
import { cn } from "@/lib/utils";

const Settings = () => {
  const { profile, user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const filteredSkillsList = useMemo(() => {
    const search = newSkill.toLowerCase().trim();
    if (!search) {
      return ALL_SKILLS.filter(s => !skills.includes(s)).sort();
    }
    return ALL_SKILLS.filter(s =>
      s.toLowerCase().includes(search) && !skills.includes(s)
    ).sort();
  }, [newSkill, skills]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setSkills(profile.skills || []);
    }
  }, [profile?.id]); // Stable dependency to prevent state reset loop

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

  const handleAddSkill = () => {
    if (!newSkill.trim() || skills.includes(newSkill.trim())) return;
    setSkills(prev => [...prev, newSkill.trim()]);
    setNewSkill("");
  };

  const handleSaveSkills = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ skills: skills })
        .eq('id', user.id);

      if (error) throw error;
      await refreshProfile();
      toast.success("Skills updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update skills");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-background">
        <div className="page-container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 justify-center">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                      {fullName
                        ? fullName
                          .split(/\s+/)
                          .filter(Boolean)
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{fullName}</p>
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
                    <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="university">University</Label>
                    <Input id="university" value={profile?.company_name || ""} readOnly disabled className="bg-muted/50" />
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
                <CardContent className="space-y-6">
                  {/* Current Skills */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-4 rounded-xl bg-muted/30 border border-dashed border-border/60">
                    {skills.length === 0 ? (
                      <p className="text-sm text-muted-foreground w-full text-center py-2">No skills added yet.</p>
                    ) : (
                      skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm py-1.5 px-3 bg-foreground text-background hover:bg-foreground/90 transition-colors">
                          {skill}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveSkill(skill);
                            }}
                            className="ml-2 hover:text-red-400 focus:outline-none"
                            title={`Remove ${skill}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Find & Add Skills</Label>
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder="Search skills (e.g. React, Python, Marketing)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="pl-9 h-10 bg-muted/40 border-border/60 focus-visible:ring-0"
                      />
                      {newSkill && (
                        <button
                          type="button"
                          onClick={() => setNewSkill('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Filtered Skills List */}
                    <div className="h-64 overflow-y-auto rounded-xl border bg-muted/10 p-4 scrollbar-thin scrollbar-thumb-muted">
                      {newSkill.trim() && filteredSkillsList.length === 0 && !skills.includes(newSkill.trim()) ? (
                        <div className="w-full text-center py-8 space-y-3">
                          <p className="text-sm text-muted-foreground">No matching skills found.</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddSkill();
                            }}
                            className="h-8"
                          >
                            Add "{newSkill}" as a skill
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {filteredSkillsList.map((skill) => (
                            <button
                              key={skill}
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setSkills(prev => [...prev, skill]);
                                if (newSkill) setNewSkill("");
                              }}
                              className="rounded-full px-3 py-1.5 text-xs font-medium border bg-background border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all active:scale-95"
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleSaveSkills} disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Skills
                    </Button>
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
