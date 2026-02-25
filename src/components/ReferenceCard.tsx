import { Reference } from "@/types/reference";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, CheckCircle2, Building2, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReferenceCardProps {
  reference: Reference;
  compact?: boolean;
}

export function ReferenceCard({ reference, compact = false }: ReferenceCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
  };

  const ratings = [
    { label: "Work Quality", value: reference.workQuality },
    { label: "Communication", value: reference.communication },
    { label: "Professionalism", value: reference.professionalism },
    { label: "Technical Skills", value: reference.technicalSkills }
  ];

  if (compact) {
    return (
      <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 bg-white/80">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-blue-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                  {reference.employerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm">{reference.employerName}</p>
                  {reference.verifiedByPlatform && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600">{reference.employerTitle}</p>
                <p className="text-xs text-gray-500">{reference.companyName}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm text-gray-900">{reference.rating}.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">{reference.projectTitle}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{reference.overallFeedback}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                {reference.employerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{reference.employerName}</h3>
                {reference.verifiedByPlatform && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">{reference.employerTitle}</p>
              <p className="text-sm text-gray-500">{reference.companyName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(reference.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{reference.rating}.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Building2 className="w-4 h-4" />
          <span className="font-medium">Project: {reference.projectTitle}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {reference.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
              {skill}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Feedback */}
        <div>
          <h4 className="font-semibold mb-2">Overall Feedback</h4>
          <p className="text-gray-700 leading-relaxed">{reference.overallFeedback}</p>
        </div>

        {/* Performance Ratings */}
        <div>
          <h4 className="font-semibold mb-3">Performance Ratings</h4>
          <div className="space-y-3">
            {ratings.map((rating, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{rating.label}</span>
                  <span className="font-medium">{rating.value}/5</span>
                </div>
                <Progress value={rating.value * 20} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h4 className="font-semibold mb-2">Key Strengths</h4>
          <ul className="space-y-2">
            {reference.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Growth */}
        {reference.areasForImprovement.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Areas for Growth</h4>
            <ul className="space-y-2">
              {reference.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 flex-shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Would Work Again */}
        {reference.wouldWorkAgain && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Would work with this student again
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
