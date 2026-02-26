import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useFetchWrittenReferences, writeReference, useFetchPendingRequests } from "@/hooks/useReferences";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, Star, Send, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const EmployerReferences = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { references, loading } = useFetchWrittenReferences(user?.id ?? null);
  const { requests, loading: loadingRequests } = useFetchPendingRequests(user?.id ?? null);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
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

  const handleSliderChange = (field: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }));
  };

  const handleSubmitReference = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive",
      });
      return;
    }

    if (!formData.overallFeedback.trim()) {
      toast({
        title: "Error",
        description: "Overall feedback is required",
        variant: "destructive",
      });
      return;
    }

    const selectedRequest = requests.find(r => r.id === selectedRequestId);
    if (!selectedRequest) {
      toast({
        title: "Error",
        description: "Please select a student and project to review",
        variant: "destructive",
      });
      return;
    }

    try {
      const strengthsArray = formData.strengths
        .split('\n')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const improvementArray = formData.areasForImprovement
        .split('\n')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const { error } = await writeReference({
        student_id: selectedRequest.student_id,
        student_name: selectedRequest.student_name,
        employer_id: user.id,
        employer_name: profile.full_name || "Employer",
        employer_title: "Employer",
        company_name: profile.company_name || "Company",
        company_logo: undefined,
        project_id: selectedRequest.project_id,
        project_title: selectedRequest.project_title,
        rating: formData.rating,
        skills: [],
        strengths: strengthsArray,
        areas_for_improvement: improvementArray,
        overall_feedback: formData.overallFeedback,
        work_quality: formData.workQuality,
        communication: formData.communication,
        professionalism: formData.professionalism,
        technical_skills: formData.technicalSkills,
        would_work_again: formData.wouldWorkAgain,
        is_public: true,
        request_id: selectedRequestId,
      });

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
      } else {
        setShowSuccessDialog(true);
        setSelectedRequestId(null);
        setFormData({
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
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit reference",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Please sign in to manage references.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{references.length}</p>
                    <p className="text-sm text-gray-600">References Given</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {loadingRequests ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{requests.length}</p>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {loading ? (
                <Skeleton className="h-16 w-full" />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {references.length > 0
                        ? (references.reduce((sum, ref) => sum + ref.rating, 0) / references.length).toFixed(1)
                        : "0"}
                    </p>
                    <p className="text-sm text-gray-600">Avg Rating Given</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Completed References */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Completed References</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : references.length > 0 ? (
                  references.map((ref) => (
                    <div key={ref.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-semibold text-sm">{ref.student_name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{ref.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{ref.project_title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">No references written yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reference Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Write a Reference</CardTitle>
                <CardDescription>
                  Provide detailed feedback for a student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Student Selection */}
                <div>
                  <Label htmlFor="student-select" className="text-base font-semibold mb-3 block">
                    Select Student & Project *
                  </Label>
                  <div className="grid gap-3">
                    {loadingRequests ? (
                      <Skeleton className="h-10 w-full" />
                    ) : requests.length > 0 ? (
                      requests.map((request) => (
                        <div
                          key={request.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedRequestId === request.id
                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                            : 'hover:bg-gray-50'
                            }`}
                          onClick={() => setSelectedRequestId(request.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-900">{request.student_name}</p>
                              <p className="text-sm text-gray-500">{request.project_title}</p>
                            </div>
                            {selectedRequestId === request.id && (
                              <CheckCircle2 className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 border border-dashed rounded-lg text-center bg-gray-50/50">
                        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No pending reference requests</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Overall Rating */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Overall Rating
                  </Label>
                  <div className="flex items-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${star <= formData.rating
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reference Submitted</DialogTitle>
            <DialogDescription>
              Your reference has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerReferences;
