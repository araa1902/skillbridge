import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function NewProject() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = [
    "Web Development", "Mobile Development", "UI/UX Design", "Graphic Design",
    "Data Analysis", "Machine Learning", "Content Writing", "Copywriting",
    "Social Media", "Marketing", "Research", "Business Analysis"
  ];

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
                {/* ...existing form fields... */}
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Website Redesign for E-commerce Platform"
                  />
                  <p className="text-xs text-gray-500">Clear, descriptive titles get more applications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select>
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
                  <RadioGroup defaultValue="10">
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverables">Expected Deliverables *</Label>
                  <Textarea
                    id="deliverables"
                    placeholder="List specific deliverables (e.g., wireframes, code repository, final report)..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                  <Checkbox id="mentor" />
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Project Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Website Development
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Marketing Campaign
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  User Research
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
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
