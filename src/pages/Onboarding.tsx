import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CaretRight as ChevronRight, ArrowLeft, Check, MagnifyingGlass as Search, X, Sparkle as Sparkles, Buildings as Building2, FileText } from "@phosphor-icons/react"
import { cn } from '@/lib/utils'
import { useUniversities } from '@/hooks/useUniversityData'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { universities as initialCsvUnis } from '@/types/fetchUnis'
import { SearchIcon } from 'lucide-react'

import { ALL_SKILLS } from '@/data/skills'


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
        return q ? ALL_SKILLS.sort().filter((s) => s.toLowerCase().includes(q)) : ALL_SKILLS.sort()
    }, [query])

    return (
        <div className="space-y-4">
            {/* Search */}
            <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                    placeholder="Search skills…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 h-9 text-sm bg-muted/40 border-1 focus-visible:ring-0"
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
                            className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-foreground/95"
                        >
                            {s}
                            <X className="h-3 w-3" />
                        </button>
                    ))}
                </div>
            )}

            {/* Scrollable list */}
            <div className="h-52 overflow-y-auto rounded-lg border bg-muted/20 p-3">
                {query.trim() && !filtered.some(s => s.toLowerCase() === query.toLowerCase().trim()) && (
                    <button
                        onClick={() => {
                            onToggle(query.trim())
                            setQuery('')
                        }}
                        className="w-full mb-3 flex items-center gap-2 p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium border border-primary/20"
                    >
                        Add "{query.trim()}" as a custom skill
                    </button>
                )}

                {filtered.length === 0 && !query.trim() ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No skills match. Try typing to add a custom one.
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

// ─── University picker ──────────────────────────────────────────────────────────

const UniversityCombobox = ({
    value,
    onChange,
    unis,
    placeholder = "Search for your university..."
}: {
    value: string
    onChange: (v: string) => void
    unis: { name: string }[]
    placeholder?: string
}) => {
    const [query, setQuery] = useState('')

    const filteredUniversities =
        query === ''
            ? unis
            : unis.filter((u) =>
                u.name.toLowerCase().includes(query.toLowerCase())
            )

    return (
        <Combobox value={value} onChange={onChange}>
            <div className="relative mt-1">
                <ComboboxInput
                    className={cn(
                        "flex h-10 w-full rounded-md border-1 border-input bg-background px-3 py-2 text-sm ring-offset-background",
                        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                    )}
                    displayValue={(u: string) => u}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={placeholder}
                />
                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredUniversities.length === 0 && query !== '' ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-muted-foreground">
                            Nothing found.
                        </div>
                    ) : (
                        filteredUniversities.map((u) => (
                            <ComboboxOption
                                key={u.name}
                                value={u.name}
                                className="group relative cursor-default select-none py-2 pl-3 pr-9 text-foreground data-[focus]:bg-muted data-[focus]:text-foreground"
                            >
                                <span className="block truncate group-data-[selected]:font-semibold">
                                    {u.name}
                                </span>
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </div>
        </Combobox>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
    const { user, profile, role, refreshProfile } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1)
    const [direction, setDirection] = useState(1)
    const [loading, setLoading] = useState(false)

    // CSV Unis
    const [csvUnis, setCsvUnis] = useState<{ name: string }[]>([])
    useState(() => {
        if (initialCsvUnis.length > 0) {
            setCsvUnis(initialCsvUnis)
        } else {
            fetch("/universities.csv")
                .then(async res => {
                    if (!res.ok) throw new Error("Response not OK");
                    const contentType = res.headers.get("content-type");
                    const text = await res.text();

                    if (text.trim().startsWith("<") || (contentType && contentType.includes("text/html"))) {
                        console.error("Received HTML instead of CSV", { contentType, preview: text.slice(0, 100) });
                        throw new Error("Invalid response content");
                    }
                    return text;
                })
                .then(text => {
                    const lines = text.split("\n").slice(1).filter(l => l.trim())
                    setCsvUnis(lines.map(l => ({ name: l.split(",")[0].trim() })))
                })
                .catch(err => {
                    console.error("Failed to load universities:", err);
                    setCsvUnis([]);
                })
        }
    })

    // Student fields
    const [bio, setBio] = useState(profile?.bio || '')
    const [skills, setSkills] = useState<string[]>(profile?.skills || [])
    const { universities: dbUniversities } = useUniversities()
    const [studentUniName, setStudentUniName] = useState(profile?.company_name || '')
    const isUniversityVerified = !!profile?.university_id

    // Business fields
    const [companyName, setCompanyName] = useState(profile?.company_name || '')
    const [website, setWebsite] = useState(profile?.website || '')
    const [mission, setMission] = useState(profile?.bio || '')


    const isStudent = role === 'student'
    const isUniversity = role === 'university'
    const maxSteps = isStudent ? 4 : 2

    const go = (next: number) => {
        setDirection(next > step ? 1 : -1)
        setStep(next)
    }

    const toggleSkill = (skill: string) =>
        setSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        )

    const [uploadedCv, setUploadedCv] = useState<File | null>(null)
    const [cvUrl, setCvUrl] = useState(profile?.cv_url || '')
    const [cvName, setCvName] = useState(profile?.cv_name || '')

    const handleCvUpload = async (file: File) => {
        setLoading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `profiles/${user?.id}/${fileName}`

            const { data, error } = await supabase.storage
                .from('applications')
                .upload(filePath, file)

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('applications')
                .getPublicUrl(filePath)

            setCvUrl(publicUrl)
            setCvName(file.name)
            setUploadedCv(file)
            toast.success('CV uploaded successfully')
        } catch (err: any) {
            toast.error(err.message || 'Failed to upload CV')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!user) return
        setLoading(true)
        try {
            let payload: any = {}
            if (isStudent) {
                // Try to find if the selected university exists in DB
                const matchedDbUni = dbUniversities.find(u => u.full_name?.toLowerCase() === studentUniName.toLowerCase() || u.company_name?.toLowerCase() === studentUniName.toLowerCase())
                payload = {
                    bio,
                    skills,
                    company_name: studentUniName,
                    university_id: matchedDbUni ? matchedDbUni.id : null,
                    cv_url: cvUrl,
                    cv_name: cvName
                }
            } else if (isUniversity) {
                payload = { company_name: companyName, website: website, bio: mission, full_name: companyName, university_id: user.id } // Ensure full_name is also updated for DB lookup
            } else {
                payload = { company_name: companyName, bio: mission }
            }

            const { error } = await supabase
                .from('profiles')
                .update(payload)
                .eq('id', user.id)

            if (error) throw error
            await refreshProfile()
            navigate(
                role === 'student' ? '/student/dashboard' : role === 'university' ? '/university/dashboard' : '/employer/dashboard',
                { replace: true }
            )
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    // If we are still resolving the session or profile, show a simple loader
    if (!role || (isStudent && !csvUnis.length)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm text-muted-foreground animate-pulse">Setting up your experience...</p>
                </div>
            </div>
        )
    }

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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    Hey there! 👋 Let's get you set up. First, what's your university?
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    We'll match you with projects looking for students from your institution.
                </p>
            </div>

            <div className="space-y-4 max-w-lg">
                {isUniversityVerified ? (
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 text-foreground shadow-sm">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{dbUniversities.find(u => u.id === profile?.university_id)?.full_name || 'Verified University'}</p>
                            <p className="text-[13px] text-muted-foreground mt-0.5">Your account is verified and strictly linked.</p>
                        </div>
                        <Badge variant="secondary" className="bg-success/15 text-success hover:bg-success/20 flex items-center gap-1 py-1">
                            <Check className="h-3.5 w-3.5" /> Verified
                        </Badge>
                    </div>
                ) : (
                    <UniversityCombobox
                        value={studentUniName}
                        onChange={setStudentUniName}
                        unis={csvUnis}
                        placeholder="Search for your university..."
                    />
                )}
            </div>

            <NavRow
                showBack={false}
                onNext={() => go(2)}
                nextDisabled={(!isUniversityVerified && !(studentUniName || '').trim())}
                nextLabel="Sounds good"
            />
        </motion.div>,

        // Step 2 — Bio
        <motion.div
            key="s2"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    Nice! Now, tell us a bit about yourself.
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    A short bio helps businesses know who they are working with. Keep it casual but professional.
                </p>
            </div>

            <div className="space-y-2 max-w-lg">
                <Textarea
                    placeholder="e.g. I'm a final-year Computer Science student passionate about building clean, fast web apps…"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="h-36 text-base resize-none bg-muted/30 focus-visible:ring-primary rounded-xl p-4"
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length} / 300 characters</p>
            </div>

            <NavRow
                onBack={() => go(1)}
                onNext={() => go(3)}
                nextDisabled={!(bio || '').trim()}
                nextLabel="Next up: Skills"
            />
        </motion.div>,

        // Step 3 — Skills
        <motion.div
            key="s3"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    What are your superpowers? ⚡
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    Tag the skills that represent your strengths. We'll use these to match you with the perfect projects.
                </p>
            </div>
            
            <div className="max-w-xl">
                <SkillPicker selected={skills} onToggle={toggleSkill} />
            </div>

            <NavRow
                onBack={() => go(2)}
                onNext={() => go(4)}
                nextDisabled={skills.length === 0}
                nextLabel="Let's add your CV"
            />
        </motion.div>,

        // Step 4 — CV Upload
        <motion.div
            key="s4"
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    Almost done! Got a CV handy?
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    Having your CV on file makes applying for projects a one-click breeze. (You can always skip this for now).
                </p>
            </div>

            <div className="space-y-4 max-w-lg">
                <div
                    className={cn(
                        "group relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer",
                        cvUrl ? "border-primary bg-primary/5" : "border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40"
                    )}
                    onClick={() => document.getElementById('cv-upload')?.click()}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                        cvUrl ? "bg-primary text-white" : "bg-background border text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20"
                    )}>
                        {cvUrl ? <Check className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                    </div>
                    <div className="text-center">
                        <p className={cn("text-base font-semibold", cvUrl ? "text-primary" : "text-foreground")}>
                            {cvName || "Click to upload CV"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            PDF or DOCX (Max 10MB)
                        </p>
                    </div>
                    <input
                        id="cv-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleCvUpload(file)
                        }}
                    />
                </div>

                {cvUrl && (
                    <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium text-success flex items-center justify-center gap-1.5">
                        <Check className="h-4 w-4" /> Looking good! Your CV is attached.
                    </motion.p>
                )}
            </div>

            <NavRow
                onBack={() => go(3)}
                onNext={handleSubmit}
                nextLabel={cvUrl ? "Finish & Browse Projects" : "Skip & Finish"}
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    {isUniversity ? "Welcome! Let's set up your university portal." : "Welcome! 👋 Let's set up your business profile."}
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    {isUniversity
                        ? "First, select your institution from the list."
                        : "What is the name of your company? This is what students will see."}
                </p>
            </div>

            <div className="max-w-lg">
                {isUniversity ? (
                    <div className="space-y-5">
                        <UniversityCombobox
                            value={companyName}
                            onChange={setCompanyName}
                            unis={csvUnis}
                            placeholder="Search for your university..."
                        />
                        <div className="space-y-2">
                            <Label className="text-base font-medium">University Website</Label>
                            <Input
                                placeholder="e.g. https://www.bath.ac.uk"
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="h-12 text-base bg-muted/30 focus-visible:ring-primary rounded-xl px-4"
                            />
                        </div>
                    </div>
                ) : (
                    <Input
                        placeholder="e.g. Acme Labs"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="h-12 text-lg bg-muted/30 focus-visible:ring-primary rounded-xl px-4"
                    />
                )}
            </div>

            <NavRow
                showBack={false}
                onNext={() => go(2)}
                nextDisabled={!(companyName || '').trim() || (isUniversity && !(website || '').trim())}
                nextLabel="Looks great"
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
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col gap-6"
        >
            <div>
                <h2 className="text-2xl sm:text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    {isUniversity ? "What's the goal of your portal?" : "Awesome. What's your mission?"}
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                    {isUniversity
                        ? "Briefly describe your institution and programs for students."
                        : "Tell students a bit about what you do. A compelling mission attracts top talent!"}
                </p>
            </div>
            
            <div className="space-y-2 max-w-lg">
                <Textarea
                    placeholder={isUniversity ? "Tell students about your institution..." : "e.g. We're on a mission to help small businesses automate their operations…"}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="h-40 text-base resize-none bg-muted/30 focus-visible:ring-primary rounded-xl p-4"
                />
                <p className="text-xs text-muted-foreground text-right">{mission.length} / 500 characters</p>
            </div>
            
            <NavRow
                onBack={() => go(1)}
                onNext={handleSubmit}
                nextDisabled={!(mission || '').trim()}
                nextLabel="Finish Setup"
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
