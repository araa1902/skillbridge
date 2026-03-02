"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReferenceCard } from "@/components/ReferenceCard";
import { useFetchStudentReferences } from "@/hooks/useReferences";
import { useAuth } from "@/contexts/AuthContext";
import {
  StarIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretDownIcon,
  CaretUpIcon,
  ShareIcon,
  EarIcon,
} from "@phosphor-icons/react";
import { AwardIcon, FilterIcon, TrendingUpIcon } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const StudentReferences = () => {
  const { user } = useAuth();
  const { references, loading, error } = useFetchStudentReferences(user?.id ?? null);

  const [averageRating, setAverageRating] = useState(0);
  const [averageScores, setAverageScores] = useState({
    workQuality: 0,
    communication: 0,
    professionalism: 0,
    technicalSkills: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "highest" | "lowest">("newest");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (references.length === 0) return;
    const avg = references.reduce((sum, ref) => sum + ref.rating, 0) / references.length;
    setAverageRating(Number(avg.toFixed(1)));
    setAverageScores({
      workQuality: Number(
        (references.reduce((sum, ref) => sum + ref.work_quality, 0) / references.length).toFixed(1)
      ),
      communication: Number(
        (references.reduce((sum, ref) => sum + ref.communication, 0) / references.length).toFixed(1)
      ),
      professionalism: Number(
        (references.reduce((sum, ref) => sum + ref.professionalism, 0) / references.length).toFixed(1)
      ),
      technicalSkills: Number(
        (references.reduce((sum, ref) => sum + ref.technical_skills, 0) / references.length).toFixed(1)
      ),
    });
  }, [references]);

  // ── Filtered & sorted references ──────────────────────────────────────────
  const filteredReferences = useMemo(() => {
    let result = [...references];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.project_title?.toLowerCase().includes(q) ||
          r.employer_name?.toLowerCase().includes(q) ||
          r.company_name?.toLowerCase().includes(q) ||
          r.overall_feedback?.toLowerCase().includes(q)
      );
    }
    if (sortOrder === "highest") result.sort((a, b) => b.rating - a.rating);
    else if (sortOrder === "lowest") result.sort((a, b) => a.rating - b.rating);
    return result;
  }, [references, searchQuery, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredReferences.length / ITEMS_PER_PAGE));
  const paginatedReferences = filteredReferences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when search/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOrder]);

  // ── Project groups for the "By Project" tab ────────────────────────────────
  const projectGroups = useMemo(() => {
    const map: Record<string, { projectId: string; project: string; avg: number; refs: typeof references }> = {};
    references.forEach((ref) => {
      if (!map[ref.project_id]) {
        map[ref.project_id] = { projectId: ref.project_id, project: ref.project_title, avg: 0, refs: [] };
      }
      map[ref.project_id].refs.push(ref);
    });
    return Object.values(map).map((g) => ({
      ...g,
      avg: Number((g.refs.reduce((s, r) => s + r.rating, 0) / g.refs.length).toFixed(1)),
    }));
  }, [references]);

  const toggleProject = (projectId: string) =>
    setExpandedProjects((prev) => ({ ...prev, [projectId]: !prev[projectId] }));

  // ── PDF exports ────────────────────────────────────────────────────────────
  const handleExportReferencesPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 0;

    // --- Header Section ---
    doc.setFillColor(15, 168, 120); // Electric Teal (#0FA878)
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Reference Portfolio", 20, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Issued by SkillBridge", 20, 32);

    // --- Student Info ---
    y = 55;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT", 20, y);
    doc.text("DATE GENERATED", 140, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(user?.user_metadata?.full_name || "SkillBridge Student", 20, y);
    doc.text(new Date().toLocaleDateString(), 140, y);

    y += 15;
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, pageWidth - 20, y);
    y += 15;

    // --- References ---
    references.forEach((ref, idx) => {
      // Check for page break
      if (y > 240) {
        doc.addPage();
        y = 30;
      }

      // Project Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 168, 120);
      doc.text(ref.project_title, 20, y);
      y += 8;

      // Employer & Rating
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "bold");
      doc.text(`${ref.employer_name} @ ${ref.company_name}`, 20, y);

      doc.setTextColor(249, 168, 37); // Accent Amber
      doc.text(`Score: ${ref.rating.toFixed(1)} / 5.0`, 140, y);
      y += 8;

      // Feedback Text
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      const wrapped = doc.splitTextToSize(ref.overall_feedback, pageWidth - 40);
      doc.text(wrapped, 20, y);
      y += (wrapped.length * 5) + 12;

      // Card separator
      if (idx < references.length - 1) {
        doc.setDrawColor(245, 245, 245);
        doc.line(20, y - 6, pageWidth - 20, y - 6);
      }
    });

    // Footer
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 35, 285);
    }

    doc.save(`${(user?.user_metadata?.full_name || "student").replace(/\s+/g, "_")}_references.pdf`);
  };

  const handleExportProjectPdf = async (projectTitle: string, refs: typeof references) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 0;

    // --- Header Section ---
    doc.setFillColor(15, 168, 120);
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Project Reference Report", 20, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(projectTitle, 20, 32);

    // --- Details ---
    y = 55;
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(user?.user_metadata?.full_name || "Student", 45, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL REVIEWS:", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(refs.length.toString(), 55, y);

    y += 15;
    doc.setDrawColor(230, 230, 230);
    doc.line(20, y, pageWidth - 20, y);
    y += 15;

    refs.forEach((ref, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 30;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 168, 120);
      doc.text(`Reference from ${ref.employer_name}`, 20, y);
      y += 6;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${ref.company_name} — Rating: ${ref.rating}/5`, 20, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const wrapped = doc.splitTextToSize(ref.overall_feedback, pageWidth - 40);
      doc.text(wrapped, 20, y);
      y += (wrapped.length * 5) + 15;
    });

    doc.save(`${projectTitle.replace(/\s+/g, "_")}_references.pdf`);
  };

  // ── Auth guard ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Please sign in to view your references.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">Professional References</h1>
            <p className="text-gray-500">Verified feedback from employers and project supervisors</p>
          </div>
          {references.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleExportReferencesPdf}>
                <DownloadSimpleIcon className="w-4 h-4 mr-2" /> Export All
              </Button>
              {/* <Button size="sm">
                <ShareIcon className="w-4 h-4 mr-2" /> Share Profile
              </Button> */}
            </div>
          )}
        </div>

        {/* ── Stats overview ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Average Rating",
              value: averageRating,
              icon: <StarIcon className="w-6 h-6 text-yellow-500" />,
              badge: `${references.length} reviews`,
            },
            { label: "Work Quality", value: averageScores.workQuality, icon: <AwardIcon className="w-6 h-6 text-blue-500" /> },
            { label: "Communication", value: averageScores.communication, icon: <EarIcon className="w-6 h-6 text-green-500" /> },
            { label: "Technical Skills", value: averageScores.technicalSkills, icon: <AwardIcon className="w-6 h-6 text-purple-500" /> },
          ].map(({ label, value, icon, badge }) => (
            <Card key={label}>
              <CardContent className="p-4">
                {loading ? (
                  <Skeleton className="h-16 w-full" />
                ) : (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      {icon}
                      {badge && (
                        <Badge variant="secondary" className="text-xs">{badge}</Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              All References
              {references.length > 0 && (
                <Badge variant="secondary" className="ml-2">{references.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="by-project">
              By Project
              {projectGroups.length > 0 && (
                <Badge variant="secondary" className="ml-2">{projectGroups.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ════════════════ ALL REFERENCES ════════════════ */}
          <TabsContent value="all" className="mt-6">

            {/* Search + Sort bar */}
            {references.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    className="pl-9"
                    placeholder="Search by project, employer, or keyword…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as typeof sortOrder)}
                  >
                    <SelectTrigger className="w-[180px] h-9 gap-2">
                      <div className="flex items-center gap-2">
                        <FilterIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="highest">Highest Rated</SelectItem>
                      <SelectItem value="lowest">Lowest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-4">
                {Array(3).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            )}

            {/* Error state */}
            {error && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-red-600">Error loading references: {error}</p>
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {!loading && !error && references.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <AwardIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No references yet</h3>
                  <p className="text-gray-500 mb-6 text-sm max-w-sm mx-auto">
                    Complete projects and request references from employers to build your professional reputation.
                  </p>
                  <a href="/browse-projects" className="btn btn-primary btn-sm mt-2">
                    Browse Projects
                  </a>
                </CardContent>
              </Card>
            )}

            {/* No search results state */}
            {!loading && !error && references.length > 0 && filteredReferences.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <MagnifyingGlassIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No references match <strong>"{searchQuery}"</strong>
                  </p>
                  <Button variant="ghost" className="mt-3" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Paginated reference cards */}
            {!loading && !error && paginatedReferences.length > 0 && (
              <>
                <p className="text-sm text-gray-400 mb-4">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredReferences.length)} of{" "}
                  {filteredReferences.length} reference{filteredReferences.length !== 1 ? "s" : ""}
                </p>

                <div className="space-y-4 mb-6">
                  {paginatedReferences.map((reference) => (
                    <ReferenceCard key={reference.id} reference={reference} />
                  ))}
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <CaretLeftIcon className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => setCurrentPage(page)}
                        className="w-9"
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <CaretRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* ════════════════ BY PROJECT ════════════════ */}
          <TabsContent value="by-project" className="mt-6">
            {loading && (
              <div className="space-y-4">
                {Array(3).fill(null).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            )}

            {!loading && projectGroups.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-gray-500">No project references found.</p>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {projectGroups.map((group) => {
                const isOpen = expandedProjects[group.projectId] ?? false;
                return (
                  <Card key={group.projectId} className="overflow-hidden">
                    <button
                      onClick={() => toggleProject(group.projectId)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{group.project}</p>
                        <p className="text-sm text-gray-500">
                          {group.refs.length} reference{group.refs.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <StarIcon className="w-3 h-3 text-yellow-500" />
                          {group.avg}/5
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportProjectPdf(group.project, group.refs);
                          }}
                          className="hidden sm:flex"
                        >
                          <DownloadSimpleIcon className="w-3 h-3 mr-1" /> Export
                        </Button>
                        {isOpen
                          ? <CaretUpIcon className="w-5 h-5 text-gray-400" />
                          : <CaretDownIcon className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </button>

                    {/* Expanded references */}
                    {isOpen && (
                      <div className="border-t px-4 pb-4 pt-3 space-y-3 bg-gray-50/50">
                        {group.refs.map((ref) => (
                          <ReferenceCard key={ref.id} reference={ref} />
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default StudentReferences;
