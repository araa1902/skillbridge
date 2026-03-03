import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const fadeUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
}

interface DashboardGreetingProps {
    firstName: string
    subtext: string
    action?: React.ReactNode
    className?: string
}

export const DashboardGreeting = ({
    firstName,
    subtext,
    action,
    className,
}: DashboardGreetingProps) => {
    const hour = new Date().getHours()
    let timeGreeting = "Welcome Back"

    if (hour >= 0 && hour < 12) timeGreeting = "Good Morning"
    else if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon"
    else timeGreeting = "Good Evening"

    return (
        <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.3 }}
            className={cn("flex flex-col sm:flex-row sm:items-start justify-between gap-4", className)}
        >
            <div>
                <h1 className="text-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    {timeGreeting}, <span className="text-primary">{firstName}</span>
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                    {subtext}
                </p>
            </div>
            {action && <div className="shrink-0 pt-1">{action}</div>}
        </motion.div>
    )
}
