import { useState, useMemo, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, Briefcase, Sparkles, Star } from "lucide-react";
import { useFetchOpenProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BrowseProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showMatchingScores, setShowMatchingScores] = useState(true);

  const { profile } = useAuth();
  const { toast } = useToast();
  const { projects, loading, error } = useFetchOpenProjects();

  // Show error toast once if the fetch fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load projects",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Simple skill-based match score using profile skills (student only)
  const studentSkills: string[] = useMemo(() => [], []); // extend with profile.skills in Phase 4

  const calculateMatchScore = (requiredSkills: string[]) => {
    if (studentSkills.length === 0 || requiredSkills.length === 0) return 0;
    const matches = requiredSkills.filter(s =>
      studentSkills.some(ps => ps.toLowerCase() === s.toLowerCase())
    ).length;
    return Math.round((matches / requiredSkills.length) * 100);
  };

  // Collect unique skills for filter dropdown
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.required_skills.forEach(s => set.add(s)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects
      .map(p => ({
        ...p,
        matchScore: calculateMatchScore(p.required_skills),
      }))
      .filter(p => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.company_name ?? "").toLowerCase().includes(q) ||
          (p.business_name ?? "").toLowerCase().includes(q);

        const matchesSkill =
          skillFilter === "all" || p.required_skills.includes(skillFilter);

        const matchesDuration =
          durationFilter === "all" ||
          (durationFilter === "short" && p.duration_hours <= 10) ||
          (durationFilter === "medium" && p.duration_hours > 10 && p.duration_hours <= 20) ||
          (durationFilter === "long" && p.duration_hours > 20);

        const matchesBudget =
          budgetFilter === "all" ||
          (budgetFilter === "0-500" && p.budget <= 500) ||
          (budgetFilter === "500-1000" && p.budget > 500 && p.budget <= 1000) ||
          (budgetFilter === "1000+" && p.budget > 1000);

        return matchesSearch && matchesSkill && matchesDuration && matchesBudget;
      })
      .sort((a, b) => b.matchScore - a.matchScore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects, searchQuery, skillFilter, durationFilter, budgetFilter, showMatchingScores]);

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("all");
    setDurationFilter("all");
    setBudgetFilter("all");
  };

  const hasActiveFilters =
    searchQuery || skillFilter !== "all" || durationFilter !== "all" || budgetFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
              <p className="text-sm text-gray-600">Discover opportunities matched to your skills and career goals</p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Search + Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                    className="bg-white/70 border-gray-200 text-gray-700"
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                  <Button variant="ghost" onClick={clearFilters} className="text-gray-600 hover:text-gray-800">
                    Clear All
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Skill</label>
                      <Select value={skillFilter} onValueChange={setSkillFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Skill" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Skills</SelectItem>
                          {allSkills.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
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
                          <SelectItem value="short">Sprint (≤10 hrs)</SelectItem>
                          <SelectItem value="medium">Standard (11–20 hrs)</SelectItem>
                          <SelectItem value="long">Extended (&gt;20 hrs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Budget (GBP)</label>
                      <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                        <SelectTrigger className="bg-white/70 border-gray-200">
                          <SelectValue placeholder="Budget" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Budgets</SelectItem>
                          <SelectItem value="0-500">£0 – £500</SelectItem>
                          <SelectItem value="500-1000">£500 – £1,000</SelectItem>
                          <SelectItem value="1000+">£1,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  Search: {searchQuery}
                </Badge>
              )}
              {skillFilter !== "all" && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {skillFilter}
                </Badge>
              )}
              {durationFilter !== "all" && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  {durationFilter}
                </Badge>
              )}
              {budgetFilter !== "all" && (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  £{budgetFilter}
                </Badge>
              )}
            </div>
          )}

          {/* Results header */}
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{filtered.length}</span> of{" "}
                <span className="font-medium">{projects.length}</span> open projects
              </p>
            </div>
          )}

          {/* ── Skeleton grid ─────────────────────────────────────────── */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-64 p-6 flex flex-col gap-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2 mt-auto">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* ── Live project grid ─────────────────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project) => {
                const company =
                  project.company_name ?? project.business_name ?? "Unknown Company";
                return (
                  <div key={project.id} className="relative">
                    {showMatchingScores && project.matchScore > 0 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge
                          className={`${project.matchScore >= 80
                            ? "bg-green-500"
                            : project.matchScore >= 60
                              ? "bg-blue-500"
                              : "bg-orange-500"
                            } text-white border-0 shadow-lg`}
                        >
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {project.matchScore}% Match
                        </Badge>
                      </div>
                    )}
                    <ProjectCard
                      id={project.id}
                      title={project.title}
                      company={company}
                      duration={project.duration_hours}
                      tags={project.required_skills}
                      description={project.description}
                      budget={project.budget}
                      matchScore={showMatchingScores ? project.matchScore : undefined}
                      credential
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────────────── */}
          {!loading && filtered.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/60 mt-8">
              <CardContent className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {error ? "Failed to load projects" : "No projects found"}
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {error
                    ? "There was a problem fetching projects. Please try again."
                    : "We couldn't find any open projects matching your criteria."}
                </p>
                {!error && (
                  <Button onClick={clearFilters} className="bg-gray-600 hover:bg-gray-700">
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseProjects;
