import { Reference } from "@/types/reference";
import { ReferenceFromDB } from "@/hooks/useReferences";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Building2, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReferenceCardProps {
  reference: Reference | ReferenceFromDB;
  compact?: boolean;
}

// Helper function to normalize reference data
function normalizeReference(ref: Reference | ReferenceFromDB) {
  if ('workQuality' in ref) {
    // Already in Reference format
    return {
      employerName: ref.employerName,
      employerTitle: ref.employerTitle,
      companyName: ref.companyName,
      rating: ref.rating,
      projectTitle: ref.projectTitle,
      overallFeedback: ref.overallFeedback,
      workQuality: ref.workQuality,
      communication: ref.communication,
      professionalism: ref.professionalism,
      technicalSkills: ref.technicalSkills,
      skills: ref.skills,
      strengths: ref.strengths,
      areasForImprovement: ref.areasForImprovement,
      wouldWorkAgain: ref.wouldWorkAgain,
      verifiedByPlatform: ref.verifiedByPlatform,
      createdAt: ref.createdAt,
    };
  } else {
    // Convert from database format
    return {
      employerName: ref.employer_name,
      employerTitle: ref.employer_title,
      companyName: ref.company_name,
      rating: ref.rating,
      projectTitle: ref.project_title,
      overallFeedback: ref.overall_feedback,
      workQuality: ref.work_quality,
      communication: ref.communication,
      professionalism: ref.professionalism,
      technicalSkills: ref.technical_skills,
      skills: ref.skills || [],
      strengths: ref.strengths || [],
      areasForImprovement: ref.areas_for_improvement || [],
      wouldWorkAgain: ref.would_work_again,
      verifiedByPlatform: ref.verified_by_platform,
      createdAt: ref.created_at,
    };
  }
}

export function ReferenceCard({ reference, compact = false }: ReferenceCardProps) {
  const normalized = normalizeReference(reference);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric'
    });
  };

  const ratings = [
    { label: "Work Quality", value: normalized.workQuality },
    { label: "Communication", value: normalized.communication },
    { label: "Professionalism", value: normalized.professionalism },
    { label: "Technical Skills", value: normalized.technicalSkills }
  ];

  if (compact) {
    return (
      <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-200 bg-white/80">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 ring-2 ring-blue-200 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                {normalized.employerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm">{normalized.employerName}</p>
                  {normalized.verifiedByPlatform && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600">{normalized.employerTitle}</p>
                <p className="text-xs text-gray-500">{normalized.companyName}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-sm text-gray-900">{normalized.rating}.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">{normalized.projectTitle}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{normalized.overallFeedback}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white text-lg font-bold">
              {normalized.employerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">{normalized.employerName}</h3>
                {normalized.verifiedByPlatform && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">{normalized.employerTitle}</p>
              <p className="text-sm text-gray-500">{normalized.companyName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(normalized.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{normalized.rating}.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Building2 className="w-4 h-4" />
          <span className="font-medium">Project: {normalized.projectTitle}</span>
        </div>

        {normalized.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {normalized.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Feedback */}
        <div>
          <h4 className="font-semibold mb-2">Overall Feedback</h4>
          <p className="text-gray-700 leading-relaxed">{normalized.overallFeedback}</p>
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
        {normalized.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Key Strengths</h4>
            <ul className="space-y-2">
              {normalized.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Areas for Growth */}
        {normalized.areasForImprovement.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Areas for Growth</h4>
            <ul className="space-y-2">
              {normalized.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 flex-shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Would Work Again */}
        {normalized.wouldWorkAgain && (
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
