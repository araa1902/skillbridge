import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DatePicker } from "@/components/ui/date-picker"
import { format, parseISO } from "date-fns"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowLeft, ArrowRight, SpinnerGap as Loader2, Plus as Plus, X, CheckCircle as CheckCircle2, CaretRight as ChevronRight, Sparkle as Sparkles, Lightbulb, CurrencyGbp as PoundSterling, Clock, CalendarBlank as CalendarDays, Checks as ListChecks, Briefcase, Tag as Tag, FileText, Info as Info, Rocket as Rocket, BookmarkSimple as BookMarked, Layout as LayoutTemplate, TrendUp as TrendingUp, ShieldCheck as ShieldCheck, Users, BriefcaseIcon, BinocularsIcon, CaretUpDown, Check, Trash } from "@phosphor-icons/react"
import { useAuth } from "@/contexts/AuthContext"
import { insertProject, updateProject, deleteProject } from "@/hooks/useProjects"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { ProjectStatus } from "@/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */


export const CATEGORY_GROUPS = [
  {
    label: "Tech & Development",
    categories: [
      { value: "software-dev", label: "Software & Web Development" },
      { value: "mobile-dev", label: "Mobile App Development" },
      { value: "game-dev", label: "Game Development" },
      { value: "cybersecurity", label: "Cybersecurity" },
      { value: "data-ai", label: "Data Science & AI" },
      { value: "blockchain", label: "Blockchain & Web3" },
      { value: "qa-testing", label: "QA & Testing" },
    ]
  },
  {
    label: "Design & Creative",
    categories: [
      { value: "design-creative", label: "Graphic Design & Illustration" },
      { value: "ui-ux", label: "UI/UX Design" },
      { value: "multimedia-video", label: "Video Production & Animation" },
      { value: "photography", label: "Photography" },
      { value: "architecture-interior", label: "Architecture & Interior Design" },
      { value: "fashion-apparel", label: "Fashion & Apparel Design" },
    ]
  },
  {
    label: "Marketing & Writing",
    categories: [
      { value: "marketing-seo", label: "Digital Marketing & SEO" },
      { value: "social-media", label: "Social Media Management" },
      { value: "content-strategy", label: "Content Strategy & Copywriting" },
      { value: "pr-communications", label: "PR & Communications" },
      { value: "translation-languages", label: "Translation & Languages" },
    ]
  },
  {
    label: "Business & Management",
    categories: [
      { value: "business-finance", label: "Business & Finance" },
      { value: "sales-bizdev", label: "Sales & Business Development" },
      { value: "project-management", label: "Project Management" },
      { value: "consulting-strategy", label: "Strategy & Consulting" },
      { value: "hr-recruitment", label: "HR & Recruitment" },
      { value: "legal-compliance", label: "Legal & Compliance" },
    ]
  },
  {
    label: "Research & Specialized",
    categories: [
      { value: "engineering", label: "Engineering" },
      { value: "research-analytics", label: "Research & Analysis" },
      { value: "sustainability", label: "Sustainability & Environment" },
      { value: "healthcare-science", label: "Healthcare & Life Sciences" },
      { value: "education-tutoring", label: "Education & Tutoring" },
      { value: "event-planning", label: "Event Planning" },
    ]
  }
];

export const CATEGORIES = CATEGORY_GROUPS.flatMap(g => g.categories);

// Replaced broad categories with specific, highly-searched hard skills
export const ALL_SKILLS = [
  // Tech & Software
  "React", "TypeScript", "Node.js", "Python", "Next.js", "React Native", "Flutter",
  "Three.js", "Java", "C++", "C#", "Unity", "Unreal Engine", "AWS", "Docker", "Kubernetes",
  "SQL", "NoSQL", "Git", "GitHub Actions", "WordPress", "Shopify", "PHP", "Laravel",
  // Data & AI
  "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision",
  "Data Visualization", "PowerBI", "Tableau", "Excel", "Pandas", "NumPy", "TensorFlow", "PyTorch",
  // Design & Creative
  "UI/UX Design", "Figma", "Adobe Illustrator", "Adobe Photoshop", "After Effects",
  "Premiere Pro", "Blender", "3D Modeling", "Video Editing", "Animation", "Logo Design",
  // Marketing & Writing
  "SEO", "SEM", "Google Analytics", "Content Strategy", "Copywriting", "Social Media Management",
  "Email Marketing", "Public Relations", "Translation", "Technical Writing",
  // Business & Research
  "Market Research", "Financial Modeling", "Business Analysis", "Project Management",
  "Agile/Scrum", "User Research", "Survey Design", "Data Entry", "Strategy Consulting",
  // Engineering & Science
  "AutoCAD", "SolidWorks", "MATLAB", "Circuit Design", "Sustainability Research", "BIM"
].sort(); // Alphabetical sorting makes the dropdown easier to read

