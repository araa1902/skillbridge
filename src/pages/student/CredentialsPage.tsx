import { useAuth } from "@/contexts/AuthContext"
import { useFetchStudentCredentials } from "@/hooks/useCredentials"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Medal as Award, Star, Buildings as Building2, CalendarBlank as CalendarDays, SealCheck as BadgeCheck, Sparkle as Sparkles, ChatCircle as MessageSquare, ShieldCheck as ShieldCheck } from "@phosphor-icons/react"

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

function CredentialCard({ credential, index }: { credential: Credential; index: number }) {
  const grad = gradientFor(index)
  const hasRating = credential.rating !== undefined && credential.rating !== null
  const hasSkills = credential.skills_verified && credential.skills_verified.length > 0

  return (
    <article className="surface overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-border-strong">

      {/* ── Certificate banner ── */}
      <div className={cn("relative bg-gradient-to-br p-5 text-white overflow-hidden", grad)}>
        {/* Decorative ring pattern */}
        <div
          aria-hidden="true"
          className="absolute -right-8 -top-8 w-36 h-36 rounded-full border-[20px] border-white/10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute -right-2 -bottom-6 w-20 h-20 rounded-full border-[12px] border-white/10 pointer-events-none"
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          {/* Badge icon */}
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Award className="w-5 h-5 text-white" strokeWidth={2} />
          </div>

          {/* Rating */}
          {hasRating && (
            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
              <span className="text-sm font-700 text-white tabular-nums">{credential.rating}/5</span>
              <span className="text-[0.6875rem] text-white/75">{ratingLabel(credential.rating!)}</span>
            </div>
          )}
        </div>

        {/* Project title */}
        <div className="relative z-10 mt-4">
          <h3
            className="text-base font-700 text-white leading-snug line-clamp-2"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}
          >
            {credential.project_title || "Untitled Project"}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <BadgeCheck className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
            <span className="text-xs text-white/75">Verified Credential</span>
          </div>
        </div>
      </div>

      {/* ── Credential body ── */}
      <div className="flex flex-col flex-1 gap-4 p-5">

        {/* Issuer */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-600 uppercase tracking-[0.07em] text-muted-foreground leading-none">
              Issued by
            </p>
            <p className="text-sm font-600 text-foreground mt-0.5 truncate" style={{ fontFamily: "var(--font-display)" }}>
              {credential.business_name || "Unknown Company"}
            </p>
          </div>
        </div>

        {/* Skills */}
        {hasSkills ? (
          <div>
            <p className="flex items-center gap-1.5 text-[0.6875rem] font-700 uppercase tracking-[0.07em] text-muted-foreground mb-2">
              <ShieldCheck className="w-3 h-3" />
              Skills Verified
            </p>
            <div className="flex flex-wrap gap-1.5">
              {credential.skills_verified!.map((skill, idx) => (
                <span key={idx} className="tag tag--active text-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 border border-dashed border-border">
            <Sparkles className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">No specific skills tagged</p>
          </div>
        )}

        {/* Feedback quote */}
        {credential.feedback && (
          <div className="surface-flat rounded-xl p-3.5 flex gap-2.5">
            <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
              "{credential.feedback}"
            </p>
          </div>
        )}

        {/* Date — pinned to bottom */}
        <div className="flex items-center gap-1.5 pt-3 mt-auto border-t border-border/60">
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Issued{" "}
            <time dateTime={credential.issued_at}>
              {new Date(credential.issued_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </p>
        </div>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */

export default function CredentialsPage() {
  const { user } = useAuth()
  const { credentials, loading, error } = useFetchStudentCredentials(user?.id || null)

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
        <p className="eyebrow mb-2">Portfolio</p>
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
              Credentials &amp; Certificates
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

      {/* ── Loading ── */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CredentialSkeleton key={i} />
          ))}
        </div>

        /* ── Empty state ── */
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

        /* ── Credential grid ── */
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential, i) => (
            <CredentialCard key={credential.id} credential={credential} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
