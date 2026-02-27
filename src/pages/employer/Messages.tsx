import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchMessageThreads } from "@/hooks/useMessages";
import { motion, AnimatePresence } from "framer-motion";
import { ChatCircleDots, UserCircle, CaretRight, WarningCircle, CaretRightIcon } from "@phosphor-icons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function EmployerMessagesHub() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { threads, loading, error } = useFetchMessageThreads(user?.id ?? null);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
    };

    return (
        <div className="page-container py-8 flex-1">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Inbox</h1>
                    <p className="text-muted-foreground text-sm max-w-xl">
                        Manage conversations with students across all your active projects.
                    </p>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 flex items-start gap-4">
                    <WarningCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" weight="fill" />
                    <div>
                        <h3 className="text-sm font-semibold text-red-800">Failed to load messages</h3>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                </div>
            ) : loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-1/3 bg-muted" />
                                <Skeleton className="h-4 w-2/3 bg-muted" />
                            </div>
                            <Skeleton className="h-4 w-16 bg-muted" />
                        </div>
                    ))}
                </div>
            ) : threads.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-3xl bg-muted/30"
                >
                    <div className="w-16 h-16 bg-primary-subtle text-primary rounded-full flex items-center justify-center mb-6">
                        <ChatCircleDots className="w-8 h-8" weight="duotone" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Inbox is empty</h3>
                    <p className="text-muted-foreground text-sm max-w-sm">
                        When candidates message you regarding your projects, their inquiries will appear here.
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid gap-4"
                >
                    <AnimatePresence>
                        {threads.map((thread) => (
                            <motion.div
                                key={thread.project_id}
                                variants={itemVariants}
                                onClick={() => navigate(`/project/${thread.project_id}/messages`)}
                                className={cn(
                                    "group relative overflow-hidden bg-card hover:bg-muted/40 transition-all duration-300",
                                    "border border-border hover:border-border-heavy rounded-2xl p-5 cursor-pointer",
                                    "flex items-center gap-5 shadow-sm hover:shadow-md"
                                )}
                            >
                                <div className="relative">
                                    <div className="w-12 h-12 bg-primary-subtle text-primary rounded-full flex items-center justify-center">
                                        <UserCircle className="w-7 h-7" weight="duotone" />
                                    </div>
                                    {thread.unread_count > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-card z-10 border-2 border-background">
                                            {thread.unread_count}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={cn(
                                            "text-base font-semibold truncate pr-4",
                                            thread.unread_count > 0 ? "text-foreground" : "text-foreground/90"
                                        )}>
                                            {thread.project_title}
                                        </h3>
                                        {thread.last_message_at && (
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
                                            </span>
                                        )}
                                    </div>

                                    <p className={cn(
                                        "text-sm truncate pr-8",
                                        thread.unread_count > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                                    )}>
                                        {thread.last_message ? thread.last_message : "Click to view conversation"}
                                    </p>
                                </div>

                                <div className="absolute right-5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 translate-y-4 duration-300">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CaretRightIcon className="w-4 h-4 text-primary" weight="bold" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    );
}
