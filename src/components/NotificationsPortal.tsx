import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/contexts/NotificationContext'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowRight,
  ChatCircleTextIcon,
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  BellIcon
} from '@phosphor-icons/react'
import { BriefcaseIcon } from 'lucide-react'

// Helper to get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'application':
    case 'job':
      return <BriefcaseIcon height="fill" className="text-blue-500" />
    case 'message':
    case 'chat':
      return <ChatCircleTextIcon weight="fill" className="text-emerald-500" />
    case 'reference':
    case 'success':
      return <CheckCircleIcon weight="fill" className="text-green-500" />
    case 'alert':
    case 'warning':
      return <WarningCircleIcon weight="fill" className="text-amber-500" />
    case 'system':
    case 'info':
      return <InfoIcon weight="fill" className="text-slate-500" />
    default:
      return <BellIcon weight="fill" className="text-slate-400" />
  }
}

export function NotificationsPortal({ isCollapsed }: { isCollapsed?: boolean }) {
  const [open, setOpen] = useState(false)
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const navigate = useNavigate()

  const handleNotificationClick = async (id: string, actionUrl: string | null) => {
    await markAsRead(id)
    setOpen(false)
    if (actionUrl) {
      navigate(actionUrl)
    }
  }

  const trigger = (
    <button
      id="notifications-trigger"
      className={cn(
        "nav-item group relative flex items-center transition-all duration-200",
        isCollapsed ? "justify-center px-0 w-10 mx-auto h-10" : "gap-3 px-3 h-10 w-full"
      )}
    >
      <div className="relative flex-shrink-0">
        <BellIcon
          weight={unreadCount > 0 ? "fill" : "bold"}
          className={cn(
            "nav-item__icon transition-transform duration-200 group-hover:scale-110 h-5 w-5",
            unreadCount > 0 && "text-primary opacity-100"
          )}
        />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              key="notification-badge"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 30 }}
              className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-primary px-1 text-[8px] font-bold tabular-nums text-primary-foreground ring-2 ring-background shadow-sm pointer-events-none"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {!isCollapsed && (
        <span className="text-sm font-medium flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
          Notifications
        </span>
      )}
    </button>
  );

  const content = (
    <SheetTrigger asChild>
      {trigger}
    </SheetTrigger>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {isCollapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={14}>
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </TooltipContent>
        </Tooltip>
      ) : (
        content
      )}

      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 border-l border-border/40 shadow-2xl z-[100]">
        <SheetHeader className="px-6 py-5 border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <SheetTitle className="text-xl font-bold tracking-tight">Notifications</SheetTitle>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread message${unreadCount === 1 ? '' : 's'}`
                  : 'You\'re all caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllAsRead()}
                className="text-primary hover:text-primary/80 hover:bg-primary/5 text-xs font-semibold h-8 px-3 rounded-full transition-colors"
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <BellIcon weight="thin" className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">Stay updated</h3>
                <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
                  We'll notify you when something important happens in your Skillbridge journey.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {notifications.map((n, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={n.id}
                    onClick={() => handleNotificationClick(n.id, n.action_url)}
                    className={cn(
                      "group w-full text-left p-6 transition-all duration-200 hover:bg-muted/40 relative",
                      !n.is_read && "after:absolute after:left-0 after:top-0 after:bottom-0 after:w-1 after:bg-primary"
                    )}
                  >
                    <div className="flex gap-4">
                      <div className="shrink-0 mt-0.5">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                          !n.is_read ? "bg-primary/10" : "bg-muted"
                        )}>
                          {getNotificationIcon(n.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-semibold leading-none",
                            !n.is_read ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {n.title}
                          </p>
                          <time className="text-[10px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                            {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                          </time>
                        </div>
                        <p className={cn(
                          "text-sm leading-relaxed line-clamp-2",
                          !n.is_read ? "text-muted-foreground" : "text-muted-foreground/60"
                        )}>
                          {n.content}
                        </p>
                        {n.action_url && !n.is_read && (
                          <div className="pt-1.5 flex items-center text-[11px] font-bold text-primary gap-1 group/btn opacity-0 group-hover:opacity-100 transition-opacity">
                            View details
                            <ArrowRight weight="bold" className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

