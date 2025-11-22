import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { pendingReferenceRequests, studentReferences } from "@/lib/references-data";
import { CheckCircle2, Clock, Star, Send, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const EmployerReferences = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    rating: 5,
    workQuality: 5,
    communication: 5,
    professionalism: 5,
    technicalSkills: 5,
    overallFeedback: "",
    strengths: "",
    areasForImprovement: "",
    wouldWorkAgain: true
  });

  const completedReferences = studentReferences.filter(ref => ref.employerId === "emp-1");
  const pendingRequests = pendingReferenceRequests.filter(req => req.employerId === "emp-1");

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleSubmitReference = () => {
    // Handle reference submission
    alert("Reference submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Student References</h1>
          <p className="text-gray-600">
            Provide feedback and references for students who completed your projects
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{completedReferences.length}</p>
                  <p className="text-sm text-gray-600">References Given</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    {(completedReferences.reduce((sum, ref) => sum + ref.rating, 0) / completedReferences.length || 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Avg Rating Given</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Requests */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reference Requests</CardTitle>
                <CardDescription>Students waiting for your feedback</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(request.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRequest === request.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{request.studentName}</p>
                          <p className="text-sm text-gray-600">{request.projectTitle}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        Requested {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No pending requests</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed References */}
            <Card>
              <CardHeader>
                <CardTitle>Completed References</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completedReferences.map((ref) => (
                  <div key={ref.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-sm">{ref.studentName}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{ref.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{ref.projectTitle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Reference Form */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Write Reference</CardTitle>
                  <CardDescription>
                    Provide detailed feedback for {pendingRequests.find(r => r.id === selectedRequest)?.studentName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Project Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Project: {pendingRequests.find(r => r.id === selectedRequest)?.projectTitle}
                    </p>
                    <p className="text-xs text-blue-700">
                      Completed on: February 2024
                    </p>
                  </div>

                  {/* Overall Rating */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">
                      Overall Rating
                    </Label>
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer transition-colors ${
                            star <= formData.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        />
                      ))}
                      <span className="text-2xl font-bold ml-2">{formData.rating}.0</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Performance Metrics</Label>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Work Quality</Label>
                        <span className="text-sm font-medium">{formData.workQuality}/5</span>
                      </div>
                      <Slider
                        value={[formData.workQuality]}
                        onValueChange={(value) => handleSliderChange('workQuality', value)}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Communication</Label>
                        <span className="text-sm font-medium">{formData.communication}/5</span>
                      </div>
                      <Slider
                        value={[formData.communication]}
                        onValueChange={(value) => handleSliderChange('communication', value)}
                        max={5}
                        min={1}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Professionalism</Label>
                        <span className="text-sm font-medium">{formData.professionalism}/5</span>
                      </div>
                      <Slider
                        value={[formData.professionalism]}
                        onValueChange={(value) => handleSliderChange('professionalism', value)}
                        max={5}
                        min={1}
                        step={1}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Technical Skills</Label>
                        <span className="text-sm font-medium">{formData.technicalSkills}/5</span>
                      </div>
                      <Slider
                        value={[formData.technicalSkills]}
                        onValueChange={(value) => handleSliderChange('technicalSkills', value)}
                        max={5}
                        min={1}
                        step={1}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Written Feedback */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="overall-feedback" className="text-base font-semibold">
                        Overall Feedback *
                      </Label>
                      <p className="text-sm text-gray-600 mb-2">
                        Describe the student's performance and contribution to the project
                      </p>
                      <Textarea
                        id="overall-feedback"
                        placeholder="The student demonstrated excellent..."
                        className="min-h-32"
                        value={formData.overallFeedback}
                        onChange={(e) => setFormData(prev => ({ ...prev, overallFeedback: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="strengths">
                        Key Strengths (one per line)
                      </Label>
                      <Textarea
                        id="strengths"
                        placeholder="Strong attention to detail&#10;Excellent communication&#10;Proactive problem solver"
                        className="min-h-24"
                        value={formData.strengths}
                        onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="improvements">
                        Areas for Improvement (optional)
                      </Label>
                      <Textarea
                        id="improvements"
                        placeholder="Could explore more advanced techniques..."
                        className="min-h-20"
                        value={formData.areasForImprovement}
                        onChange={(e) => setFormData(prev => ({ ...prev, areasForImprovement: e.target.value }))}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="work-again" className="font-medium">
                          Would you work with this student again?
                        </Label>
                        <p className="text-sm text-gray-600">
                          This helps other employers assess the student
                        </p>
                      </div>
                      <Switch
                        id="work-again"
                        checked={formData.wouldWorkAgain}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, wouldWorkAgain: checked }))}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1" size="lg" onClick={handleSubmitReference}>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Reference
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedRequest(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Reference Request</h3>
                  <p className="text-gray-600">
                    Choose a pending request from the left to provide feedback
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerReferences;
