import { useState } from "react"
import { useLocation } from "react-router-dom"
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
import { MessageSquarePlus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UserFeedback } from "@carbon/icons-react"

interface FeedbackDialogProps {
  isCollapsed: boolean
}

export function FeedbackDialog({ isCollapsed }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { profile, user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !feedback.trim() || !user?.id) return

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user.id,
        category,
        content: feedback.trim(),
        status: "new",
      })

      if (error) throw error

      toast.success("Feedback submitted successfully")
      setOpen(false)
      setFeedback("")
      setCategory("")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerButton = (
    <button
      className={cn(
        "flex w-full items-center rounded-xl text-sm font-500",
        "text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
      )}
    >
      <UserFeedback className={cn("flex-shrink-0", isCollapsed ? "w-5 h-5" : "w-4 h-4")} />
      {!isCollapsed && <span>Send feedback</span>}
    </button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>{triggerButton}</TooltipTrigger>
            <TooltipContent side="right" sideOffset={14}>Send feedback</TooltipContent>
          </Tooltip>
        ) : (
          triggerButton
        )}
      </DialogTrigger>
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
                <SelectItem value="project_search">Project Search & Discovery</SelectItem>
                <SelectItem value="project_applications">Project Applications</SelectItem>
                <SelectItem value="mentorship_sessions">Mentorship Sessions</SelectItem>
                <SelectItem value="messaging_inbox">Messaging & Inbox</SelectItem>
                <SelectItem value="profiles_references">Profiles & References</SelectItem>
                <SelectItem value="account_security">Account & Security</SelectItem>
                <SelectItem value="bug_report">Bug Report</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!category || !feedback.trim() || isSubmitting}
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
