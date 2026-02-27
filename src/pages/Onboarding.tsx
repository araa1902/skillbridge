import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CaretRight as ChevronRight, ArrowLeft, Check, MagnifyingGlass as Search, X, Sparkle as Sparkles, Buildings as Building2 } from "@phosphor-icons/react"
import { cn } from '@/lib/utils'

// ─── Skills Master List ───────────────────────────────────────────────────────

const ALL_SKILLS = [
    // Engineering & Dev
    "React", "Next.js", "Vue.js", "Angular", "Svelte",
    "TypeScript", "JavaScript", "Node.js", "Express.js", "NestJS",
    "Python", "Django", "FastAPI", "Flask",
    "Java", "Spring Boot", "Kotlin", "Swift", "Objective-C",
    "C", "C++", "C#", ".NET", "Rust", "Go",
    "PHP", "Laravel", "Ruby", "Ruby on Rails",
    "React Native", "Flutter", "Expo",
    "GraphQL", "REST API", "WebSockets", "tRPC",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase", "Firebase",
    "Docker", "Kubernetes", "CI/CD", "GitHub Actions", "AWS", "GCP", "Azure",
    "Linux", "Bash / Shell", "Terraform",

    // Data & AI
    "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
    "Data Analysis", "Data Visualisation", "Power BI", "Tableau",
    "SQL", "Spark", "Hadoop", "Airflow",
    "Reinforcement Learning", "LLMs", "Prompt Engineering",

    // Design
    "UI/UX Design", "Figma", "Adobe XD", "Sketch",
    "Graphic Design", "Illustrator", "Photoshop", "After Effects",
    "Motion Design", "3D Modelling", "Blender", "Brand Design",
    "Design Systems", "Wireframing", "Prototyping",

    // Marketing & Growth
    "Digital Marketing", "SEO", "SEM / PPC", "Content Marketing",
    "Email Marketing", "Copywriting", "Social Media", "Influencer Marketing",
    "Growth Hacking", "Analytics", "Google Analytics", "A/B Testing",
    "CRM", "HubSpot", "Salesforce",

    // Business & Strategy
    "Project Management", "Agile / Scrum", "Product Management",
    "Business Analysis", "Market Research", "Financial Modelling",
    "Accounting", "Operations", "Supply Chain", "Consulting",
    "Sales", "Business Development", "Pitch Decks", "Fundraising",

    // Media & Content
    "Video Editing", "Premiere Pro", "DaVinci Resolve",
    "Podcast Production", "Photography", "Content Creation",
    "Scriptwriting", "Journalism", "Translation / Localisation",

    // Soft & Other
    "Public Speaking", "Research", "Technical Writing",
    "Community Management", "Event Planning", "Customer Support",
]

// ─── Slide transition ─────────────────────────────────────────────────────────

const variants = {
    initial: (dir: number) => ({ opacity: 0, x: dir * 32 }),
    animate: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
}

// ─── Reusable primitives ──────────────────────────────────────────────────────

const StepLabel = ({ current, total }: { current: number; total: number }) => (
    <p className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
        Step {current} of {total}
    </p>
)

const NavRow = ({
    onBack,
    onNext,
    nextLabel = 'Continue',
    nextDisabled = false,
    loading = false,
    showBack = true,
}: {
    onBack?: () => void
    onNext: () => void
    nextLabel?: string
    nextDisabled?: boolean
    loading?: boolean
    showBack?: boolean
}) => (
    <div className={cn('flex pt-6', showBack ? 'justify-between' : 'justify-end')}>
        {showBack && (
            <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
            </button>
        )}
        <Button onClick={onNext} disabled={nextDisabled || loading} size="sm" className="gap-1.5">
            {loading ? 'Saving…' : nextLabel}
            {!loading && <ChevronRight className="h-3.5 w-3.5" />}
        </Button>
    </div>
)

// ─── Skill picker ─────────────────────────────────────────────────────────────

