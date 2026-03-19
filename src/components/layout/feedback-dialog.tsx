import { useState } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquarePlus, MessageSquareTextIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface FeedbackDialogProps {
  isCollapsed: boolean
}

export function FeedbackDialog({ isCollapsed }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profile, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalCategory = category === "other" ? customCategory.trim() : category
    if (!finalCategory || !feedback.trim() || !user?.id) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user.id,
        category: finalCategory,
        content: feedback.trim(),
        status: "new",
      })

      if (error) throw error

      toast.success("Feedback submitted successfully")
      setOpen(false)
      setFeedback("")
      setCategory("")
      setCustomCategory("")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerButton = (
    <motion.button
      whileHover="hover"
      initial="initial"
      className={cn(
        "nav-item flex w-full items-center",
        "transition-colors duration-150",
        isCollapsed ? "justify-center px-0 w-10 mx-auto h-10" : "gap-3 px-3 h-10"
      )}
    >
      <motion.div
        variants={{
          hover: { scale: 1.1 },
          initial: { scale: 1 }
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <MessageSquareTextIcon className="nav-item__icon flex-shrink-0 h-5 w-5" />
      </motion.div>
      {!isCollapsed && <span>Send feedback</span>}
    </motion.button>
  )

  const content = (
    <DialogTrigger asChild>
      {triggerButton}
    </DialogTrigger>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isCollapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={14}>Send feedback</TooltipContent>
        </Tooltip>
      ) : (
        content
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Send feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1 block px-1">Name</label>
              <Input
                value={profile?.full_name || ""}
                readOnly
                tabIndex={-1}
                className="bg-muted/30 border-input/40 focus-visible:ring-0 text-muted-foreground/70 cursor-not-allowed opacity-80"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1 block px-1">Email</label>
              <Input
                value={user?.email || ""}
                readOnly
                tabIndex={-1}
                className="bg-muted/30 border-input/40 focus-visible:ring-0 text-muted-foreground/70 cursor-not-allowed opacity-80"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 block px-1">Category <span className="text-destructive">*</span></label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-muted/30 focus:ring-0 border-input/50">
                <SelectValue placeholder="What is this about?" />
              </SelectTrigger>
              <SelectContent>
                {/* Core Platform Features */}
                <SelectItem value="project_search">Project Search & Discovery</SelectItem>
                <SelectItem value="project_applications">Project Applications</SelectItem>
                <SelectItem value="messaging_inbox">Messaging & Inbox</SelectItem>
                <SelectItem value="profiles_references">Profiles & References</SelectItem>
                <SelectItem value="credentials_badges">Credentials & Skill Badges</SelectItem>

                {/* Financials (Phase 7) */}
                <SelectItem value="payments_escrow">Payments & Escrow</SelectItem>

                {/* Institutional (Phase 6) */}
                <SelectItem value="university_portal">University Analytics & Reporting</SelectItem>

                {/* Technical & Growth */}
                <SelectItem value="account_security">Account & Security</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="ux_feedback">General Usability Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {category === "other" && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 block px-1">Specific Category <span className="text-destructive">*</span></label>
              <Input
                placeholder="What is this about?"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="bg-muted/30 border-input/50 focus-visible:ring-1 focus-visible:ring-primary/20"
                required
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 block px-1">Message <span className="text-destructive">*</span></label>
            <Textarea
              placeholder="Tell us more about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none bg-muted/30 border-input/50 focus-visible:ring-1 focus-visible:ring-primary/20"
              required
              autoFocus
            />
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!category || (category === "other" && !customCategory.trim()) || !feedback.trim() || isSubmitting}
              className="bg-[#4fbcae] hover:bg-[#3ea295] text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
