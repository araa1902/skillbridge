import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  id: string;
  title: string;
  company: string;
  duration: string;
  tags: string[];
  description?: string;
  credential?: boolean;
}

export const ProjectCard = ({ 
  id, 
  title, 
  company, 
  duration, 
  tags, 
  description,
  credential = true 
}: ProjectCardProps) => {
  return (
    <Card className="group hover:shadow-hover transition-smooth h-full flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-accent transition-smooth">
            {title}
          </h3>
          {credential && (
            <Award className="h-5 w-5 text-accent shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{company}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{duration}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