const SkillPicker = ({
    selected,
    onToggle,
}: {
    selected: string[]
    onToggle: (s: string) => void
}) => {
    const [query, setQuery] = useState('')

    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim()
        return q ? ALL_SKILLS.filter((s) => s.toLowerCase().includes(q)) : ALL_SKILLS
    }, [query])

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search skills…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-9 text-sm bg-muted/40 border-0 focus-visible:ring-1"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                )}
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selected.map((s) => (
                        <button
                            key={s}
                            onClick={() => onToggle(s)}
                            className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                        >
                            {s}
                            <X className="h-3 w-3" />
                        </button>
                    ))}
                </div>
            )}

            {/* Scrollable list */}
            <div className="h-52 overflow-y-auto rounded-lg border bg-muted/20 p-3">
                {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No skills match "{query}"
                    </p>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {filtered.map((skill) => {
                            const active = selected.includes(skill)
                            return (
                                <button
                                    key={skill}
                                    onClick={() => onToggle(skill)}
                                    className={cn(
                                        'rounded-full px-2.5 py-1 text-xs font-medium border transition-all duration-100',
                                        active
                                            ? 'opacity-30 cursor-pointer'
                                            : 'bg-background border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background'
                                    )}
                                >
                                    {skill}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>

            <p className="text-xs text-muted-foreground">
                {selected.length} skill{selected.length !== 1 ? 's' : ''} selected
            </p>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
    const { user, profile, role, refreshProfile } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [loading, setLoading] = useState(false)

    // Student fields
    const [bio, setBio] = useState(profile?.bio || '')
    const [skills, setSkills] = useState<string[]>([])

    // Business fields
    const [companyName, setCompanyName] = useState(profile?.company_name || '')
    const [mission, setMission] = useState(profile?.bio || '')

    const isStudent = role === 'student'
    const maxSteps = 3

    const go = (next: number) => {
        setDirection(next > step ? 1 : -1)
        setStep(next)
    }

    const toggleSkill = (skill: string) =>
        setSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        )

    const handleSubmit = async () => {
        if (!user) return
        setLoading(true)
        try {
            const payload = isStudent
                ? { bio, skills }
                : { company_name: companyName, bio: mission }

            const { error } = await supabase
                .from('profiles')
                .update(payload)
                .eq('id', user.id)

            if (error) throw error
            await refreshProfile()
            toast.success('Profile saved!')
            navigate(isStudent ? '/student/dashboard' : '/employer/dashboard', { replace: true })
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!role) return null

    // ── Steps ──────────────────────────────────────────────────────────────────

    const studentSteps = [
        // Step 1 — Bio
        <motion.div
            key="s1"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-5"
        >
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Introduce yourself</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    A short bio helps businesses understand who you are at a glance.
                </p>
            </div>
            <Textarea
                placeholder="e.g. Final-year Computer Science student with a passion for building clean, fast web apps…"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="h-36 text-sm resize-none bg-muted/30 border-ring-2 focus-visible:ring-1"
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length} / 300</p>
            <NavRow
                showBack={false}
                onNext={() => go(2)}
                nextDisabled={!bio.trim()}
            />
        </motion.div>,

        // Step 2 — Skills
        <motion.div
            key="s2"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-5"
        >
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Your skills</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Search and select skills that represent your strengths.
                </p>
            </div>
            <SkillPicker selected={skills} onToggle={toggleSkill} />
            <NavRow
                onBack={() => go(1)}
                onNext={() => go(3)}
                nextDisabled={skills.length === 0}
            />
        </motion.div>,

        // Step 3 — Confirm
        <motion.div
            key="s3"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-6 text-center py-4"
        >
            <div className="mx-auto h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-background" />
            </div>
            <div>
                <h2 className="text-lg font-semibold tracking-tight">You're all set</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                    Your profile is ready. Start browsing live projects and apply in minutes.
                </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border bg-muted/30 p-4 text-left space-y-3">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Bio</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">{bio}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Skills</p>
                    <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 8).map((s) => (
                            <span key={s} className="text-xs bg-background border rounded-full px-2 py-0.5">{s}</span>
                        ))}
                        {skills.length > 8 && (
                            <span className="text-xs text-muted-foreground px-1">+{skills.length - 8} more</span>
                        )}
                    </div>
                </div>
            </div>

            <NavRow
                onBack={() => go(2)}
                onNext={handleSubmit}
                nextLabel="Go to Dashboard"
                loading={loading}
            />
        </motion.div>,
    ]

    const businessSteps = [
        // Step 1 — Company name
        <motion.div
            key="b1"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-5"
        >
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Company name</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    This is what students will see when browsing your projects.
                </p>
            </div>
            <Input
                placeholder="e.g. Acme Labs"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 text-sm bg-muted/30 border-0 focus-visible:ring-1"
            />
            <NavRow
                showBack={false}
                onNext={() => go(2)}
                nextDisabled={!companyName.trim()}
            />
        </motion.div>,

        // Step 2 — Mission
        <motion.div
            key="b2"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-5"
        >
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Company mission</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Briefly describe what you do — students use this to decide whether to apply.
                </p>
            </div>
            <Textarea
                placeholder="We help small businesses automate their operations through…"
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="h-36 text-sm resize-none bg-muted/30 border-0 focus-visible:ring-1"
            />
            <p className="text-xs text-muted-foreground text-right">{mission.length} / 300</p>
            <NavRow
                onBack={() => go(1)}
                onNext={() => go(3)}
                nextDisabled={!mission.trim()}
            />
        </motion.div>,

        // Step 3 — Confirm
        <motion.div
            key="b3"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="space-y-6 text-center py-4"
        >
            <div className="mx-auto h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center">
                <Building2 className="h-6 w-6 text-background" />
            </div>
            <div>
                <h2 className="text-lg font-semibold tracking-tight">Ready to hire</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                    Post your first project and connect with verified university talent instantly.
                </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border bg-muted/30 p-4 text-left space-y-3">
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Company</p>
                    <p className="text-sm font-semibold">{companyName}</p>
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Mission</p>
                    <p className="text-sm text-foreground leading-relaxed line-clamp-2">{mission}</p>
                </div>
            </div>

            <NavRow
                onBack={() => go(2)}
                onNext={handleSubmit}
                nextLabel="Go to Dashboard"
                loading={loading}
            />
        </motion.div>,
    ]

    const steps = isStudent ? studentSteps : businessSteps
    const currentStepContent = steps[step - 1]

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <div className="mb-10 flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-foreground flex items-center justify-center">
                    <span className="text-background text-[11px] font-black">S</span>
                </div>
                <span className="text-sm font-bold tracking-tight">SkillBridge</span>
            </div>

            {/* Card */}
            <div className="w-full max-w-md">

                {/* Progress bar */}
                <div className="flex gap-1.5 mb-8">
                    {Array.from({ length: maxSteps }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'h-0.5 flex-1 rounded-full transition-all duration-300',
                                i < step ? 'bg-foreground' : 'bg-border'
                            )}
                        />
                    ))}
                </div>

                {/* Step label */}
                <StepLabel current={step} total={maxSteps} />

                {/* Step content */}
                <div className="mt-6 min-h-[420px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        {currentStepContent}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
