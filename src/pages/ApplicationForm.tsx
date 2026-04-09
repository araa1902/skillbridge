import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  UploadSimple as Upload,
  X,
  FileText,
  CheckCircle as CheckCircle2,
  Calendar,
  SpinnerGap as Loader2,
  Briefcase,
  Buildings as Building2,
  Clock,
  CurrencyGbp as PoundSterling,
  Sparkle as Sparkles,
  Plus,
  CaretRight as ChevronRight,
  WarningCircle as AlertCircle,
  ArrowLeft,
  MagnifyingGlass as Search
} from "@phosphor-icons/react"
import { ALL_SKILLS } from "@/data/skills"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { insertApplication } from "@/hooks/useApplications"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { AlertDialogHeader } from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DatePicker } from "@/components/ui/date-picker"

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */

interface ProjectPreview {
  id: string
  title: string
  status: string
  required_skills: string[]
  duration_hours: number | null
  budget: number | null
  profiles: { full_name: string | null; company_name: string | null } | null
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP CONFIG
───────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Cover Letter", shortLabel: "Letter" },
  { id: 2, label: "Skills", shortLabel: "Skills" },
  { id: 3, label: "Attachments", shortLabel: "Files" },
  { id: 4, label: "Availability", shortLabel: "Dates" },
  { id: 5, label: "Review", shortLabel: "Review" },
]

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

/** Top progress stepper */
function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Application steps" className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = current > step.id
        const active = current === step.id
        const future = current < step.id
        const isLast = idx === STEPS.length - 1

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-700 transition-all duration-200",
                  "border-2",
                  done && "bg-primary border-primary text-white",
                  active && "bg-primary border-primary text-white shadow-[0_0_0_4px_hsl(var(--primary)/0.14)]",
                  future && "bg-card border-border text-muted-foreground"
                )}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[0.6875rem] font-600 whitespace-nowrap hidden sm:block",
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.shortLabel}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300",
                  done ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

