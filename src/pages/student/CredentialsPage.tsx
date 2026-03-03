import { useAuth } from "@/contexts/AuthContext"
import { useFetchStudentCredentials } from "@/hooks/useCredentials"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Medal as Award, Star, Buildings as Building2, CalendarBlank as CalendarDays, SealCheck as BadgeCheck, Sparkle as Sparkles, ChatCircle as MessageSquare, ShieldCheck as ShieldCheck, CheckCircleIcon, QuotesIcon, DownloadSimple, MagnifyingGlass as Search } from "@phosphor-icons/react"
import { Calendar, Quote } from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */

/** Map a 1-5 rating to a readable label */
function ratingLabel(r: number) {
  return ["", "Poor", "Fair", "Good", "Great", "Excellent"][Math.round(r)] ?? r
}

/** Deterministic gradient per credential — cycles through a curated palette */
const GRADIENTS = [
  "from-teal-500 to-emerald-400",
  "from-violet-500 to-blue-500",
  "from-blue-500 to-cyan-400",
  "from-amber-500 to-orange-400",
  "from-rose-500 to-pink-400",
  "from-indigo-500 to-violet-400",
]
function gradientFor(index: number) {
  return GRADIENTS[index % GRADIENTS.length]
}

/* ─────────────────────────────────────────────────────────────────────────────
   LOADING SKELETONS
───────────────────────────────────────────────────────────────────────────── */

