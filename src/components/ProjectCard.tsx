import { Building2, Clock, Banknote } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
}

export const ProjectCard = ({
  id,
  title,
  company,
  duration,
  tags,
  description,
  budget,
}: ProjectCardProps) => {
  const durationLabel =
    typeof duration === "number"
      ? duration === 0
        ? "Ongoing"
        : `${duration} hrs`
      : duration;

  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md transition-all duration-200">

      {/* Title & Company */}
      <div className="mb-3 pt-1">
        <h3 className="font-bold text-foreground text-lg leading-snug mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{company}</span>
        </div>
      </div>

      {/* Description - FIXED TEXT OVERFLOW */}
      {/* Wrapper handles the flex stretching so line-clamp renders perfectly */}
      <div className="flex-1 mb-5">
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>

      {/* Meta (Hours & Budget) */}
      <div className="flex items-center gap-5 text-sm text-foreground font-medium mb-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {durationLabel}
        </span>
        {budget !== undefined && budget > 0 && (
          <span className="flex items-center gap-1.5">
            <Banknote className="w-4 h-4 text-muted-foreground" />
            £{budget.toLocaleString()}
          </span>
        )}
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-medium text-muted-foreground">
            +{tags.length - 3} more
          </span>
        )}
      </div>

      {/* Action Button */}
      <Button
        asChild
        className="w-full mt-auto bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded-xl font-semibold shadow-sm transition-colors"
      >
        <Link to={`/project/${id}`}>View Details</Link>
      </Button>
    </div>
  );
};