import { useState, useMemo, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MagnifyingGlassIcon,
  FadersHorizontalIcon,
  SparkleIcon,
  XIcon,
  BriefcaseIcon
} from "@phosphor-icons/react";
import { useFetchOpenProjects } from "@/hooks/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const BrowseProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // We default to showing matching scores if the user is a student
  const { profile } = useAuth();
  const { toast } = useToast();
  const { projects, loading, error } = useFetchOpenProjects();

  const isStudent = profile?.role === 'student';

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

  // Simple skill-based match score using profile skills
  const studentSkills: string[] = useMemo(() => {
    if (isStudent && profile?.skills) {
      return profile.skills;
    }
    return [];
  }, [profile, isStudent]);

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
  }, [projects, searchQuery, skillFilter, durationFilter, budgetFilter, studentSkills]);

  const clearFilters = () => {
    setSearchQuery("");
    setSkillFilter("all");
    setDurationFilter("all");
    setBudgetFilter("all");
  };

  const hasActiveFilters =
    searchQuery || skillFilter !== "all" || durationFilter !== "all" || budgetFilter !== "all";

  // Helper to style the match badge
  const getMatchStyles = (score: number) => {
    if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
    if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Hero Discovery Section ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-card border-b border-border pt-16 pb-12 px-6">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-70 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 font-display">
            Discover Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Browse real-world projects from verified businesses. Filter by your skills, availability, and budget to find the perfect match for your next career step.
          </p>
        </div>
      </section>

      {/* ── Sticky Command Bar ────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-3 items-center">

            {/* Search Input */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search projects, companies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 pr-4 rounded-xl bg-card border-border text-base shadow-xs focus-visible:ring-primary transition-all w-full"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex w-full lg:hidden gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 h-12 rounded-xl bg-card"
              >
                <FadersHorizontalIcon className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="h-12 px-4 rounded-xl text-muted-foreground">
                  Clear
                </Button>
              )}
            </div>

            {/* Inline Filters (Desktop) / Dropdown (Mobile) */}
            <div className={cn(
              "w-full lg:w-auto flex-col lg:flex-row gap-3",
              showFilters ? "flex" : "hidden lg:flex"
            )}>
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[160px] rounded-xl bg-card border-border shadow-xs">
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={durationFilter} onValueChange={setDurationFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[160px] rounded-xl bg-card border-border shadow-xs">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">Sprint (≤10 hrs)</SelectItem>
                  <SelectItem value="medium">Standard (11–20 hrs)</SelectItem>
                  <SelectItem value="long">Extended (&gt;20 hrs)</SelectItem>
                </SelectContent>
              </Select>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="h-12 w-full lg:w-[160px] rounded-xl bg-card border-border shadow-xs">
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="0-500">Up to £500</SelectItem>
                  <SelectItem value="500-1000">£500 – £1,000</SelectItem>
                  <SelectItem value="1000+">£1,000+</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="hidden lg:flex h-12 w-12 p-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Clear filters"
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Results Metadata */}
        {!loading && (
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground">{filtered.length}</span> of <span className="text-foreground">{projects.length}</span> projects
            </p>
          </div>
        )}

        {/* Loading State Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-[320px] p-6 flex flex-col justify-between border-border bg-card/50 shadow-sm rounded-2xl">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-1/3 rounded-md" />
                  <Skeleton className="h-7 w-3/4 rounded-md" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Live Project Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => {
              const company = project.company_name ?? project.business_name ?? "Unknown Company";
              const showBadge = isStudent && project.matchScore > 0;

              return (
                <div key={project.id} className="relative group transition-all duration-200 hover:-translate-y-1">

                  {/* Integrated Match Badge */}
                  {showBadge && (
                    <div className="absolute -top-3 right-4 z-10">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-md",
                          "ring-1 ring-inset",
                          project.matchScore >= 80
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white ring-emerald-300 shadow-emerald-200"
                            : project.matchScore >= 50
                              ? "bg-gradient-to-r from-violet-500 to-indigo-400 text-white ring-violet-300 shadow-violet-200"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white ring-slate-300 shadow-slate-200"
                        )}
                      >
                        <SparkleIcon weight="fill" className="h-3.5 w-3.5 opacity-90" />
                        {project.matchScore}% Match
                      </div>
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
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center px-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center mb-6 shadow-sm">
              <BriefcaseIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-display">
              {error ? "Unable to load projects" : "No exact matches found"}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-base">
              {error
                ? "We ran into a connection issue while fetching the project board. Please try refreshing."
                : "We couldn't find any projects matching your exact criteria right now. Try broadening your filters."}
            </p>
            {!error && hasActiveFilters && (
              <Button onClick={clearFilters} size="lg" className="rounded-xl shadow-sm">
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseProjects;