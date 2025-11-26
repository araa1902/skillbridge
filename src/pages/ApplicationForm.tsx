import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, X, FileText, CheckCircle, Calendar } from "lucide-react";
import { projects } from "@/lib/data";
import { toast } from "sonner"; // Assuming Sonner for toasts

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [availability, setAvailability] = useState<Date | undefined>();
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock user skills from profile (replace with actual data fetching logic)
  const userSkills = ["JavaScript", "React", "Node.js"]; // Example skills

  // Mock pre-attached CV file
  const mockCV = new File(["mock content"], "resume.pdf", { type: "application/pdf" });

  useEffect(() => {
    // Auto-populate selectedSkills with user's skills on mount
    setSelectedSkills(userSkills);
    // Pre-attach mock CV
    setUploadedFiles([mockCV]);
  }, []);

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen">
        
        <main className="flex-1 flex items-center justify-center">
          <p>Project not found</p>
        </main>
      </div>
    );
  }
  
  const suggestedSkills = project.tags || []; // Use project's tags as suggested skills

  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      setSelectedSkills([...selectedSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type for ${file.name}. Only PDF, DOCX, JPG, PNG allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });
    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload({ target: { files } } as any);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      toast.error("Please confirm that the information is accurate.");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const isFormValid = selectedSkills.length > 0 && availability && confirmed;

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
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
              <p className="text-sm text-gray-500">{project.company} • {project.duration}</p>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="statement">Statement of Interest *</Label>
                  <Textarea
                    id="statement"
                    placeholder="Explain your motivation for this project and why you're a good fit..."
                    rows={6}
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">Tell us about your background and what you can contribute.</p>
                </div>

                <div className="space-y-2">
                  <Label>Portfolio / CV Upload</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-300 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, JPG, PNG (max 10MB each)
                    </p>
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Relevant Skills *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill} variant="outline">Add</Button>
                  </div>
                  {suggestedSkills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Suggested skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {suggestedSkills.filter(skill => !selectedSkills.includes(skill)).map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedSkills([...selectedSkills, skill])}
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
                  <Label htmlFor="availability">Availability *</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <Input 
                      id="availability" 
                      type="date" 
                      value={availability ? availability.toISOString().split('T')[0] : ''} 
                      onChange={(e) => setAvailability(new Date(e.target.value))} 
                      required 
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Select your earliest available start date.</p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="confirm" 
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label 
                      htmlFor="confirm" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm that the information provided is accurate and complete. *
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Application Submitted Successfully
            </DialogTitle>
            <DialogDescription>
              Your application for {project.title} has been submitted. We'll review it and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/project/${id}/application-status`)}>
              View Application Status
            </Button>
            <Button onClick={() => navigate('/projects')}>
              Browse More Projects
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ApplicationForm;
