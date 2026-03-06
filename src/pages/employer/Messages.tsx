import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchMessageThreads } from "@/hooks/useMessages";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
    WarningCircle,
    ChatCircleDots,
    Briefcase,
    MagnifyingGlass
} from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";

// --- Helpers ---
const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
};

export default function EmployerMessagesHub() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { threads, loading, error } = useFetchMessageThreads(user?.id ?? null);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    };

    return (
        <div className="page-container flex flex-col py-8 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
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
                        Inbox
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your communications with accepted students.
                    </p>
                </div>

                {/* Search Bar - Placeholder for now */}
                <div className="relative w-full md:w-72">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {error ? (
                    <div className="m-6 rounded-xl border border-red-100 bg-red-50 p-6 flex items-start gap-4">
                        <WarningCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" weight="fill" />
                        <div>
                            <h3 className="text-sm font-semibold text-red-800">Failed to load messages</h3>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    </div>
                ) : loading ? (
                    <div className="divide-y divide-border">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-4 sm:px-6 flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <Skeleton className="h-3 w-48" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : threads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                        <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-6">
                            <ChatCircleDots className="w-8 h-8" weight="duotone" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No active conversations</h3>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            When students reach out or apply for your projects, their message threads will appear here.
                        </p>
                    </div>
                ) : (
                    <motion.ul
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="divide-y divide-border"
                    >
                        <AnimatePresence>
                            {threads.map((thread) => {
                                const isUnread = thread.unread_count > 0;

                                return (
                                    <motion.li
                                        key={thread.project_id}
                                        variants={itemVariants}
                                        onClick={() => navigate(`/project/${thread.project_id}/messages`)}
                                        className={cn(
                                            "group relative p-4 sm:px-6 cursor-pointer transition-colors duration-200 flex items-start gap-4 hover:bg-muted/40",
                                            isUnread ? "bg-primary/5" : "bg-card"
                                        )}
                                    >
                                        {/* Avatar */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                                            isUnread ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            {getInitials(thread.other_user_name)}
                                        </div>

                                        {/* Message Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-center mt-0.5">
                                            {/* Top Row: Name & Date */}
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className={cn(
                                                    "truncate text-[15px]",
                                                    isUnread ? "font-bold text-foreground" : "font-semibold text-foreground/90"
                                                )}>
                                                    {thread.other_user_name}
                                                </span>
                                                {thread.last_message_at && (
                                                    <span className={cn(
                                                        "text-xs whitespace-nowrap ml-3 shrink-0",
                                                        isUnread ? "text-primary font-semibold" : "text-muted-foreground"
                                                    )}>
                                                        {isToday(new Date(thread.last_message_at))
                                                            ? format(new Date(thread.last_message_at), 'h:mm a')
                                                            : format(new Date(thread.last_message_at), 'MMM d')}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Middle Row: Project Context */}
                                            <div className="flex items-center gap-1.5 mb-1.5 text-[13px] text-muted-foreground">
                                                <Briefcase className="w-3.5 h-3.5 shrink-0" weight="fill" />
                                                <span className="truncate uppercase tracking-wide text-[10px] font-bold">
                                                    {thread.project_title}
                                                </span>
                                            </div>

                                            {/* Bottom Row: Message Preview & Unread Badge */}
                                            <div className="flex justify-between items-center gap-4">
                                                <p className={cn(
                                                    "text-[14px] truncate leading-snug",
                                                    isUnread ? "text-foreground font-medium" : "text-muted-foreground"
                                                )}>
                                                    {thread.last_message || "No messages yet."}
                                                </p>

                                                {isUnread && (
                                                    <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shrink-0 shadow-sm">
                                                        {thread.unread_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.li>
                                );
                            })}
                        </AnimatePresence>
                    </motion.ul>
                )}
            </div>
        </div>
    );
}

