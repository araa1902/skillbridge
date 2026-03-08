import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    GithubLogo,
    FigmaLogo,
    GoogleLogo,
    NotionLogoIcon,
    MicrosoftWordLogoIcon,
    GoogleLogoIcon,
    FilePdfIcon,
    EyeIcon,
    CaretRight as ChevronRight
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface SubmitDeliverableDialogProps {
    applicationId: string | null
    onClose: () => void
    onSuccess: () => void
    initialLink?: string
}

const isValidUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === "https:";
    } catch {
        return false;
    }
};

export const SubmitDeliverableDialog = ({
    applicationId,
    onClose,
    onSuccess,
    initialLink = ""
}: SubmitDeliverableDialogProps) => {
    const [deliverableLink, setDeliverableLink] = useState(initialLink)

    useEffect(() => {
        if (applicationId) {
            setDeliverableLink(initialLink)
        }
    }, [applicationId, initialLink])
    const [submitting, setSubmitting] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async () => {
        if (!applicationId || !deliverableLink.trim()) return
        setSubmitting(true)

        const { error } = await supabase
            .from("applications")
            .update({ deliverable_link: deliverableLink.trim() })
            .eq("id", applicationId)

        setSubmitting(false)
        if (error) {
            toast({
                title: "Failed to submit",
                description: error.message,
                variant: "destructive"
            })
        } else {
            toast({ title: "Work submitted!" })
            setDeliverableLink("")
            onSuccess()
            onClose()
        }
    }

    return (
        <Dialog
            open={!!applicationId}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                    setDeliverableLink("")
                }
            }}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                                Submit your work
                            </DialogTitle>
                            <DialogDescription className="mt-1.5 text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                                Paste the link to your completed deliverable below.
                            </DialogDescription>
                        </div>

                        {/* Body */}
                        <div className="space-y-6">
                            {/* URL input section */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700">Deliverable URL</label>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: deliverableLink ? 1 : 0 }}
                                        className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                            deliverableLink && !isValidUrl(deliverableLink)
                                                ? "text-rose-600 bg-rose-50"
                                                : "text-green-600 bg-green-50"
                                        )}
                                    >
                                        {deliverableLink && !isValidUrl(deliverableLink) ? "Invalid Link" : "Valid Link"}
                                    </motion.span>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={deliverableLink}
                                        onChange={(e) => setDeliverableLink(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                        className={cn(
                                            "w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 font-medium",
                                            "outline-none transition-all duration-200",
                                            "bg-white",
                                            deliverableLink && !isValidUrl(deliverableLink)
                                                ? "border-rose-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                                                : "border-gray-200 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
                                        )}
                                    />
                                    {submitting && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Platform Hints */}
                            <div className="space-y-3 text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recommended Platforms</p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {[
                                        { name: "GitHub", icon: GithubLogo },
                                        { name: "Figma", icon: FigmaLogo },
                                        { name: "Drive", icon: GoogleLogo },
                                        { name: "Notion", icon: NotionLogoIcon },
                                        { name: "Word", icon: MicrosoftWordLogoIcon },
                                        { name: "Docs", icon: GoogleLogoIcon },
                                        { name: "PDF", icon: FilePdfIcon },
                                    ].map((platform) => (
                                        <div
                                            key={platform.name}
                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/50 border border-gray-200/50 text-[10px] font-medium text-gray-500"
                                        >
                                            <platform.icon className="h-3 w-3" />
                                            {platform.name}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reminder Box */}
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 flex gap-3">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                                    <EyeIcon weight="bold" className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-gray-900">Visibility Check</p>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Make sure your link is public so reviewers can access your file.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 h-11 rounded-xl text-gray-500 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!deliverableLink.trim() || !isValidUrl(deliverableLink) || submitting}
                                className={cn(
                                    "flex-[1.5] h-11 inline-flex items-center justify-center gap-2 rounded-xl text-white font-bold text-sm bg-gray-900",
                                    "transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]",
                                    "disabled:opacity-40 disabled:cursor-not-allowed"
                                )}
                            >
                                {submitting ? "Submitting..." : "Complete & Submit"}
                                {!submitting && <ChevronRight weight="bold" className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}
