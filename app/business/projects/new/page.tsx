"use client";

import { useState } from "react";
import { Button } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/button";
import { Input } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/input";
import { Label } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/label";
import { Textarea } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/select";
import { Checkbox } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/radio-group";
import { Badge } from "/Users/aravindkumar/Documents/skillbridge/skillbridge-connects/src/components/ui/badge";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NewProjectPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    duration: "20",
    budget: "",
    deadline: "",
    deliverables: "",
    includeMentor: false,
  });

  const skills = [
    "Web Development", "Mobile Development", "UI/UX Design", "Graphic Design",
    "Data Analysis", "Machine Learning", "Content Writing", "Copywriting",
    "Social Media", "Marketing", "Research", "Business Analysis"
  ];

  const projectTemplates = {
    website: {
      title: "Website Development & Redesign",
      category: "web-dev",
      description: "We need a modern, responsive website that effectively showcases our products/services. The website should be user-friendly, mobile-optimized, and include features such as contact forms, image galleries, and SEO optimization.\n\nKey requirements:\n- Clean, professional design\n- Mobile-responsive layout\n- Fast loading times\n- Integration with contact forms\n- Basic SEO setup",
      skills: ["Web Development", "UI/UX Design"],
      duration: "20",
      budget: "600",
      deliverables: "- Fully functional website (HTML/CSS/JavaScript or framework of choice)\n- Responsive design for mobile and desktop\n- Source code and documentation\n- Deployment guide\n- 2 rounds of revisions included",
    },
    marketing: {
      title: "Digital Marketing Campaign Strategy",
      category: "marketing",
      description: "Looking for a comprehensive digital marketing campaign to increase brand awareness and drive engagement across social media platforms. The campaign should include content strategy, social media posts, and performance metrics.\n\nKey requirements:\n- Target audience research\n- Content calendar for 4 weeks\n- Platform-specific content (Instagram, LinkedIn, Twitter)\n- Engagement strategy\n- Analytics and reporting",
      skills: ["Marketing", "Social Media", "Content Writing"],
      duration: "20",
      budget: "500",
      deliverables: "- Marketing strategy document\n- 4-week content calendar\n- 20+ social media posts (copy + graphics)\n- Hashtag research and strategy\n- Performance tracking template\n- Final campaign report",
    },
    research: {
      title: "User Research & Market Analysis",
      category: "research",
      description: "We need comprehensive user research to understand our target market better and inform product development decisions. This includes surveys, interviews, competitor analysis, and actionable insights.\n\nKey requirements:\n- User survey design and distribution\n- 10-15 user interviews\n- Competitor analysis\n- Data synthesis and insights\n- Actionable recommendations",
      skills: ["Research", "Data Analysis", "Business Analysis"],
      duration: "20",
      budget: "700",
      deliverables: "- Research methodology document\n- Survey results and analysis\n- Interview transcripts and key findings\n- Competitor analysis report\n- User personas (3-5)\n- Final presentation with recommendations",
    },
    data: {
      title: "Data Analysis & Visualization Project",
      category: "data",
      description: "Looking for data analysis expertise to extract insights from our dataset and create compelling visualizations. The project involves cleaning data, performing statistical analysis, and creating interactive dashboards.\n\nKey requirements:\n- Data cleaning and preprocessing\n- Statistical analysis\n- Trend identification\n- Dashboard creation\n- Documentation of methodology",
      skills: ["Data Analysis", "Machine Learning"],
      duration: "20",
      budget: "650",
      deliverables: "- Cleaned and structured dataset\n- Statistical analysis report\n- Interactive dashboard (Tableau/PowerBI/Python)\n- Data visualization suite (5-10 charts)\n- Methodology documentation\n- Recommendations based on findings",
    },
  };

  const applyTemplate = (templateKey: keyof typeof projectTemplates) => {
    const template = projectTemplates[templateKey];
    setFormData({
      title: template.title,
      category: template.category,
      description: template.description,
      duration: template.duration,
      budget: template.budget,
      deadline: "",
      deliverables: template.deliverables,
      includeMentor: false,
    });
    setSelectedSkills(template.skills);
  };

  return (
    <div className="min-h-screen bg-gray-50">

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
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Website Redesign for E-commerce Platform"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Clear, descriptive titles get more applications</p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you need, project goals, and any specific requirements..."
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Be specific about deliverables and expectations</p>
                </div>

                {/* Required Skills */}
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

                {/* Time Commitment */}
                <div className="space-y-2">
                  <Label>Project Duration *</Label>
                  <RadioGroup value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
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

                {/* Budget */}
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
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>£200 - £2,000</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Funds will be held in escrow until project completion</p>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                  <Label htmlFor="deadline">Project Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>

                {/* Deliverables */}
                <div className="space-y-2">
                  <Label htmlFor="deliverables">Expected Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="List specific deliverables (e.g., wireframes, code repository, final report)..."
                    rows={4}
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  />
                </div>

                {/* Mentor Option */}
                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <Checkbox
                    id="mentor"
                    checked={formData.includeMentor}
                    onCheckedChange={(checked) => setFormData({ ...formData, includeMentor: checked as boolean })}
                  />
                  <label htmlFor="mentor" className="text-sm cursor-pointer">
                    <span className="font-medium">Include mentor matching</span> - Connect student with an industry mentor for guidance
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button size="lg" className="flex-1">
                    Post Project & Deposit to Escrow
                  </Button>
                  <Button size="lg" variant="outline">
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Project Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  type="button"
                  onClick={() => applyTemplate('website')}
                >
                  Website Development
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  type="button"
                  onClick={() => applyTemplate('marketing')}
                >
                  Marketing Campaign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  type="button"
                  onClick={() => applyTemplate('research')}
                >
                  User Research
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  type="button"
                  onClick={() => applyTemplate('data')}
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
