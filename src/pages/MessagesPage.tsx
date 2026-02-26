import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useFetchProjectMessages, sendMessage, markProjectMessagesAsRead } from '@/hooks/useMessages'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/hooks/use-toast'
import { format, isToday, isYesterday } from 'date-fns'
import { ArrowLeft, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  title: string
  business_id: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return format(date, 'h:mm a')
  if (isYesterday(date)) return `Yesterday ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, h:mm a')
}

function formatDateDivider(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a), db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MessageSkeleton() {
  return (
    <div className="space-y-2 px-6 py-8">
      {[
        { mine: false, w: 'w-[42%]' },
        { mine: false, w: 'w-[56%]' },
        { mine: true, w: 'w-[38%]' },
        { mine: true, w: 'w-[50%]' },
        { mine: false, w: 'w-[44%]' },
      ].map(({ mine, w }, i) => (
        <div key={i} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
          <Skeleton className={cn('h-10 rounded-2xl', w, mine ? 'rounded-br-sm' : 'rounded-bl-sm')} />
        </div>
      ))}
    </div>
  )
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-6">
      <span className="text-[11px] font-medium text-neutral-400 tracking-wide select-none">
        {label}
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center h-full pt-24 pb-32 text-center select-none"
    >
      <p className="text-base font-semibold text-neutral-800 mb-1">Start the conversation</p>
      <p className="text-sm text-neutral-400 max-w-[240px] leading-relaxed">
        Send your first message about this project.
      </p>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { projectId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const { messages, loading, error, refetch } = useFetchProjectMessages(projectId ?? null)
  const [project, setProject] = useState<Project | null>(null)
  const [messageContent, setMessageContent] = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const targetId = searchParams.get('to')

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!projectId) return
    supabase
      .from('projects')
      .select('business_id, title')
      .eq('id', projectId)
      .single()
      .then(({ data }) => setProject(data))
  }, [projectId])

  useEffect(() => {
    if (projectId && user?.id) {
      markProjectMessagesAsRead(projectId, user.id).catch(console.error)
    }
  }, [projectId, user?.id])

  // ── Scroll to bottom ───────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Auto-grow textarea ─────────────────────────────────────────────────────

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 148)}px`
  }, [messageContent])

  // ── Recipient helpers ──────────────────────────────────────────────────────

  const otherMessage = messages.find((m) => m.sender_id !== user?.id)
  const recipientName = otherMessage?.sender_name ?? (project?.title ? `Re: ${project.title}` : '…')
  const recipientAvatar = otherMessage?.sender_avatar ?? undefined

  // ── Send ───────────────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async () => {
    const trimmed = messageContent.trim()
    if (!trimmed || !projectId || !user?.id) return

    let receiverId =
      targetId ||
      (user.role === 'student' && project?.business_id
        ? project.business_id
        : otherMessage?.sender_id ?? '')

    if (!receiverId) {
      toast({
        title: 'Cannot send message',
        description: 'Could not determine the recipient. Return to the applications page and try again.',
        variant: 'destructive',
      })
      return
    }

    setSending(true)

    const { error: sendError } = await sendMessage({
      project_id: projectId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: trimmed,
    })

    if (sendError) {
      toast({ title: 'Send failed', description: sendError, variant: 'destructive' })
    } else {
      setMessageContent('')
      refetch()
    }

    setSending(false)
    textareaRef.current?.focus()
  }, [messageContent, projectId, user, targetId, project, otherMessage, toast, refetch])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // ── Render messages ────────────────────────────────────────────────────────

  const renderMessages = () => {
    return messages.map((msg, index) => {
      const isMine = msg.sender_id === user?.id
      const prev = index > 0 ? messages[index - 1] : null
      const next = index < messages.length - 1 ? messages[index + 1] : null

      const isFirstInGroup = !prev || prev.sender_id !== msg.sender_id
      const isLastInGroup = !next || next.sender_id !== msg.sender_id
      const showDivider = !prev || !isSameDay(prev.created_at, msg.created_at)

      // Bubble corner shaping: consecutive bubbles from same sender share edge, only first/last get the "tail"
      const bubbleShape = isMine
        ? cn(
          'rounded-[20px]',
          isFirstInGroup && !isLastInGroup && 'rounded-tr-[6px]',
          !isFirstInGroup && isLastInGroup && 'rounded-br-[6px]',
          !isFirstInGroup && !isLastInGroup && 'rounded-r-[6px]',
        )
        : cn(
          'rounded-[20px]',
          isFirstInGroup && !isLastInGroup && 'rounded-tl-[6px]',
          !isFirstInGroup && isLastInGroup && 'rounded-bl-[6px]',
          !isFirstInGroup && !isLastInGroup && 'rounded-l-[6px]',
        )

      return (
        <div key={msg.id}>
          {showDivider && <DateDivider label={formatDateDivider(msg.created_at)} />}

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={cn(
              'flex w-full items-end gap-2.5',
              isMine ? 'justify-end' : 'justify-start',
              isFirstInGroup ? 'mt-4' : 'mt-[3px]'
            )}
          >
            {/* Other-party avatar */}
            {!isMine && (
              <div className="w-8 flex-shrink-0 self-end mb-0.5">
                {isLastInGroup ? (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-semibold">
                    {msg.sender_name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                ) : (
                  <div className="h-8 w-8" />
                )}
              </div>
            )}

            {/* Bubble */}
            <div className={cn('flex flex-col max-w-[72%] md:max-w-[60%] lg:max-w-[52%]', isMine ? 'items-end' : 'items-start')}>
              {!isMine && isFirstInGroup && (
                <p className="text-xs font-semibold text-neutral-500 mb-1 ml-0.5">
                  {msg.sender_name}
                </p>
              )}

              <div
                className={cn(
                  'px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap',
                  bubbleShape,
                  isMine
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                )}
              >
                {msg.content}
              </div>

              {/* Timestamp — only on last in group */}
              {isLastInGroup && (
                <p className={cn(
                  'text-[10px] mt-1.5 select-none font-medium',
                  isMine ? 'text-neutral-400 pr-0.5' : 'text-neutral-400 pl-0.5'
                )}>
                  {formatMessageTime(msg.created_at)}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )
    })
  }

  // ── Error state ────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh] p-6">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center max-w-sm">
          <p className="text-sm font-semibold text-red-700 mb-1">Failed to load messages</p>
          <p className="text-xs text-red-400 mb-5">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-200 text-neutral-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Go back
          </Button>
        </div>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] w-full bg-white sm:rounded-2xl overflow-hidden sm:border border-neutral-200/80 sm:shadow-sm">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-3.5 sm:px-6 border-b border-neutral-100 bg-white shrink-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900 -ml-1"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-700 text-sm font-semibold">
          {recipientName.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col min-w-0">
          <h2 className="text-sm font-semibold text-neutral-900 truncate leading-tight">{recipientName}</h2>
          {project && (
            <p className="text-xs text-neutral-400 truncate leading-tight mt-0.5">{project.title}</p>
          )}
        </div>
      </div>

      {/* ── Messages scroll area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 pt-4 pb-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <MessageSkeleton />
            ) : messages.length === 0 ? (
              <EmptyState />
            ) : (
              <div>
                {renderMessages()}
                <div ref={bottomRef} className="h-1" />
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Input section ── */}
      <div className="bg-white px-4 pb-6 pt-2 sm:px-6 border-t border-neutral-100">
        <div className="mx-auto max-w-7xl">
          <div
            className={cn(
              'flex items-end gap-3 rounded-[26px] border border-neutral-200 bg-white px-4 py-3',
              'shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow duration-200',
              'focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.10)] focus-within:border-neutral-300'
            )}
          >
            <Textarea
              ref={textareaRef}
              placeholder="Message…"
              rows={1}
              className={cn(
                'flex-1 resize-none border-0 bg-transparent p-0 shadow-none',
                'text-sm text-neutral-900 leading-relaxed',
                'placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none',
                'min-h-[24px] max-h-[148px]'
              )}
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              autoFocus
            />

            <button
              onClick={handleSendMessage}
              disabled={sending || !messageContent.trim()}
              aria-label="Send message"
              className={cn(
                'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200',
                messageContent.trim() && !sending
                  ? 'bg-neutral-900 text-white hover:bg-neutral-700 scale-100'
                  : 'bg-neutral-200 text-neutral-400 scale-95 cursor-not-allowed'
              )}
            >
              {sending ? (
                <div className="h-3.5 w-3.5 border-[1.5px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