function CredentialSkeleton() {
  return (
    <div className="surface overflow-hidden flex flex-col">
      <Skeleton className="h-36 w-full rounded-none" />
      <div className="p-5 flex flex-col gap-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-3 w-32 mt-1" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   CREDENTIAL CARD
───────────────────────────────────────────────────────────────────────────── */

interface Credential {
  id: string
  project_title?: string
  business_name?: string
  skills_verified?: string[]
  feedback?: string
  rating?: number
  issued_at: string
}

function CredentialCard({ credential, studentName }: { credential: Credential; index?: number; studentName?: string }) {
  const hasRating = credential.rating !== undefined && credential.rating !== null;
  const hasSkills = credential.skills_verified && credential.skills_verified.length > 0;

  const handleDownloadCredential = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("landscape", "mm", "a4");

    // Dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // Background Color
    doc.setFillColor(250, 252, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Outer Border (Navy)
    doc.setDrawColor(20, 30, 70);
    doc.setLineWidth(4);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    // Inner Border (Gold/Accent)
    doc.setDrawColor(200, 170, 80);
    doc.setLineWidth(1);
    doc.rect(margin + 4, margin + 4, pageWidth - 2 * margin - 8, pageHeight - 2 * margin - 8);

    // Header with title
    doc.setFont("times", "bold");
    doc.setFontSize(36);
    doc.setTextColor(20, 30, 70);
    const title = "CERTIFICATE OF ACHIEVEMENT";
    doc.text(title, pageWidth / 2, margin + 35, { align: "center" });

    // Ribbon / small text
    doc.setFont("helvetica", "italic");
    doc.setFontSize(14);
    doc.setTextColor(100, 110, 130);
    doc.text("This certifies that", pageWidth / 2, margin + 55, { align: "center" });

    // Student Name
    doc.setFont("times", "bolditalic");
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    const nameToPrint = studentName || "Skilled Student";
    doc.text(nameToPrint, pageWidth / 2, margin + 75, { align: "center" });

    // Underline for name
    doc.setDrawColor(200, 170, 80);
    doc.setLineWidth(0.5);
    const nameWidth = doc.getTextWidth(nameToPrint);
    doc.line(pageWidth / 2 - nameWidth / 2 - 10, margin + 80, pageWidth / 2 + nameWidth / 2 + 10, margin + 80);

    // "has successfully completed"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(100, 110, 130);
    doc.text("has successfully completed the project", pageWidth / 2, margin + 95, { align: "center" });

    // Project title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 40, 80);
    const credTitle = credential.project_title ?? "Project Credential";
    doc.text(credTitle, pageWidth / 2, margin + 110, { align: "center" });

    // Issuer and Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);

    // Split lower section to Columns
    doc.setFont("times", "bold");
    doc.text("ISSUED BY", margin + 30, pageHeight - margin - 40);
    doc.setFont("helvetica", "normal");
    doc.text(credential.business_name ?? "SkillBridge Employer", margin + 30, pageHeight - margin - 30);

    doc.setFont("times", "bold");
    doc.text("DATE", pageWidth - margin - 30, pageHeight - margin - 40, { align: "right" });
    doc.setFont("helvetica", "normal");
    const dateText = new Date(credential.issued_at).toLocaleDateString();
    doc.text(dateText, pageWidth - margin - 30, pageHeight - margin - 30, { align: "right" });

    // Center Signature / Logo area
    doc.setDrawColor(20, 30, 70);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 25, pageHeight - margin - 30, pageWidth / 2 + 25, pageHeight - margin - 30);
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text("SkillBridge Verified", pageWidth / 2, pageHeight - margin - 22, { align: "center" });

    // Skills
    if (hasSkills) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const skillsStr = `Verified Skills: ${credential.skills_verified!.join(", ")}`;
      doc.text(skillsStr, pageWidth / 2, pageHeight - margin - 15, { align: "center" });
    }

    // Save the PDF
    doc.save(`${(credential.project_title ?? "credential").replace(/\s+/g, "_").toLowerCase()}_certificate.pdf`);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">

      <div className="p-6 flex flex-col flex-1 gap-5">

        {/* ── Header: Issuer & Rating ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {credential.business_name || "Unknown Company"}
              </h4>
            </div>
          </div>

          {hasRating && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-700">
                {Number(credential.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* ── Project Details & Feedback ── */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-snug line-clamp-2">
            {credential.project_title || "Untitled Project"}
          </h3>

          {credential.feedback && (
            <div className="relative mt-4">
              <QuotesIcon className="absolute -top-1 -left-1 w-8 h-8 text-slate-100 rotate-180 -z-10" />
              <p className="text-sm text-slate-600 leading-relaxed pl-4 border-l-2 border-slate-200">
                "{credential.feedback}"
              </p>
            </div>
          )}
        </div>

        {/* ── Footer: Date & CTA ── */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={credential.issued_at}>
              Issued {new Date(credential.issued_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </div>
          <button
            type="button"
            onClick={handleDownloadCredential}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 hover:underline cursor-pointer transition-colors"
          >
            Export Credential <DownloadSimple className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function CredentialsPage() {
  const { user, profile } = useAuth()
  const { credentials, loading, error } = useFetchStudentCredentials(user?.id || null)

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredAndSortedCredentials = useMemo(() => {
    let result = [...credentials];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        (c.project_title?.toLowerCase().includes(q)) ||
        (c.business_name?.toLowerCase().includes(q)) ||
        (c.skills_verified?.some(s => s.toLowerCase().includes(q)))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "recent") return new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime();
      if (sortBy === "oldest") return new Date(a.issued_at).getTime() - new Date(b.issued_at).getTime();
      if (sortBy === "name") return (a.project_title || "").localeCompare(b.project_title || "");
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return result;
  }, [credentials, searchQuery, sortBy]);

  /* ── Error state ── */
  if (error) {
    return (
      <div className="page-container py-10">
        <div className="alert alert--error">
          <Award className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-600 text-sm">Failed to load credentials</p>
            <p className="text-sm mt-0.5 opacity-80">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container py-10">

      {/* ── Page header ── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Credentials
            </h1>
            <p className="text-muted-foreground mt-2 text-[0.9375rem]">
              Verified badges and certificates earned from completed projects
            </p>
          </div>

          {/* Summary pill — only shown when data is loaded */}
          {!loading && credentials.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/6 border border-primary/16 self-start sm:self-auto">
              <Award className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm font-700 text-primary" style={{ fontFamily: "var(--font-display)" }}>
                {credentials.length} credential{credentials.length !== 1 ? "s" : ""} earned
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters ── */}
      {!loading && credentials.length > 0 && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search credentials, skills, or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-slate-50 border-slate-200 text-sm"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-slate-50 border-slate-200">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Project Name (A-Z)</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* ── Loading ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CredentialSkeleton key={i} />
          ))}
        </div>

        /* ── Empty state (No credentials at all) ── */
      ) : credentials.length === 0 ? (
        <div className="surface">
          <div className="empty-state py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
              style={{ background: "hsl(var(--primary-subtle))" }}
            >
              <Award className="w-8 h-8" style={{ color: "hsl(var(--primary))" }} />
            </div>
            <p className="empty-state__title">No credentials yet</p>
            <p className="empty-state__body">
              Complete projects to earn verified credentials and showcase your skills to employers.
            </p>
            <a href="/browse-projects" className="btn btn-primary btn-sm mt-2">
              Browse Projects
            </a>
          </div>
        </div>

        /* ── Empty state (Search yielded no results) ── */
      ) : filteredAndSortedCredentials.length === 0 ? (
        <div className="surface">
          <div className="empty-state py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1 bg-slate-100"
            >
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="empty-state__title">No matches found</p>
            <p className="empty-state__body">
              Try adjusting your search query or filters.
            </p>
          </div>
        </div>

        /* ── Credential grid ── */
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCredentials.map((credential, i) => (
            <CredentialCard key={credential.id} credential={credential} index={i} studentName={profile?.full_name} />
          ))}
        </div>
      )}
    </div>
  )
}