export const DURATIONS = [
  {
    value: "5",
    label: "Micro-Task (≤ 5 hrs)",
    sub: "Quick fixes & audits",
    range: "£75 – £125"
  },
  {
    value: "10",
    label: "Sprint (10 hrs)",
    sub: "Standard deliverables",
    range: "£150 – £250"
  },
  {
    value: "20",
    label: "Deep Dive (20 hrs)",
    sub: "Complex, multi-step projects",
    range: "£300 – £500"
  },
  {
    value: "40",
    label: "Capstone (40+ hrs)",
    sub: "Major builds & research",
    range: "£600 – £1,000+"
  },
];

export const TIPS = [
  {
    icon: ListChecks,
    text: "Be specific about deliverables. Bullet points and numbered lists work best."
  },
  {
    icon: CalendarDays,
    text: "Set realistic deadlines."
  },
  {
    icon: Lightbulb,
    text: "Tag accurate skills. Our matching algorithm uses these to notify the best students."
  },
  {
    icon: Users,
    text: "Review applications quickly. Top student talent gets booked fast."
  },
  {
    icon: TrendingUp,
    text: "Competitive budgets matter. Projects priced fairly receive more applications."
  },
  {
    icon: ShieldCheck,
    text: "Secure transactions. Your funds are safely held in escrow until you approve the work."
  },
];

type Template = {
  title: string; category: string; description: string
  deliverables: string; skills: string[]; duration: string; budget: string
}

const TEMPLATES: Record<string, Template> = {
  "Website Development": {
    title: "E-commerce Website Revamp",
    category: "software-dev",
    description: "Redesign and optimise our existing e-commerce website for performance, accessibility, and mobile responsiveness. Implement improved navigation, product filtering, and SEO best practices.",
    deliverables: "1. High-fidelity UI mockups\n2. Responsive React/Next.js implementation\n3. Performance report (Lighthouse score)\n4. Accessibility audit\n5. Deployment instructions",
    skills: ["Web Development", "UI/UX Design"],
    duration: "20", budget: "800",
  },
  "App Development": {
    title: "Mobile App MVP Development",
    category: "mobile-dev",
    description: "Build a cross-platform mobile app MVP using React Native or Flutter. Focus on core features: user authentication, basic feed, and profile management.",
    deliverables: "1. Cross-platform mobile app\n2. Source code (GitHub repository)\n3. Basic setup guide\n4. QA test report",
    skills: ["Mobile App Development", "React Native", "Firebase"],
    duration: "40", budget: "1500",
  },
  "Marketing Campaign": {
    title: "Student-Targeted Digital Marketing Campaign",
    category: "marketing-seo",
    description: "Design and execute a digital marketing campaign targeting university students. Includes channel strategy, content calendar, and performance tracking.",
    deliverables: "1. Campaign brief & strategy\n2. 4-week content calendar\n3. Ad copy & creative assets\n4. Analytics tracking setup\n5. Post-campaign summary",
    skills: ["Marketing", "Social Media", "Content Writing", "Data Analysis"],
    duration: "20", budget: "600",
  },
  "Logo & Branding": {
    title: "Startup Visual Identity Suite",
    category: "design-creative",
    description: "Design a comprehensive visual identity for our new startup. This includes a logo, color palette, typography guidelines, and social media templates.",
    deliverables: "1. Primary & secondary logos (Vector/PNG)\n2. Brand guidelines PDF\n3. Social media asset kit\n4. Business card design",
    skills: ["Graphic Design", "Logo Design", "Branding"],
    duration: "10", budget: "400",
  },
  "User Research": {
    title: "User Research for New Mobile Feature",
    category: "research-analytics",
    description: "Conduct qualitative research to validate a new feature concept. Includes user interviews, insight synthesis, and design recommendations.",
    deliverables: "1. Research plan & script\n2. Interview summaries\n3. Insight & findings report\n4. Feature recommendation memo",
    skills: ["User Research", "UI/UX Design", "Data Analysis"],
    duration: "10", budget: "400",
  },
  "Data Analysis": {
    title: "Sales Funnel Performance Analysis",
    category: "data-ai",
    description: "Analyse our sales funnel data to identify drop-off points and recommend optimisation strategies using historical CRM data.",
    deliverables: "1. Data cleaning & processing\n2. Funnel visualisation dashboard\n3. Key performance indicator report\n4. Optimisation recommendations",
    skills: ["Data Analysis", "Business Analysis", "Python"],
    duration: "20", budget: "900",
  },
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP CONFIG
───────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { id: 1, label: "Basics", icon: BriefcaseIcon },
  { id: 2, label: "Scope", icon: BinocularsIcon },
  { id: 3, label: "Skills", icon: Tag },
  { id: 4, label: "Budget", icon: PoundSterling },
  { id: 5, label: "Review", icon: CheckCircle2 },
]

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Project creation steps" className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done = current > step.id
        const active = current === step.id
        const isLast = idx === STEPS.length - 1
        const Icon = step.icon

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border-2",
                  done && "bg-primary border-primary text-white",
                  active && "bg-primary border-primary text-white shadow-[0_0_0_4px_hsl(var(--primary)/0.14)]",
                  !done && !active && "bg-card border-border text-muted-foreground"
                )}
              >
                {done
                  ? <CheckCircle2 className="w-4 h-4" />
                  : <Icon className="w-4 h-4" />
                }
              </div>
              <span
                className={cn(
                  "text-[0.6875rem] font-600 whitespace-nowrap hidden sm:block",
                  active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
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

/** Reusable section header inside step cards */
function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-5">
      <p
        className="text-lg font-700 text-foreground"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.022em" }}
      >
        {title}
      </p>
      <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>
    </div>
  )
}

