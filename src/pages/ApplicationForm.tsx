import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { projects } from "@/lib/data";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Project not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to application status page
    navigate(`/project/${id}/application-status`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Apply for Project</h1>
            <p className="text-muted-foreground">{project.title}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="statement">Statement of Interest</Label>
                  <Textarea
                    id="statement"
                    placeholder="Tell us why you're interested in this project and what makes you a good fit..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Maximum 500 words</p>
                </div>

                <div className="space-y-2">
                  <Label>Portfolio / CV Upload</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-accent transition-smooth cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX (max 5MB)
                    </p>
                    <Input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">Relevant Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      id="skills"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill}>Add</Button>
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm">
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Input id="availability" type="date" required />
                  <p className="text-xs text-muted-foreground">
                    When can you start this project?
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Application
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApplicationForm;