/** Project context pill — shown in top header area */
function ProjectBanner({ project }: { project: ProjectPreview }) {
  const company = project.profiles?.company_name ?? project.profiles?.full_name ?? "Unknown company"
  const durationLabel = project.duration_hours === 0
    ? "Ongoing"
    : project.duration_hours
      ? `${project.duration_hours} hrs`
      : "Flexible"

  return (
    <div className="surface p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-primary/8 border border-primary/16 flex items-center justify-center flex-shrink-0">
        <Briefcase className="w-5 h-5 text-primary" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1
          className="text-base font-700 text-foreground truncate"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.018em" }}
        >
          {project.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="w-3 h-3" />{company}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />{durationLabel}
          </span>
          {project.budget && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <PoundSterling className="w-3 h-3" />£{project.budget.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <span className="badge badge--success self-start sm:self-center flex-shrink-0">
        Open
      </span>
    </div>
  )
}

/** Drag-and-drop file zone */
function FileDropZone({
  files,
  onAdd,
  onRemove,
  inputRef,
}: {
  files: File[]
  onAdd: (f: File[]) => void
  onRemove: (i: number) => void
  inputRef: React.RefObject<HTMLInputElement>
}) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    onAdd(Array.from(e.dataTransfer.files))
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload files"
        className={cn(
          "flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all duration-150 cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
          <Upload className={cn("w-5 h-5 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-600 text-foreground">
            {dragging ? "Drop files here" : "Click to upload or drag & drop"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX, JPG, PNG · Max 10 MB each</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.jpg,.png"
          multiple
          onChange={(e) => onAdd(Array.from(e.target.files ?? []))}
        />
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/30"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-500 text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="icon-btn icon-btn--sm text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   REVIEW STEP — read-only summary before submit
───────────────────────────────────────────────────────────────────────────── */

function ReviewSection({
  label,
  children,
  onEdit,
  step,
}: {
  label: string
  children: React.ReactNode
  onEdit: (step: number) => void
  step: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-700 uppercase tracking-[0.08em] text-muted-foreground"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {label}
        </p>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="text-xs font-600 text-primary hover:text-primary/80 transition-colors"
        >
          Edit
        </button>
      </div>
      <div>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

const ApplicationForm = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, profile } = useAuth()

  /* ── Project fetch ── */
  const [project, setProject] = useState<ProjectPreview | null>(null)
  const [projectLoading, setProjectLoading] = useState(true)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [hasApplied, setHasApplied] = useState(false)
  const [activeApplicationCount, setActiveApplicationCount] = useState<number>(0)

  const loadProject = useCallback(async () => {
    if (!id) return
    setProjectLoading(true)

    const { data, error } = await supabase
      .from("projects")
      .select(`
        id, title, status, required_skills, duration_hours, budget,
        profiles!projects_business_id_fkey ( full_name, company_name )
      `)
      .eq("id", id)
      .maybeSingle()

    if (error || !data) {
      setProjectError(error?.message ?? "Project not found")
      setProjectLoading(false)
      return
    }

    const p = data as any
    if (p.status !== "open") {
      setProjectError("This project is no longer accepting applications.")
      setProjectLoading(false)
      return
    }

    setProject(p as ProjectPreview)

    if (user?.id) {
      const { data: existing } = await supabase
        .from("applications")
        .select("id")
        .eq("project_id", id)
        .eq("student_id", user.id)
        .maybeSingle()
      if (existing) setHasApplied(true)

      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("student_id", user.id)
        .in("status", ["pending", "reviewing"])
      
      if (count !== null) {
        setActiveApplicationCount(count)
      }
    }

    setProjectLoading(false)
  }, [id, user?.id])

  useEffect(() => { loadProject() }, [loadProject])

  /* ── Multi-step form state ── */
  const [step, setStep] = useState(1)
  const [coverLetter, setCoverLetter] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [filteredSkills, setFilteredSkills] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [preloadedCvUrl, setPreloadedCvUrl] = useState<string | null>(null)
  const [preloadedCvName, setPreloadedCvName] = useState<string | null>(null)
  const [availability, setAvailability] = useState<Date | undefined>(undefined)
  const [confirmed, setConfirmed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  /* ── State Persistence (Session Storage) ── */
  const STORAGE_KEY = id ? `application_draft_${id}` : null

  // Load state on mount
  useEffect(() => {
    if (!STORAGE_KEY) return
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.coverLetter) setCoverLetter(data.coverLetter)
        if (data.selectedSkills && data.selectedSkills.length > 0) setSelectedSkills(data.selectedSkills)
        if (data.availability) setAvailability(new Date(data.availability))
        if (data.confirmed) setConfirmed(data.confirmed)
        if (data.step) setStep(data.step)
      } catch (e) {
        console.error("Failed to load draft application", e)
      }
    }
  }, [STORAGE_KEY])

  // Save state on changes
  useEffect(() => {
    if (!STORAGE_KEY) return
    const draft = {
      coverLetter,
      selectedSkills,
      availability,
      confirmed,
      step,
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
  }, [STORAGE_KEY, coverLetter, selectedSkills, availability, confirmed, step])

  /* Pre-populate skills and CV from profile on load */
  useEffect(() => {
    if (profile?.skills && selectedSkills.length === 0) {
      setSelectedSkills(profile.skills)
    }
    if (profile?.cv_url && !preloadedCvUrl) {
      setPreloadedCvUrl(profile.cv_url)
      setPreloadedCvName(profile.cv_name || 'My CV')
    }
  }, [profile, selectedSkills.length, preloadedCvUrl])

  /* Clear draft on success */
  useEffect(() => {
    if (showSuccess && STORAGE_KEY) {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [showSuccess, STORAGE_KEY])

  /* ── Skill helpers ── */
  const addSkill = (skillToAdd?: string) => {
    const skill = (skillToAdd || newSkill).trim()
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setNewSkill("")
    setFilteredSkills([])
    setShowSuggestions(false)
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove))
  }

  // Handle skill input change
  useEffect(() => {
    if (newSkill.trim().length > 0) {
      const filtered = ALL_SKILLS.filter(s =>
        s.toLowerCase().includes(newSkill.toLowerCase()) &&
        !selectedSkills.includes(s)
      ).slice(0, 10) // Limit to 10 suggestions
      setFilteredSkills(filtered)
      setShowSuggestions(true)
    } else {
      setFilteredSkills([])
      setShowSuggestions(false)
    }
  }, [newSkill, selectedSkills]) /* ── File helpers ── */
  const processFiles = (files: File[]) => {
    const VALID_TYPES = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
    ]
    const MAX = 10 * 1024 * 1024

    const ok = files.filter((f) => {
      if (!VALID_TYPES.includes(f.type)) {
        toast({ title: "Invalid file type", description: `${f.name} — only PDF, DOCX, JPG, PNG.`, variant: "destructive" })
        return false
      }
      if (f.size > MAX) {
        toast({ title: "File too large", description: `${f.name} exceeds 10 MB.`, variant: "destructive" })
        return false
      }
      return true
    })
    setUploadedFiles((p) => [...p, ...ok])
  }

  /* ── Navigation ── */
  const canAdvance = () => {
    if (step === 1) return coverLetter.trim().length > 0
    if (step === 2) return selectedSkills.length > 0
    if (step === 3) return true // files optional
    if (step === 4) return availability !== undefined
    if (step === 5) return confirmed
    return false
  }

  const next = () => {
    if (!canAdvance()) {
      const msgs: Record<number, string> = {
        1: "Please write a cover letter before continuing.",
        2: "Please add at least one skill.",
        4: "Please select an availability date.",
      }
      if (msgs[step]) toast({ title: "Required", description: msgs[step], variant: "destructive" })
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length))
  }
  const back = () => setStep((s) => Math.max(s - 1, 1))

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!confirmed) {
      toast({ title: "Confirmation required", description: "Please confirm the information is accurate.", variant: "destructive" })
      return
    }
    if (!user?.id || !id) {
      toast({ title: "Not authenticated", description: "Please sign in to apply.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)

    let cv_url = preloadedCvUrl || undefined;
    let cv_name = preloadedCvName || undefined;

    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${id}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('applications')
        .upload(filePath, file)

      if (uploadError) {
        toast({ title: "File upload failed", description: uploadError.message, variant: "destructive" })
        setIsSubmitting(false)
        return
      }

      if (uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from('applications')
          .getPublicUrl(filePath)
        cv_url = publicUrlData.publicUrl
        cv_name = file.name
      }
    }

    const { error } = await insertApplication({
      project_id: id,
      student_id: user.id,
      cover_letter: coverLetter.trim(),
      cv_url,
      cv_name,
    })
    setIsSubmitting(false)
    if (error) {
      toast({ title: "Submission failed", description: error, variant: "destructive" })
    } else {
      setShowSuccess(true)
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     LOADING / ERROR / ALREADY-APPLIED STATES
  ───────────────────────────────────────────────────────────────────────── */

  if (projectLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="page-container page-container--narrow py-10 flex flex-col gap-5">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-[420px] w-full rounded-xl" />
        </div>
      </main>
    )
  }

  if (projectError || !project) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface max-w-md w-full">
          <div className="empty-state py-14">
            <div className="empty-state__icon">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="empty-state__title">Project unavailable</p>
            <p className="empty-state__body">{projectError ?? "This project could not be found."}</p>
            <button
              className="btn btn-secondary btn-sm mt-2"
              onClick={() => navigate("/browse-projects")}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Projects
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (hasApplied) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface max-w-md w-full">
          <div className="empty-state py-14">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1 animate-bounce-in"
              style={{ background: "hsl(var(--success-subtle))", color: "hsl(var(--success))" }}
            >
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p
              className="empty-state__title"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Already applied
            </p>
            <p className="empty-state__body">
              You've already submitted an application for{" "}
              <strong className="text-foreground">{project.title}</strong>.
              Track your status in your dashboard.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/student/applications")}
              >
                My Applications
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/browse-projects")}
              >
                Browse Projects
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (activeApplicationCount >= 5) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface max-w-md w-full">
          <div className="empty-state py-14">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1 animate-bounce-in bg-amber-50 text-amber-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p
              className="empty-state__title"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Application limit reached
            </p>
            <p className="empty-state__body">
              You can only have up to <strong>5 active applications</strong> (Pending or Reviewing) at a time to ensure quality over quantity. Please wait for an employer to respond or withdraw an existing application.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/student/applications")}
              >
                Manage Applications
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  /* ─────────────────────────────────────────────────────────────────────────
     STEP CONTENT
  ───────────────────────────────────────────────────────────────────────── */

  const suggestedSkills = (project.required_skills ?? []).filter((s) => !selectedSkills.includes(s))

  const stepContent: Record<number, React.ReactNode> = {

    /* ── Step 1: Cover Letter ── */
    1: (
      <div className="flex flex-col gap-5">
        <div>
          <p
            className="text-lg font-700 text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
          >
            Write your cover letter
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Explain your motivation and why you're a great fit for this project.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="cover-letter" className="form-label flex items-center gap-1">
            Cover Letter
            <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="cover-letter"
            placeholder="I'm excited about this project because... My relevant experience includes..."
            className="textarea min-h-[12rem] mt-1.5"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1.5">
            <p className="form-hint">Describe your background and what you can contribute.</p>
            <span
              className={cn(
                "text-xs tabular-nums",
                coverLetter.length < 50 ? "text-muted-foreground" : "text-success"
              )}
            >
              {coverLetter.length} characters
            </span>
          </div>
        </div>
      </div>
    ),

    /* ── Step 2: Skills ── */
    2: (
      <div className="flex flex-col gap-5">
        <div>
          <p
            className="text-lg font-700 text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
          >
            Relevant skills
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Tag the skills you'll be bringing to this project.
          </p>
        </div>

        {/* Add custom skill */}
        <div className="form-group">
          <Label className="form-label">Add a skill</Label>
          <div className="flex gap-2 mt-1.5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="input pl-10 h-11"
                placeholder="e.g. React, Data Analysis, Figma…"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onBlur={() => {
                  // Small delay to allow clicking suggestions
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
                onFocus={() => {
                  if (newSkill.trim().length > 0) setShowSuggestions(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill()
                  }
                }}
              />

              {/* Autocomplete Suggestions */}
              {showSuggestions && filteredSkills.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto overflow-x-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                    >
                      <Plus className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{skill}</span>
                    </button>
                  ))}
                  {newSkill && !ALL_SKILLS.includes(newSkill) && (
                    <button
                      type="button"
                      onClick={() => addSkill()}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-primary/5 transition-colors border-t border-border"
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                        <Plus className="w-3 h-3 text-primary" />
                      </div>
                      <div>
                        <span className="font-medium text-primary">Add custom: </span>
                        <span className="italic">"{newSkill}"</span>
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => addSkill()}
              className="btn btn-secondary h-11"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Suggested from project */}
        {suggestedSkills.length > 0 && (
          <div>
            <p className="form-hint mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Suggested from project requirements — click to add
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkills((p) => [...p, skill])}
                  className="tag hover:tag--active transition-colors"
                >
                  <Plus className="w-3 h-3" /> {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected skills */}
        {selectedSkills.length > 0 && (
          <div>
            <p className="form-label mb-2">Your skills <span className="badge badge--primary ml-1">{selectedSkills.length}</span></p>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <span key={skill} className="tag tag--active flex items-center gap-1.5">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ),

    /* ── Step 3: Attachments ── */
    3: (
      <div className="flex flex-col gap-5">
        <div>
          <p
            className="text-lg font-700 text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
          >
            Upload CV
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Attach relevant your CV/resume. <span className="badge badge--default ml-0.5">Optional</span>
          </p>
        </div>

        <FileDropZone
          files={uploadedFiles}
          onAdd={processFiles}
          onRemove={(i) => setUploadedFiles((p) => p.filter((_, idx) => idx !== i))}
          inputRef={fileInputRef}
        />

        {preloadedCvUrl && uploadedFiles.length === 0 && (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-500 text-foreground truncate">{preloadedCvName}</p>
              <p className="text-xs text-primary/60">Preloaded from your profile</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setPreloadedCvUrl(null)
                setPreloadedCvName(null)
              }}
              className="icon-btn icon-btn--sm text-muted-foreground hover:text-destructive"
              aria-label="Remove preloaded CV"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    ),

    /* ── Step 4: Availability ── */
    4: (
      <div className="flex flex-col gap-5">
        <div>
          <p
            className="text-lg font-700 text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
          >
            Your availability
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Let the employer know your earliest start date.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="availability" className="form-label flex items-center gap-1">
            Earliest start date
            <span className="text-destructive">*</span>
          </Label>
          <div className="mt-1.5">
            <DatePicker
              value={availability}
              onChange={setAvailability}
              minDate={new Date()}
              placeholder="Select a date"
            />
          </div>
          <p className="form-hint mt-1.5">
            You can always negotiate the exact start date with the employer.
          </p>
        </div>
      </div>
    ),

    /* ── Step 5: Review & submit ── */
    5: (
      <div className="flex flex-col gap-5">
        <div>
          <p
            className="text-lg font-700 text-foreground"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
          >
            Review your application
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Double-check everything before submitting.
          </p>
        </div>

        <div className="surface-flat rounded-xl p-5 flex flex-col gap-5">
          <ReviewSection label="Cover Letter" step={1} onEdit={setStep}>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {coverLetter || <span className="italic opacity-60">Not provided</span>}
            </p>
          </ReviewSection>

          <Separator />

          <ReviewSection label="Skills" step={2} onEdit={setStep}>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedSkills.map((s) => (
                <span key={s} className="tag tag--active text-xs">{s}</span>
              ))}
            </div>
          </ReviewSection>

          <Separator />

          <ReviewSection label="Attachments" step={3} onEdit={setStep}>
            {uploadedFiles.length > 0 ? (
              <ul className="flex flex-col gap-1 mt-1">
                {uploadedFiles.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f.name}
                  </li>
                ))}
              </ul>
            ) : preloadedCvUrl ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                {preloadedCvName} (Preloaded)
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic mt-1">No attachments</p>
            )}
          </ReviewSection>

          <Separator />

          <ReviewSection label="Availability" step={4} onEdit={setStep}>
            <p className="text-sm text-muted-foreground mt-1">
              {availability
                ? format(availability, "PPP")
                : <span className="italic opacity-60">Not set</span>}
            </p>
          </ReviewSection>

          {project.budget !== null && project.budget > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs font-700 uppercase tracking-[0.08em] text-muted-foreground"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Earnings & Fees
                </p>
                <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl p-4 mt-1">
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span>Project Budget</span>
                    <span className="font-medium">£{Number(project.budget).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-emerald-700/80 mb-2 border-b border-emerald-200 pb-2">
                    <span>Platform Fee (10%)</span>
                    <span>-£{(Number(project.budget) * 0.1).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold">
                    <span>Your Estimated Take-Home</span>
                    <span className="text-lg">£{(Number(project.budget) * 0.9).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-emerald-700/80 mt-3 flex items-start gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Funds are held in escrow and safely released to your account 48 hours after the employer approves your final deliverables.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confirm checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(c) => setConfirmed(c as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="confirm" className="text-sm text-foreground leading-relaxed cursor-pointer">
            I confirm that all information provided is accurate and complete, and I agree to the platform's{" "}
            <Link to="/terms-of-service" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Service</Link> and{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</Link>.
          </Label>
        </div>
      </div>
    ),
  }

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container page-container--narrow py-10 flex flex-col gap-6">

        {/* Back link */}
        <button
          className="btn btn-ghost btn-sm self-start -ml-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Page title */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.625rem,3.5vw,2.25rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            Apply for Project
          </h1>
        </div>

        {/* Project banner */}
        <ProjectBanner project={project} />

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step card */}
        <div className="surface p-6 sm:p-8 animate-fade-up">
          {stepContent[step]}
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className="btn btn-secondary btn-lg disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Step x of y */}
          <span className="text-sm text-muted-foreground tabular-nums">
            {step} / {STEPS.length}
          </span>

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={next}
              className="btn btn-primary btn-lg"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!confirmed || isSubmitting}
              className="btn btn-primary btn-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit Application
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>

        {/* ── Success dialog ── */}
        <Dialog
          open={showSuccess}
          onOpenChange={(open) => { if (!open) navigate("/student/applications") }}
        >
          <DialogContent className="max-w-sm text-center rounded-2xl">
            <DialogHeader>
              <div className="flex justify-center mb-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce-in"
                  style={{
                    background: "hsl(var(--success-subtle))",
                    color: "hsl(var(--success))",
                  }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              <DialogTitle
                className="text-xl font-800"
                style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.025em" }}
              >
                Application sent!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1">
                Your application for{" "}
                <strong className="text-foreground">{project.title}</strong> has been submitted.
                You'll be notified once the employer reviews it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 mt-4 sm:flex-row">
              <button
                className="btn btn-secondary btn-sm flex-1"
                onClick={() => navigate("/browse-projects")}
              >
                Browse More
              </button>
              <button
                className="btn btn-primary btn-sm flex-1"
                onClick={() => navigate("/student/applications")}
              >
                My Applications
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ApplicationForm
