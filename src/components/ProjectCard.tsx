import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Buildings as Building2, Calendar, Medal as Award, Sparkle as Sparkles, CurrencyDollar as DollarSign } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

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
  credential?: boolean;
  matchScore?: number;
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
  credential = true,
  matchScore,
  budget,
}: ProjectCardProps) => {
  const durationLabel =
    typeof duration === "number"
      ? duration === 0
        ? "Ongoing"
        : `${duration} hrs`
      : duration;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-200/50 hover:border-gray-300">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight transition-colors">
            {title}
          </h3>
          {matchScore !== undefined && matchScore > 0 && (
            <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200/50 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">{matchScore}%</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{company}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>{durationLabel}</span>
          </div>
          {budget !== undefined && budget > 0 && (
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>£{budget.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>

        {credential && (
          <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-2.5 py-1.5 rounded-md border border-purple-200/50 w-fit">
            <Award className="h-3.5 w-3.5" />
            <span>Verified credential</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <Button asChild className="w-full hover:text-white text-white transition-colors">
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
