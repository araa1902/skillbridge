import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Briefcase, Clock, DollarSign, MapPin, Star, Sparkles } from "lucide-react";
import { projects } from "@/lib/data";

const BrowseProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showMatchingScores, setShowMatchingScores] = useState(true);

  // Student profile for matching (in real app, this would come from context/state)
  const studentProfile = {
    skills: ["React", "TypeScript", "Python"],
    interests: ["Web Development", "Data Science"],
    careerAspiration: "Full-Stack Developer"
  };

  // Calculate match score for each project
  const calculateMatchScore = (project: any) => {
    let score = 0;
    const projectSkills = project.tags || [];
    
    // Skill matching (40%)
    const skillMatches = projectSkills.filter((skill: string) => 
      studentProfile.skills.some(s => s.toLowerCase() === skill.toLowerCase())
    ).length;
    score += (skillMatches / Math.max(projectSkills.length, 1)) * 40;
    
    // Interest matching (30%)
    const interestMatch = studentProfile.interests.some(interest =>
      project.title.toLowerCase().includes(interest.toLowerCase()) ||
      project.description.toLowerCase().includes(interest.toLowerCase())
    );
    if (interestMatch) score += 30;
    
    // Career path alignment (30%)
    const careerKeywords = ["developer", "engineering", "software"];
    const careerMatch = careerKeywords.some(keyword =>
      project.title.toLowerCase().includes(keyword) ||
      project.description.toLowerCase().includes(keyword)
    );
    if (careerMatch) score += 30;
    
    return Math.min(Math.round(score), 100);
  };

  // Add match scores to projects
  const projectsWithScores = projects.map(project => ({
    ...project,
    matchScore: calculateMatchScore(project)
  }));

  const filteredProjects = projectsWithScores.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = industryFilter === "all" || project.tags.includes(industryFilter);
    const matchesDuration = durationFilter === "all" || project.duration === durationFilter;
    const matchesLocation = locationFilter === "all" || (("location" in project) && (project as any).location === locationFilter);
    
    return matchesSearch && matchesIndustry && matchesDuration && matchesLocation;
  }).sort((a, b) => b.matchScore - a.matchScore); // Sort by match score

  const stats = {
    total: projects.length,
    remote: projects.filter(p => ('location' in p) && (p as any).location === "Remote").length,
    urgent: projects.filter(p => ('urgent' in p) && (p as any).urgent).length,
    avgBudget: (() => {
      const budgets = projects
        .map(p => (p as any).budget)
        .filter(Boolean)
        .map((b: any) => {
          const num = parseInt(String(b).replace(/[^0-9]/g, ''), 10);
          return Number.isNaN(num) ? 0 : num;
        });
      return budgets.length ? Math.round(budgets.reduce((a, n) => a + n, 0) / budgets.length) : 0;
    })(),
  };

  const clearFilters = () => {
    setSearchQuery("");
    setIndustryFilter("all");
    setDurationFilter("all");
    setLocationFilter("all");
    setBudgetFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Hero */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Browse Projects</h1>
                <p className="text-gray-600 mt-1">Discover opportunities matched to your skills and career goals</p>
              </div>
            </div>
          </div>

          {/* AI Matching Toggle */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">AI Career Matching Active</p>
                    <p className="text-sm text-gray-600">Projects sorted by your profile match score</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowMatchingScores(!showMatchingScores)}
                  className="bg-white"
                >
                  {showMatchingScores ? "Hide" : "Show"} Match Scores
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search + Filters Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/70 border-gray-200 text-gray-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-white/70 border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Industry</label>
                      <Select value={industryFilter} onValueChange={setIndustryFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="UX Design">UX Design</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Content">Content</SelectItem>
                          <SelectItem value="Sustainability">Sustainability</SelectItem>
                          <SelectItem value="Video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                      <Select value={durationFilter} onValueChange={setDurationFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Durations</SelectItem>
                          <SelectItem value="3 weeks">3 weeks</SelectItem>
                          <SelectItem value="4 weeks">4 weeks</SelectItem>
                          <SelectItem value="5 weeks">5 weeks</SelectItem>
                          <SelectItem value="6 weeks">6 weeks</SelectItem>
                          <SelectItem value="8 weeks">8 weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="San Francisco">San Francisco</SelectItem>
                          <SelectItem value="London">London</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Range</label>
                      <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Budgets</SelectItem>
                          <SelectItem value="0-1000">$0 - $1,000</SelectItem>
                          <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                          <SelectItem value="2500+">$2,500+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Filters */}
          {(searchQuery || industryFilter !== "all" || durationFilter !== "all" || locationFilter !== "all" || budgetFilter !== "all") && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>

                {searchQuery && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Search: {searchQuery}
                  </Badge>
                )}

                {industryFilter !== "all" && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {industryFilter}
                  </Badge>
                )}

                {durationFilter !== "all" && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {durationFilter}
                  </Badge>
                )}

                {locationFilter !== "all" && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {locationFilter}
                  </Badge>
                )}

                {budgetFilter !== "all" && (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {budgetFilter}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Results header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredProjects.length}</span> of <span className="font-medium">{projects.length}</span> projects
              {showMatchingScores && <span className="text-purple-600 ml-2">• Sorted by match score</span>}
            </p>

            <div className="w-full sm:w-48">
              <Select defaultValue="match">
                <SelectTrigger className="w-full bg-white/70 border-gray-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="budget">Highest Budget</SelectItem>
                  <SelectItem value="duration">Shortest Duration</SelectItem>
                  <SelectItem value="alphabetical">A to Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="relative">
                {showMatchingScores && project.matchScore > 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge 
                      className={`${
                        project.matchScore >= 80 ? 'bg-green-500' :
                        project.matchScore >= 60 ? 'bg-blue-500' :
                        'bg-orange-500'
                      } text-white border-0 shadow-lg`}
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {project.matchScore}% Match
                    </Badge>
                  </div>
                )}
                <ProjectCard {...project} />
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 mt-8">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any projects matching your criteria. Try adjusting your filters or search terms.
                </p>
                <Button onClick={clearFilters} className="bg-gray-600 hover:bg-gray-700">
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseProjects;
