import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X, FileText, CheckCircle, Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { insertApplication } from "@/hooks/useApplications";
import { supabase } from "@/lib/supabase";

// ─── Minimal project shape we need from DB ───────────────────────────────────

interface ProjectPreview {
  id: string;
  title: string;
  status: string;
  required_skills: string[];
  duration_hours: number | null;
  budget: number | null;
  profiles: { full_name: string | null; company_name: string | null } | null;
}

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // ── Project fetch ──────────────────────────────────────────────────────────
  const [project, setProject] = useState<ProjectPreview | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  const loadProject = useCallback(async () => {
    if (!id) return;
    setProjectLoading(true);

    // Check if project exists
    const { data, error } = await supabase
      .from("projects")
      .select(`
        id,
        title,
        status,
        required_skills,
        duration_hours,
        budget,
        profiles!projects_business_id_fkey ( full_name, company_name )
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      setProjectError(error?.message ?? "Project not found");
      setProjectLoading(false);
      return;
    }

    const projectData = data as any;
    if (projectData.status !== "open") {
      setProjectError("This project is no longer accepting applications.");
      setProjectLoading(false);
      return;
    }

    setProject(projectData as ProjectPreview);

    // Check if current user has already applied
    if (user?.id) {
      const { data: existingApp, error: appError } = await supabase
        .from("applications")
        .select("id")
        .eq("project_id", id)
        .eq("student_id", user.id)
        .maybeSingle();

      if (existingApp) {
        setHasApplied(true);
      }
    }

    setProjectLoading(false);
  }, [id, user?.id]);

  useEffect(() => { loadProject(); }, [loadProject]);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [statementValue, setStatementValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availability, setAvailability] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-populate skills from project when loaded
  useEffect(() => {
    if (project?.required_skills) {
      setSelectedSkills(project.required_skills);
    }
  }, [project]);

  // ── Skill helpers ──────────────────────────────────────────────────────────
  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  // ── File helpers ───────────────────────────────────────────────────────────
  const processFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024;
      if (!validTypes.includes(file.type)) {
        toast({ title: "Invalid file type", description: `${file.name} — only PDF, DOCX, JPG, PNG allowed.`, variant: "destructive" });
        return false;
      }
      if (file.size > maxSize) {
        toast({ title: "File too large", description: `${file.name} exceeds 10 MB.`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(Array.from(e.target.files ?? []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      toast({ title: "Confirmation required", description: "Please confirm that the information is accurate.", variant: "destructive" });
      return;
    }
    if (!statementValue.trim()) {
      toast({ title: "Statement required", description: "Please write a cover letter.", variant: "destructive" });
      return;
    }
    if (!user?.id || !id) {
      toast({ title: "Not authenticated", description: "Please sign in to apply.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const { error } = await insertApplication({
      project_id: id,
      student_id: user.id,
      cover_letter: statementValue.trim(),
    });
    setIsSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error, variant: "destructive" });
    } else {
      setShowSuccessModal(true);
    }
  };

  const isFormValid = statementValue.trim().length > 0 && selectedSkills.length > 0 && availability && confirmed;

  // ── Loading / error states ─────────────────────────────────────────────────
  if (projectLoading) {
    return (
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
          <Skeleton className="h-28 rounded-lg" />
          <Skeleton className="h-[520px] rounded-lg" />
        </div>
      </main>
    );
  }

  if (projectError || !project) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Project not found</p>
          <p className="text-sm text-muted-foreground">{projectError}</p>
          <Button variant="outline" onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </main>
    );
  }

  if (hasApplied) {
    return (
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Card className="p-12 shadow-md">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Application Already Submitted</h2>
            <p className="text-gray-600 mb-8 max-w-sm mx-auto">
              You have already submitted an application for <strong>{project.title}</strong>.
              You can track your application status in your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button onClick={() => navigate("/student/applications")}>
                My Applications
              </Button>
              <Button variant="outline" onClick={() => navigate("/browse-projects")}>
                Browse Other Projects
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  const companyName = project.profiles?.company_name ?? project.profiles?.full_name ?? "Unknown company";
  const suggestedSkills = project.required_skills ?? [];
  const durationLabel = project.duration_hours === 0
    ? "Ongoing"
    : project.duration_hours
      ? `${project.duration_hours} hrs`
      : "Flexible";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Project header card */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Apply for Project</h1>
                  <p className="text-gray-600">{project.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {companyName} • {durationLabel}
                {project.budget ? ` • £${project.budget.toLocaleString()}` : ""}
              </p>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Statement of Interest */}
                <div className="space-y-2">
                  <Label htmlFor="statement">Cover Letter *</Label>
                  <Textarea
                    id="statement"
                    placeholder="Explain your motivation for this project and why you're a good fit..."
                    rows={6}
                    required
                    className="resize-none"
                    value={statementValue}
                    onChange={(e) => setStatementValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Tell us about your background and what you can contribute.</p>
                </div>

                {/* File upload */}
                <div className="space-y-2">
                  <Label>Portfolio / CV Upload</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG (max 10 MB each)</p>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.jpg,.png"
                      multiple
                      onChange={handleFileUpload}
                    />
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file.name}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Relevant Skills *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }
                      }}
                    />
                    <Button type="button" onClick={handleAddSkill} variant="outline">Add</Button>
                  </div>

                  {suggestedSkills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Suggested skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedSkills.filter((s) => !selectedSkills.includes(s)).map((skill) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedSkills((prev) => [...prev, skill])}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-sm py-1">
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Input
                      id="availability"
                      type="date"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Select your earliest available start date.</p>
                </div>

                {/* Confirm */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="confirm" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I confirm that the information provided is accurate and complete. *
                    </Label>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</>
                  ) : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Success dialog */}
      <Dialog open={showSuccessModal} onOpenChange={(open) => { if (!open) navigate("/student/applications"); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Application Submitted!
            </DialogTitle>
            <DialogDescription>
              Your application for <strong>{project.title}</strong> has been submitted successfully. We'll review it and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/student/applications")}>
              View My Applications
            </Button>
            <Button onClick={() => navigate("/projects")}>
              Browse More Projects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationForm;
