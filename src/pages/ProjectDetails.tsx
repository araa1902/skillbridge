import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Calendar, Award, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectData {
  id: string;
  title: string;
  description?: string;
  company?: string;
  company_id?: string;
  duration?: string | number;
  tags?: string[];
  credential?: boolean;
  status?: string;
  [key: string]: any;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          setProject(null);
        } else {
          setProject(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-12 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!project || error) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Project not found</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                {error || 'The project you are looking for does not exist.'}
              </p>
              <Button asChild>
                <Link to="/browse-projects">Back to Projects</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/browse-projects" className="hover:text-foreground">Projects</Link>
              <span>/</span>
              <span>{project.title}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">{project.company_name?.substring(0, 2).toUpperCase() || 'NA'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                      {project.company_name && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{project.company_name}</span>
                        </div>
                      )}
                      {project.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{project.duration}</span>
                        </div>
                      )}
                      {project.credential !== false && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-accent" />
                          <span>Micro-credential</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {project.tags && Array.isArray(project.tags) && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button size="lg" asChild className="lg:shrink-0">
                <Link to={`/project/${project.id}/apply`}>Apply Now</Link>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {project.requirements && <TabsTrigger value="requirements">Requirements</TabsTrigger>}
                  {project.deliverables && <TabsTrigger value="deliverables">Deliverables</TabsTrigger>}
                  {project.company_info && <TabsTrigger value="company">Company Info</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description || 'No description available'}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {project.requirements && Array.isArray(project.requirements) && (
                  <TabsContent value="requirements" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Requirements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {project.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{typeof req === 'string' ? req : JSON.stringify(req)}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {project.deliverables && Array.isArray(project.deliverables) && (
                  <TabsContent value="deliverables" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Expected Deliverables</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {project.deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{typeof deliverable === 'string' ? deliverable : JSON.stringify(deliverable)}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                {project.company_info && (
                  <TabsContent value="company" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>About {project.company_name || 'Company'}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                          {project.company_info}
                        </p>
                        <Button variant="outline">View Other Openings</Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{project.company_name?.substring(0, 2).toUpperCase() || 'NA'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{project.company_name || 'Company'}</p>
                      <p className="text-sm text-muted-foreground">{project.applicants_count || 0} applicants</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Facts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.duration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{project.duration}</span>
                    </div>
                  )}
                  {project.status && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="outline">{project.status}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Credential</span>
                    <span className="font-medium">{project.credential !== false ? 'Yes' : 'No'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
