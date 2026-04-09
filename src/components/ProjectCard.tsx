// ProjectCard.tsx
import { Building2, Clock, Tag, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  /** Display name: company_name if set, otherwise full_name */
  company: string;
  /** Human-readable duration string e.g. "10 hrs" or a raw number of hours */
  duration: string | number;
  /** Skill tags array */
  tags: string[];
  description?: string;
  /** Budget in GBP */
  budget?: number;
  /** e.g. "Fixed-price" | "Hourly" */
  budgetType?: "Fixed-price" | "Hourly";
  /** e.g. "Entry" | "Intermediate" | "Expert" */
  experienceLevel?: "Entry" | "Intermediate" | "Expert";
  /** ISO date string or relative label e.g. "1 day ago" */
  postedAt?: string;
  /** True if we consider the SME verified */
  isVerified?: boolean;
}

const experienceColor: Record<string, string> = {
  Entry: "bg-blue-50 text-blue-700 border-blue-200",
  Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  Expert: "bg-green-50 text-green-700 border-green-200",
};

export const ProjectCard = ({
  id,
  title,
  company,
  duration,
  tags,
  description,
  budget,
  budgetType = "Fixed-price",
  experienceLevel,
  postedAt,
  isVerified,
}: ProjectCardProps) => {
  const durationLabel =
    typeof duration === "number"
      ? duration === 0
        ? "Ongoing"
        : `${duration} hrs`
      : duration;

  const budgetDisplay =
    budget !== undefined
      ? `£${budget.toLocaleString("en-GB")}`
      : "Budget N/A";

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            to={`/projects/${id}`}
            className="text-lg font-semibold text-gray-900 hover:text-green-700 transition-colors line-clamp-2 leading-snug"
          >
            {title}
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {company}
            </span>
            {isVerified && <VerifiedBadge />}
            {postedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {postedAt}
              </span>
            )}
          </div>
        </div>

        {/* Budget badge */}
        <div className="shrink-0 text-right">
          <p className="text-xl font-bold text-gray-900">{budgetDisplay}</p>
        </div>
      </div>

      {/* Meta pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {durationLabel && (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            <Clock className="w-3 h-3" />
            {durationLabel}
          </span>
        )}
        {experienceLevel && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium",
              experienceColor[experienceLevel] ?? "bg-gray-100 text-gray-600 border-gray-200"
            )}
          >
            <Zap className="w-3 h-3" />
            {experienceLevel}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>
      )}

      {/* Skill tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags.slice(0, 6).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 rounded-full px-3 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 6 && (
            <Badge
              variant="secondary"
              className="text-xs font-normal bg-gray-100 text-gray-500 rounded-full px-3 py-0.5"
            >
              +{tags.length - 6} more
            </Badge>
          )}
        </div>
      )}

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          asChild
          className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl font-semibold shadow-sm transition-colors"
        >
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};
