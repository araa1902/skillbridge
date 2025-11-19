import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReferenceCard } from "@/components/ReferenceCard";
import { studentReferences } from "@/lib/references-data";
import { Star, Award, TrendingUp, Eye, EyeOff, Download, Share2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const StudentReferences = () => {
  const [showPrivate, setShowPrivate] = useState(true);
  
  const publicReferences = studentReferences.filter(ref => ref.isPublic);
  const privateReferences = studentReferences.filter(ref => !ref.isPublic);
  
  const averageRating = (
    studentReferences.reduce((sum, ref) => sum + ref.rating, 0) / 
    studentReferences.length
  ).toFixed(1);

  const totalRatings = studentReferences.length;
  
  const averageScores = {
    workQuality: (studentReferences.reduce((sum, ref) => sum + ref.workQuality, 0) / totalRatings).toFixed(1),
    communication: (studentReferences.reduce((sum, ref) => sum + ref.communication, 0) / totalRatings).toFixed(1),
    professionalism: (studentReferences.reduce((sum, ref) => sum + ref.professionalism, 0) / totalRatings).toFixed(1),
    technicalSkills: (studentReferences.reduce((sum, ref) => sum + ref.technicalSkills, 0) / totalRatings).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Professional References</h1>
          <p className="text-xl text-gray-600">
            Verified feedback from employers and project supervisors
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <Badge className="bg-yellow-100 text-yellow-800">
                  {totalRatings} reviews
                </Badge>
              </div>
              <p className="text-3xl font-bold mb-1">{averageRating}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-3xl font-bold mb-1">{averageScores.workQuality}</p>
              <p className="text-sm text-gray-600">Work Quality</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
              <p className="text-3xl font-bold mb-1">{averageScores.communication}</p>
              <p className="text-sm text-gray-600">Communication</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <p className="text-3xl font-bold mb-1">{averageScores.technicalSkills}</p>
              <p className="text-sm text-gray-600">Technical Skills</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold mb-1">Share Your References</h3>
                <p className="text-sm text-gray-600">
                  Make your profile stand out with verified employer feedback
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            All References ({studentReferences.length})
          </h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="show-private" className="text-sm">
              Show private references
            </Label>
            <Switch
              id="show-private"
              checked={showPrivate}
              onCheckedChange={setShowPrivate}
            />
          </div>
        </div>

        {/* Public References */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold">
              Public References ({publicReferences.length})
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Visible to employers
            </Badge>
          </div>
          {publicReferences.map((reference) => (
            <ReferenceCard key={reference.id} reference={reference} />
          ))}
        </div>

        {/* Private References */}
        {showPrivate && privateReferences.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <EyeOff className="w-5 h-5 text-gray-600" />
              <h3 className="text-xl font-semibold">
                Private References ({privateReferences.length})
              </h3>
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                Only visible to you
              </Badge>
            </div>
            {privateReferences.map((reference) => (
              <ReferenceCard key={reference.id} reference={reference} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {studentReferences.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No references yet</h3>
              <p className="text-gray-600 mb-6">
                Complete projects and request references from employers to build your professional reputation
              </p>
              <Button>Browse Projects</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentReferences;
