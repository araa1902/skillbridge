import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Edit, Users } from "lucide-react";

type Project = {
  id: string;
  title: string;
  description: string;
  postedDate: string;
  category: string;
  status: string;
  applications: number;
  budget: string;
  hours: string;
};

export default function ManageProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Mock data; replace with API fetch in production
    setProjects([
      {
        id: "1",
        title: "Website Redesign Project",
        description: "Looking for a skilled web developer to redesign our e-commerce platform...",
        postedDate: "2 days ago",
        category: "Web Development",
        status: "Active",
        applications: 12,
        budget: "£800",
        hours: "20 hours",
      },
      // Add more mock projects as needed
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/employer/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
            <p className="text-gray-600">View and manage your posted projects</p>
          </div>
          <Link to="/employer/projects/new">
            <Button>Post New Project</Button>
          </Link>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      Posted {project.postedDate} • {project.category}
                    </CardDescription>
                  </div>
                  <Badge>{project.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {project.applications} applications
                    </span>
                    <span>Budget: {project.budget}</span>
                    <span>{project.hours}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/employer/projects/${project.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link to={`/employer/projects/${project.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
