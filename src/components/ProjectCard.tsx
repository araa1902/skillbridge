import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Award, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  company: string;
  duration: string;
  tags: string[];
  description?: string;
  credential?: boolean;
  matchScore?: number;
}

export const ProjectCard = ({ 
  id, 
  title, 
  company, 
  duration, 
  tags, 
  description,
  credential = true,
  matchScore
}: ProjectCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-200/50 hover:border-gray-300">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {matchScore && (
            <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-200/50">
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
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{duration}</span>
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
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

