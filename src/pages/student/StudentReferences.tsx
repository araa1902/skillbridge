import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ReferenceCard } from "@/components/ReferenceCard";
import { useFetchStudentReferences } from "@/hooks/useReferences";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Medal as Award, TrendUp as TrendingUp, DownloadSimple as Download, ShareNetwork as Share2 } from "@phosphor-icons/react";

const StudentReferences = () => {
  const { user, profile } = useAuth();
  const { references, loading, error } = useFetchStudentReferences(user?.id ?? null);
  const [averageRating, setAverageRating] = useState(0);
  const [averageScores, setAverageScores] = useState({
    workQuality: 0,
    communication: 0,
    professionalism: 0,
    technicalSkills: 0,
  });

  useEffect(() => {
    if (references.length === 0) return;

    const avg =
      references.reduce((sum, ref) => sum + ref.rating, 0) / references.length;
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

  const projectsMap = references.reduce(
    (acc, ref) => {
      if (!acc[ref.project_id]) acc[ref.project_id] = { ratings: [], refs: [] };
      acc[ref.project_id].ratings.push(ref.rating);
      acc[ref.project_id].refs.push(ref);
      return acc;
    },
    {} as Record<string, { ratings: number[]; refs: typeof references }>
  );

  const projectSummaries = Object.entries(projectsMap).map(([project, data]) => {
    const avg = data.ratings.reduce((s, r) => s + r, 0) / data.ratings.length;
    return { project, count: data.refs.length, avg: Number(avg.toFixed(2)), refs: data.refs };
  });

  const handleExportReferencesPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Professional References", 20, y);
    y += 10;
    doc.setFontSize(11);
    references.forEach((ref, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont(undefined, "bold");
      doc.text(`${idx + 1}. ${ref.project_title}`, 20, y);
      y += 6;
      doc.setFont(undefined, "normal");
      doc.text(
        `${ref.employer_name} @ ${ref.company_name} | Rating: ${ref.rating}/5`,
        20,
        y
      );
      y += 5;
      const wrapped = doc.splitTextToSize(ref.overall_feedback, 170);
      wrapped.forEach((line: string) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 24, y);
        y += 5;
      });
      y += 4;
    });
    doc.save("references.pdf");
  };

  const handleExportProjectPdf = async (projectTitle: string, refs: typeof references) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text(`Project: ${projectTitle}`, 20, y);
    y += 8;
    doc.setFontSize(11);
    refs.forEach((ref, idx) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont(undefined, "bold");
      doc.text(`${idx + 1}. ${ref.employer_name} (${ref.rating}/5)`, 20, y);
      y += 5;
      doc.setFont(undefined, "normal");
      const wrapped = doc.splitTextToSize(ref.overall_feedback, 170);
      wrapped.forEach((line) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, 24, y);
        y += 4;
      });
      y += 3;
    });
    doc.save(`${projectTitle.replace(/\s+/g, "_")}_references.pdf`);
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Professional References</h1>
          <p className="text-xl text-gray-600">
            Verified feedback from employers and project supervisors
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {references.length} reviews
                    </Badge>
                  </div>
                  <p className="text-3xl font-bold mb-1">{averageRating}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <Award className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-3xl font-bold mb-1">{averageScores.workQuality}</p>
                  <p className="text-sm text-gray-600">Work Quality</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-3xl font-bold mb-1">{averageScores.communication}</p>
                  <p className="text-sm text-gray-600">Communication</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              {loading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <Award className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-3xl font-bold mb-1">{averageScores.technicalSkills}</p>
                  <p className="text-sm text-gray-600">Technical Skills</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {references.length > 0 && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Share Your References</h3>
                  <p className="text-sm text-gray-600">
                    Make your profile stand out with verified employer feedback
                  </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" onClick={handleExportReferencesPdf}>
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Summary */}
        {projectSummaries.length > 0 && (
          <Card className="mb-8 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Project Reference Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {projectSummaries.map((p) => (
                  <div
                    key={p.project}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-md border p-3 bg-white"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{p.project}</p>
                      <p className="text-xs text-gray-500">
                        {p.count} reference{p.count > 1 ? "s" : ""} • Avg {p.avg}/5
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {p.avg}/5
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportProjectPdf(p.project, p.refs)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All References */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">
            All References ({references.length})
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-red-600">Error loading references: {error}</p>
              </CardContent>
            </Card>
          ) : references.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No references yet</h3>
                <p className="text-gray-600 mb-6">
                  Complete projects and request references from employers to build your professional reputation
                </p>
                <Button>Browse Projects</Button>
              </CardContent>
            </Card>
          ) : (
            references.map((reference) => (
              <ReferenceCard key={reference.id} reference={reference} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentReferences;
