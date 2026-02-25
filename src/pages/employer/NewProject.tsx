import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, HelpCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { insertProject } from "@/hooks/useProjects";
import { useToast } from "@/hooks/use-toast";

export default function NewProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    deliverables: "",
    budget: "",
    duration: "10",
    mentor: false,
    deadline: ""
  });

  const skills = [
    "Web Development", "Mobile Development", "UI/UX Design", "Graphic Design",
    "Data Analysis", "Machine Learning", "Content Writing", "Copywriting",
    "Social Media", "Marketing", "Research", "Business Analysis"
  ];

  const templates: Record<string, {
    title: string;
    category: string;
    description: string;
    deliverables: string;
    skills: string[];
    duration: string;
    budget: string;
  }> = {
    "Website Development": {
      title: "E-commerce Website Revamp",
      category: "web-dev",
      description: "Redesign and optimize our existing e-commerce website for performance, accessibility, and mobile responsiveness. Implement improved navigation, product filtering, and SEO best practices.",
      deliverables: "1. High-fidelity UI mockups\n2. Responsive React/Next.js implementation\n3. Performance report (Lighthouse)\n4. Accessibility audit\n5. Deployment instructions",
      skills: ["Web Development", "UI/UX Design", "Data Analysis"],
      duration: "20",
      budget: "800"
    },
    "Marketing Campaign": {
      title: "Student Targeted Digital Marketing Campaign",
      category: "marketing",
      description: "Design and execute a digital marketing campaign targeting university students to increase sign-ups. Include channel strategy, content calendar, and performance tracking.",
      deliverables: "1. Campaign brief\n2. 4-week content calendar\n3. Ad copy + creative concepts\n4. Analytics tracking plan\n5. Post-campaign performance summary",
      skills: ["Marketing", "Social Media", "Content Writing", "Data Analysis"],
      duration: "20",
      budget: "600"
    },
    "User Research": {
      title: "User Research for New Mobile App Feature",
      category: "research",
      description: "Conduct qualitative and quantitative research to validate a new feature concept for our mobile app. Include user interviews, survey, and insights synthesis.",
      deliverables: "1. Research plan\n2. Interview summaries\n3. Survey dataset\n4. Insight report\n5. Feature recommendation",
      skills: ["Research", "UI/UX Design", "Data Analysis"],
      duration: "10",
      budget: "400"
    },
    "Data Analysis": {
      title: "Sales Funnel Performance Analysis",
      category: "data",
      description: "Analyze our sales funnel data to identify drop-off points and recommend optimization strategies. Use historical CRM/export data.",
      deliverables: "1. Data cleaning notebook\n2. Funnel visualization\n3. KPI dashboard concept\n4. Findings report\n5. Optimization recommendations",
      skills: ["Data Analysis", "Business Analysis", "Research"],
      duration: "20",
      budget: "900"
    }
  };

  const applyTemplate = (name: string) => {
    const t = templates[name];
    if (!t) return;
    setForm(f => ({
      ...f,
      title: t.title,
      category: t.category,
      description: t.description,
      deliverables: t.deliverables,
      duration: t.duration,
      budget: t.budget
    }));
    setSelectedSkills(t.skills);
  };

  const handleSubmit = async (asDraft = false) => {
    if (!user) {
      toast({ title: "Not authenticated", description: "Please log in first.", variant: "destructive" });
      return;
    }
    if (!form.title.trim() || !form.description.trim() || !form.deliverables.trim()) {
      toast({ title: "Missing required fields", description: "Title, description, and deliverables are required.", variant: "destructive" });
      return;
    }
    if (selectedSkills.length === 0) {
      toast({ title: "Select at least one skill", variant: "destructive" });
      return;
    }
    const budgetNum = parseFloat(form.budget);
    if (!asDraft && (isNaN(budgetNum) || budgetNum < 200)) {
      toast({ title: "Invalid budget", description: "Budget must be at least £200.", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    const durationHours = form.duration === "ongoing" ? 0 : parseInt(form.duration, 10);

    const { error } = await insertProject({
      business_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      deliverables: form.deliverables.trim(),
      required_skills: selectedSkills,
      budget: isNaN(budgetNum) ? 0 : budgetNum,
      duration_hours: durationHours,
      status: asDraft ? 'draft' : 'open',
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Failed to post project",
        description: error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: asDraft ? "Draft saved!" : "Project posted successfully! 🎉",
      description: asDraft
        ? "Your project has been saved as a draft."
        : "Students can now discover and apply to your project.",
    });

    navigate("/employer/projects/manage");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/employer/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Project</h1>
          <p className="text-gray-600">Connect with talented university students</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Provide information about your project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Website Redesign for E-commerce Platform"
                    value={form.title}
                    onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Clear, descriptive titles get more applications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(val) => setForm(f => ({ ...f, category: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web-dev">Web Development</SelectItem>
                      <SelectItem value="mobile-dev">Mobile Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="data">Data & Analytics</SelectItem>
                      <SelectItem value="content">Content Creation</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need, project goals, and any specific requirements..."
                    rows={6}
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500">Be specific about deliverables and expectations</p>
                </div>

                <div className="space-y-2">
                  <Label>Required Skills *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedSkills([...selectedSkills, skill]);
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                        />
                        <label htmlFor={skill} className="text-sm cursor-pointer">
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Project Duration *</Label>
                  <RadioGroup
                    value={form.duration}
                    onValueChange={(val) => setForm(f => ({ ...f, duration: val }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="10" id="10" />
                      <label htmlFor="10" className="text-sm cursor-pointer">
                        <span className="font-medium">10-hour Sprint</span> - Quick turnaround projects
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="20" id="20" />
                      <label htmlFor="20" className="text-sm cursor-pointer">
                        <span className="font-medium">20-hour Project</span> - Standard projects
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ongoing" id="ongoing" />
                      <label htmlFor="ongoing" className="text-sm cursor-pointer">
                        <span className="font-medium">Ongoing Collaboration</span> - Long-term partnership
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (GBP) *</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        id="budget"
                        type="number"
                        placeholder="200"
                        min="200"
                        max="2000"
                        value={form.budget}
                        onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))}
                      />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>£200 - £2,000</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Funds will be held in escrow until project completion</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Project Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm(f => ({ ...f, deadline: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverables">Expected Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="List specific deliverables (e.g., wireframes, code repository, final report)..."
                    rows={4}
                    value={form.deliverables}
                    onChange={(e) => setForm(f => ({ ...f, deliverables: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <Checkbox
                    id="mentor"
                    checked={form.mentor}
                    onCheckedChange={(checked) =>
                      setForm(f => ({ ...f, mentor: Boolean(checked) }))
                    }
                  />
                  <label htmlFor="mentor" className="text-sm cursor-pointer">
                    <span className="font-medium">Include mentor matching</span> - Connect student with an industry mentor for guidance
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                  >
                    {submitting ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting…</>
                    ) : (
                      "Post Project & Deposit to Escrow"
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                  >
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Project Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start"
                  onClick={() => applyTemplate("Website Development")}
                >
                  Website Development
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start"
                  onClick={() => applyTemplate("Marketing Campaign")}
                >
                  Marketing Campaign
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start"
                  onClick={() => applyTemplate("User Research")}
                >
                  User Research
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start"
                  onClick={() => applyTemplate("Data Analysis")}
                >
                  Data Analysis
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">10-hour Sprint</p>
                  <p className="text-gray-600">£200 - £500</p>
                </div>
                <div>
                  <p className="font-medium">20-hour Project</p>
                  <p className="text-gray-600">£400 - £1,000</p>
                </div>
                <div>
                  <p className="font-medium">Ongoing Work</p>
                  <p className="text-gray-600">£800 - £2,000</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-700">
                <p>✓ Be specific about deliverables</p>
                <p>✓ Set realistic timelines</p>
                <p>✓ Provide examples if possible</p>
                <p>✓ Respond to applications quickly</p>
                <p>✓ Use milestones for larger projects</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