/** Duration option card */
function DurationCard({
  option,
  selected,
  onSelect,
}: {
  option: typeof DURATIONS[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:border-border-strong hover:bg-muted/20"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
          selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"
        )}
      >
        <Clock className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-600", selected ? "text-foreground" : "text-foreground")}>
          {option.label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{option.sub}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-600 text-primary">{option.range}</p>
      </div>
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
          selected ? "bg-primary border-primary" : "border-border"
        )}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  )
}

/** Review row with edit shortcut */
function ReviewRow({
  label,
  icon: Icon,
  children,
  onEdit,
}: {
  label: string
  icon: React.ElementType
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[0.6875rem] font-700 uppercase tracking-[0.08em] text-muted-foreground">
            {label}
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-600 text-primary hover:text-primary/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   SIDEBAR PANELS
───────────────────────────────────────────────────────────────────────────── */

// function TemplatePanel({ onApply }: { onApply: (name: string) => void }) {
//   return (
//     <div className="surface p-5 flex flex-col gap-4">
//       <div className="flex items-center gap-2">
//         <LayoutTemplate className="w-4 h-4 text-primary" />
//         <p
//           className="text-sm font-700 text-foreground"
//           style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.016em" }}
//         >
//           Quick-start Templates
//         </p>
//       </div>
//       <p className="text-xs text-muted-foreground -mt-1">
//         Pre-fill the form with a common project type
//       </p>
//       <div className="flex flex-col gap-2">
//         {Object.keys(TEMPLATES).map((name) => (
//           <button
//             key={name}
//             type="button"
//             onClick={() => onApply(name)}
//             className={cn(
//               "w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl",
//               "border border-border hover:border-primary/30 hover:bg-primary/4",
//               "text-sm font-500 text-foreground transition-all duration-150 group"
//             )}
//           >
//             <span className="truncate">{name}</span>
//             <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

function TipsPanel() {
  return (
    <div className="surface p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <p
          className="text-sm font-700 text-foreground"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.016em" }}
        >
          Tips for great listings
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {TIPS.map(({ icon: Icon, text }, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <Icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PricingPanel({ selectedDuration }: { selectedDuration: string }) {
  const active = DURATIONS.find((d) => d.value === selectedDuration)
  return (
    <div className="surface-brand p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" />
        <p
          className="text-sm font-700 text-foreground"
          style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.016em" }}
        >
          Escrow protection
        </p>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Your budget is held securely in escrow. Funds are only released when you're satisfied with the final deliverables.
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

type FormState = {
  title: string; category: string; description: string
  deliverables: string; budget: string; duration: string
  deadline: string; mentor: boolean; project_documents_url: string
}

const INIT_FORM: FormState = {
  title: "", category: "", description: "", deliverables: "",
  budget: "", duration: "10", deadline: "", mentor: false,
  project_documents_url: "",
}

export default function NewProject() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { id } = useParams()
  const isEditing = Boolean(id)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INIT_FORM)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [openCategorySelect, setOpenCategorySelect] = useState(false)
  const [customSkill, setCustomSkill] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadingProject, setLoadingProject] = useState(isEditing)

  useEffect(() => {
    if (!id) return

    async function loadProject() {
      setLoadingProject(true)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        toast({ title: "Failed to load project", description: error.message, variant: "destructive" })
        navigate("/employer/projects/manage")
        return
      }

      if (data) {
        if (data.status !== 'draft' && data.status !== 'open') {
          toast({
            title: "Cannot edit project",
            description: `Projects that are ${data.status.replace('_', ' ')} cannot be edited.`,
            variant: "destructive"
          })
          navigate("/employer/projects/manage")
          return
        }
        setForm({
          title: data.title ?? "",
          category: data.category ?? "General",
          description: data.description ?? "",
          deliverables: data.deliverables ?? "",
          budget: data.budget?.toString() ?? "",
          duration: data.duration_hours === 0 ? "ongoing" : data.duration_hours?.toString() ?? "10",
          deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : "",
          mentor: false,
          project_documents_url: data.project_documents_url ?? "",
        })
        setSelectedSkills(data.required_skills ?? [])
      }
      setLoadingProject(false)
    }

    loadProject()
  }, [id, navigate, toast])

  const set = (field: keyof FormState, val: string | boolean) =>
    setForm((f) => ({ ...f, [field]: val }))

  /* ── Template apply ── */
  const applyTemplate = (name: string) => {
    const t = TEMPLATES[name]
    if (!t) return
    setForm((f) => ({
      ...f,
      title: t.title, category: t.category,
      description: t.description, deliverables: t.deliverables,
      duration: t.duration, budget: t.budget, project_documents_url: f.project_documents_url,
    }))
    setSelectedSkills(t.skills)
    toast({ title: `Template applied: ${name}`, description: "Form pre-filled — customise as needed." })
  }

  /* ── Skill helpers ── */
  const toggleSkill = (s: string) =>
    setSelectedSkills((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])

  const addCustomSkill = () => {
    const t = customSkill.trim()
    if (t && !selectedSkills.includes(t)) {
      setSelectedSkills((p) => [...p, t])
      setCustomSkill("")
    }
  }

  /* ── Navigation guards ── */
  const canAdvance = () => {
    if (step === 1) return form.title.trim() !== "" && form.category !== "" && form.description.trim().length >= 200
    if (step === 2) return form.deliverables.trim() !== "" && form.deadline !== ""
    if (step === 3) return selectedSkills.length > 0
    if (step === 4) {
      const b = parseFloat(form.budget)
      return !isNaN(b) && b >= 200
    }
    return true
  }

  const next = () => {
    if (!canAdvance()) {
      const msgs: Record<number, string> = {
        1: "Please fill in the title, category, and a description of at least 200 characters.",
        2: "Please add deliverables and a deadline.",
        3: "Please select at least one skill.",
        4: "Please enter a valid budget (min £200).",
      }
      toast({ title: "Required fields missing", description: msgs[step], variant: "destructive" })
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length))
  }
  const back = () => setStep((s) => Math.max(s - 1, 1))

  /* ── Submit ── */
  const handleSubmit = async (asDraft = false) => {
    if (!user) {
      toast({ title: "Not authenticated", description: "Please sign in first.", variant: "destructive" })
      return
    }
    const budgetNum = parseFloat(form.budget)
    if (!asDraft && (isNaN(budgetNum) || budgetNum < 200)) {
      toast({ title: "Invalid budget", description: "Budget must be at least £200 to publish.", variant: "destructive" })
      return
    }

    setSubmitting(true)
    const payload = {
      business_id: user.id,
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      deliverables: form.deliverables.trim(),
      required_skills: selectedSkills,
      budget: isNaN(budgetNum) ? 0 : budgetNum,
      duration_hours: form.duration === "ongoing" ? 0 : parseInt(form.duration, 10),
      deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      status: (asDraft ? "draft" : "open") as ProjectStatus,
      project_documents_url: form.project_documents_url.trim() || null,
    }

    const { error } = isEditing
      ? await updateProject(id!, payload)
      : await insertProject(payload)

    setSubmitting(false)

    if (error) {
      toast({ title: "Failed to post project", description: error, variant: "destructive" })
      return
    }
    toast({
      title: isEditing ? (asDraft ? "Draft updated" : "Project updated!") : (asDraft ? "Draft saved" : "Project published! 🎉"),
      description: asDraft
        ? "You can publish it any time from your project manager."
        : "Students can now discover and apply to your project.",
    })
    navigate("/employer/projects/manage")
  }

  const handleDelete = async () => {
    if (!id) return
    setSubmitting(true)
    const { error } = await deleteProject(id)
    setSubmitting(false)

    if (error) {
      toast({ title: "Failed to delete draft", description: error, variant: "destructive" })
      return
    }

    toast({ title: "Draft deleted", description: "The project draft has been permanently removed." })
    navigate("/employer/projects/manage")
  }

  /* ── Category label helper ── */
  const categoryLabel = CATEGORIES.find((c) => c.value === form.category)?.label ?? "—"
  const durationLabel = DURATIONS.find((d) => d.value === form.duration)?.label ?? "—"

  /* ─────────────────────────────────────────────────────────────────────────
     STEP CONTENT
  ───────────────────────────────────────────────────────────────────────── */

  const stepContent: Record<number, React.ReactNode> = {

    /* ── Step 1: Basics ── */
    1: (
      <>
        <StepHeading
          title="Project basics"
          sub="Give your project a clear identity — this is the first thing students will see."
        />
        <div className="flex flex-col gap-5">
          <div className="form-group">
            <Label htmlFor="title" className="form-label flex items-center gap-1">
              Project title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              className="input mt-1.5"
              placeholder="e.g. E-commerce Website Redesign"
              value={form.title}
              maxLength={100}
              onChange={(e) => set("title", e.target.value)}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="form-hint">Clear, specific titles attract more applicants</p>
              <span className="text-[12px] tabular-nums font-600 uppercase tracking-wider text-muted-foreground/80">
                {form.title.length}/100
              </span>
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="category" className="form-label flex items-center gap-1">
              Category <span className="text-destructive">*</span>
            </Label>
            <Popover open={openCategorySelect} onOpenChange={setOpenCategorySelect}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  role="combobox"
                  aria-expanded={openCategorySelect}
                  className="input mt-1.5 flex items-center justify-between w-full h-11 px-3 text-left bg-card border-border hover:bg-muted/50 transition-colors"
                >
                  <span className={cn(form.category ? "text-foreground" : "text-muted-foreground")}>
                    {form.category
                      ? CATEGORIES.find((c) => c.value === form.category)?.label
                      : "Select a category…"}
                  </span>
                  <CaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search categories..." className="h-9" />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No category found.</CommandEmpty>
                    {CATEGORY_GROUPS.map((group) => (
                      <CommandGroup key={group.label} heading={group.label}>
                        {group.categories.map((c) => (
                          <CommandItem
                            key={c.value}
                            value={c.label}
                            onSelect={() => {
                              set("category", c.value)
                              setOpenCategorySelect(false)
                            }}
                            className="flex items-center justify-between"
                          >
                            <span>{c.label}</span>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                form.category === c.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="form-group">
            <Label htmlFor="description" className="form-label flex items-center gap-1">
              Project description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              className="textarea mt-1.5 min-h-[10rem]"
              placeholder="Describe your project goals, context, and what you're hoping to achieve. The more specific, the better."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="form-hint">Minimum 200 characters required</p>
              <span className={cn(
                "text-xs tabular-nums",
                form.description.length < 200 ? "text-muted-foreground" : "text-success"
              )}>
                {form.description.length} characters
              </span>
            </div>
          </div>
        </div>
      </>
    ),

    /* ── Step 2: Scope ── */
    2: (
      <>
        <StepHeading
          title="Scope & timeline"
          sub="Define what you expect to receive and when you need it by."
        />
        <div className="flex flex-col gap-5">
          <div className="form-group">
            <Label htmlFor="deliverables" className="form-label flex items-center gap-1">
              Expected deliverables <span className="text-destructive">*</span>
            </Label>
            <p className="form-hint mt-0.5 mb-1.5">List each deliverable on a new line</p>
            <Textarea
              id="deliverables"
              className="textarea min-h-[8rem]"
              placeholder={"1. High-fidelity UI mockups\n2. Responsive implementation\n3. Final report with recommendations"}
              value={form.deliverables}
              onChange={(e) => set("deliverables", e.target.value)}
            />
          </div>

          <div className="form-group">
            <Label className="form-label flex items-center gap-1">
              Project duration <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-col gap-2.5 mt-1.5">
              {DURATIONS.map((d) => (
                <DurationCard
                  key={d.value}
                  option={d}
                  selected={form.duration === d.value}
                  onSelect={() => set("duration", d.value)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <Label htmlFor="deadline" className="form-label flex items-center gap-1">
              Project deadline <span className="text-destructive">*</span>
            </Label>
            <div className="mt-1.5">
              <DatePicker
                value={form.deadline ? parseISO(form.deadline) : undefined}
                onChange={(date) => set("deadline", date ? format(date, "yyyy-MM-dd") : "")}
                minDate={new Date()}
                placeholder="Select a deadline"
              />
            </div>
            <p className="form-hint mt-1.5">Allow enough time for quality work — students are part-time</p>
          </div>

          <div className="form-group">
            <Label htmlFor="project_documents_url" className="form-label flex items-center gap-1">
              Project resources link <span className="badge badge--default ml-1 font-normal uppercase scale-90">Optional</span>
            </Label>
            <p className="form-hint mt-0.5 mb-1.5">A secure link (e.g., Google Drive, Notion) containing files and instructions. This is only visible to the assigned student.</p>
            <Input
              id="project_documents_url"
              className="input"
              placeholder="https://docs.google.com/..."
              value={form.project_documents_url}
              onChange={(e) => set("project_documents_url", e.target.value)}
            />
          </div>
        </div>
      </>
    ),

    /* ── Step 3: Skills ── */
    3: (
      <>
        <StepHeading
          title="Required skills"
          sub="Tag the skills students will need — this powers our applicant matching."
        />
        <div className="flex flex-col gap-5">
          {/* Quick-select grid */}
          <div>
            <p className="form-hint mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Select all that apply
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_SKILLS.map((skill) => {
                const active = selectedSkills.includes(skill)
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-500 transition-all duration-150 text-left",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "border-primary/40 bg-primary/6 text-primary ring-1 ring-primary/20"
                        : "border-border hover:border-border-strong hover:bg-muted/30 text-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        active ? "bg-primary border-primary" : "border-border"
                      )}
                    >
                      {active && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="truncate">{skill}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Custom skill input */}
          <div className="form-group">
            <Label className="form-label">Add a custom skill</Label>
            <div className="flex gap-2 mt-1.5">
              <Input
                className="input flex-1"
                placeholder="e.g. Figma, Python, Notion…"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill() } }}
              />
              <button type="button" className="btn btn-secondary" onClick={addCustomSkill}>
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>

          {/* Selected tags */}
          {selectedSkills.length > 0 && (
            <div>
              <p className="form-label mb-2">
                Selected skills
                <span className="badge badge--primary ml-2">{selectedSkills.length}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span key={s} className="tag tag--active flex items-center gap-1.5">
                    {s}
                    <button
                      type="button"
                      onClick={() => toggleSkill(s)}
                      className="hover:text-destructive transition-colors"
                      aria-label={`Remove ${s}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    ),

    /* ── Step 4: Budget ── */
    4: (
      <>
        <StepHeading
          title="Budget"
          sub="Set a fair budget — this funds go into escrow and are released on your approval."
        />
        <div className="flex flex-col gap-6">
          <div className="form-group">
            <Label htmlFor="budget" className="form-label flex items-center gap-1.5">
              Project budget
              <span className="text-destructive">*</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs text-xs">
                    Funds are held in escrow and only released when you approve the final work. Minimum budget is £200.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative mt-1.5">
              <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="budget"
                type="number"
                className="input pl-10"
                placeholder="500"
                min="200"
                max="2000"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <p className="form-hint">Minimum £200 · Maximum £2,000</p>
              {parseFloat(form.budget) >= 200 && (
                <span className="text-xs font-600 text-success flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Valid budget
                </span>
              )}
            </div>
          </div>

          {/* Budget range guide */}
          <div className="surface-flat rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs font-700 uppercase tracking-[0.08em] text-muted-foreground flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Pricing guide
            </p>
            {DURATIONS.map((d) => (
              <div
                key={d.value}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all",
                  form.duration === d.value
                    ? "border-primary/30 bg-primary/4"
                    : "border-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  {form.duration === d.value && (
                    <span className="badge badge--primary text-[0.625rem]">Your choice</span>
                  )}
                  <p className="text-sm font-500 text-foreground">{d.label}</p>
                </div>
                <p className="text-sm font-700 text-primary">{d.range}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    ),

    /* ── Step 5: Review ── */
    5: (
      <>
        <StepHeading
          title="Review your listing"
          sub="Check everything before publishing. You can still edit after posting."
        />
        <div className="surface-flat rounded-xl p-5 flex flex-col gap-5">
          <ReviewRow label="Title" icon={Briefcase} onEdit={() => setStep(1)}>
            <p className="font-600">{form.title || <span className="italic opacity-50">Not set</span>}</p>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Category" icon={Tag} onEdit={() => setStep(1)}>
            <p>{categoryLabel}</p>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Description" icon={FileText} onEdit={() => setStep(1)}>
            <p className="line-clamp-3 text-muted-foreground">{form.description || <span className="italic opacity-50">Not set</span>}</p>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Deliverables" icon={ListChecks} onEdit={() => setStep(2)}>
            <p className="line-clamp-3 text-muted-foreground whitespace-pre-line">{form.deliverables || <span className="italic opacity-50">Not set</span>}</p>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Duration & Deadline" icon={Clock} onEdit={() => setStep(2)}>
            <p>
              {durationLabel}
              {form.deadline && (
                <span className="text-muted-foreground ml-2">
                  · Deadline {new Date(form.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
            </p>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Skills" icon={Tag} onEdit={() => setStep(3)}>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {selectedSkills.length > 0
                ? selectedSkills.map((s) => <span key={s} className="tag tag--active text-xs">{s}</span>)
                : <span className="italic text-muted-foreground opacity-50 text-sm">None selected</span>
              }
            </div>
          </ReviewRow>
          <Separator />
          <ReviewRow label="Budget" icon={PoundSterling} onEdit={() => setStep(4)}>
            <p className="font-700 text-primary text-base" style={{ fontFamily: "var(--font-display)" }}>
              {form.budget ? `£${parseFloat(form.budget).toLocaleString()}` : <span className="italic opacity-50 font-400 text-sm text-muted-foreground">Not set</span>}
            </p>
          </ReviewRow>
        </div>

        {/* Publish note */}
        <div className="flex items-start gap-3 p-4 mt-4 rounded-xl border border-border bg-muted/20">
          <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            By publishing, your budget will be held in <strong className="text-foreground">secure escrow</strong> and released only when you approve the delivered work.
          </p>
        </div>
      </>
    ),
  }

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-10 flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(1.625rem, 3.5vw, 2.25rem)",
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
            }}
          >
            {isEditing ? `Edit Project: ${form.title || "..."}` : "Post a New Project"}
          </h1>
          <p className="text-muted-foreground mt-2 text-[0.9375rem]">
            {isEditing ? "Update your project brief for applicants" : "Connect with talented university students ready to deliver real work"}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_18rem] gap-8 items-start">

          {/* ── Main column ── */}
          <div className="flex flex-col gap-5">
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
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <span className="text-sm text-muted-foreground tabular-nums">
                {step} / {STEPS.length}
              </span>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={next}
                  className="btn btn-primary btn-lg"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          disabled={submitting}
                          className="btn btn-outline btn-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash className="w-4 h-4" /> Discard Draft
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Discard Draft?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this project. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(true)}
                    className="btn btn-secondary btn-lg disabled:opacity-40"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookMarked className="w-4 h-4" />}
                    {isEditing ? "Update Draft" : "Save Draft"}
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleSubmit(false)}
                    className="btn btn-primary btn-lg disabled:opacity-50"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> {isEditing ? "Updating..." : "Publishing…"}</>
                      : <><Rocket className="w-4 h-4" /> {isEditing ? "Update Project" : "Publish & Escrow"}</>
                    }
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ── */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--topbar-h)+1.5rem)]">
            {/* <TemplatePanel onApply={applyTemplate} /> */}
            <PricingPanel selectedDuration={form.duration} />
            <TipsPanel />
          </aside>
        </div>
      </div>
    </div>
  )
}
