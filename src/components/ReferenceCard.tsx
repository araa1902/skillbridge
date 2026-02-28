import { Reference } from "@/types/reference";
import { ReferenceFromDB } from "@/hooks/useReferences";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle as CheckCircle2, Buildings as Building2, Calendar, BriefcaseIcon } from "@phosphor-icons/react";
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
      <Card className="border border-border hover:bg-muted/30 transition-colors shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                {normalized.employerName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-bold text-sm text-foreground">{normalized.employerName}</p>
                  {normalized.verifiedByPlatform && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{normalized.employerTitle}</p>
                <p className="text-xs text-muted-foreground/80">{normalized.companyName}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
                <span className="font-bold text-sm text-foreground">{normalized.rating}.0</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate font-medium">{normalized.projectTitle}</span>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">{normalized.overallFeedback}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border border-border overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary text-white text-xl font-bold">
              {normalized.employerName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl text-foreground">{normalized.employerName}</h3>
                {normalized.verifiedByPlatform && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{normalized.employerTitle}</p>
              <p className="text-sm text-foreground/70">{normalized.companyName}</p>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-2">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(normalized.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-accent-amber text-accent-amber" />
            <span className="font-extrabold text-xl text-foreground">{normalized.rating}.0</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-bold border-b border-border pb-4">
          <span>Project: <span className="text-foreground">{normalized.projectTitle}</span></span>
        </div>

        {normalized.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {normalized.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="border-border text-foreground font-semibold">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-8 pt-0">
        {/* Overall Feedback */}
        <div className="py-4">
          <h4 className="font-bold text-xs mb-2 uppercase tracking-widest text-muted-foreground">Overall Feedback</h4>
          <p className="text-foreground/90 leading-relaxed font-medium">{normalized.overallFeedback}</p>
        </div>

        {/* Performance Ratings */}
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-border">
          <div className="sm:col-span-2">
            <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Performance Metrics</h4>
          </div>
          {ratings.map((rating, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-semibold">{rating.label}</span>
                <span className="font-bold text-primary">{rating.value}/5</span>
              </div>
              <Progress value={rating.value * 20} className="h-1.5 bg-muted" />
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-12 pt-6 border-t border-border">
          {/* Strengths */}
          {normalized.strengths.length > 0 && (
            <div>
              <h4 className="font-bold text-xs mb-4 uppercase tracking-widest text-muted-foreground">Key Strengths</h4>
              <ul className="space-y-2">
                {normalized.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Growth */}
          {normalized.areasForImprovement.length > 0 && (
            <div>
              <h4 className="font-bold text-xs mb-4 uppercase tracking-widest text-muted-foreground">Areas for Growth</h4>
              <ul className="space-y-2">
                {normalized.areasForImprovement.map((area, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-1.5" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Would Work Again */}
        {normalized.wouldWorkAgain && (
          <div className="pt-6 border-t border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Recommended by Employer</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
