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
import { ArrowLeftIcon, ArrowUpIcon, HandshakeIcon } from "@phosphor-icons/react"
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  title: string
  business_id: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMessageTime(dateString: string): string {
  const date = new Date(dateString)
  if (isToday(date)) return format(date, 'HH:mm')
  if (isYesterday(date)) return `Yesterday ${format(date, 'HH:mm')}`
  return format(date, 'MMM d, HH:mm')
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
    <div className="space-y-6 px-6 py-8">
      {[
        { mine: false, w: 'w-[42%]' },
        { mine: false, w: 'w-[56%]' },
        { mine: true, w: 'w-[38%]' },
        { mine: true, w: 'w-[50%]' },
        { mine: false, w: 'w-[44%]' },
      ].map(({ mine, w }, i) => (
        <div key={i} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
          <Skeleton className={cn('h-12 rounded-2xl', w, mine ? 'rounded-br-none bg-primary/10' : 'rounded-bl-none bg-muted')} />
        </div>
      ))}
    </div>
  )
}

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent op-40" />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] select-none">
        {label}
      </span>
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent op-40" />
    </div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-32 text-center select-none"
    >
      <div className="w-16 h-16 bg-primary-subtle rounded-3xl flex items-center justify-center mb-6 border border-primary/10">
        <HandshakeIcon className="w-7 h-7 text-primary" strokeWidth={2.5} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">Connect & Collaborate</h3>
      <p className="text-sm text-muted-foreground max-w-[280px] leading-relaxed">
        Send your first message to kick off the project.
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
  const [recipientProfile, setRecipientProfile] = useState<{ full_name: string } | null>(null)
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
  }, [projectId, user?.id, messages.length])

  useEffect(() => {
    if (!targetId) return
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', targetId)
      .single()
      .then(({ data }) => setRecipientProfile(data))
  }, [targetId])

  // ── Scroll to bottom ───────────────────────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  // ── Auto-grow textarea ─────────────────────────────────────────────────────

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 148)}px`
  }, [messageContent])

  // ── Recipient helpers ──────────────────────────────────────────────────────

  const firstMessage = messages[0]
  const threadOtherUserId = firstMessage
    ? (firstMessage.sender_id === user?.id ? firstMessage.receiver_id : firstMessage.sender_id)
    : null

  const threadOtherUserName = firstMessage
    ? (firstMessage.sender_id === user?.id ? firstMessage.receiver_name : firstMessage.sender_name)
    : null

  const recipientName = threadOtherUserName ?? recipientProfile?.full_name ?? (project?.title ? `Re: ${project.title}` : '…')

  // ── Send ───────────────────────────────────────────────────────────────────

  const handleSendMessage = useCallback(async () => {
    const trimmed = messageContent.trim()
    if (!trimmed || !projectId || !user?.id) return

    let receiverId =
      targetId ||
      threadOtherUserId ||
      (user.role === 'student' && project?.business_id
        ? project.business_id
        : '')

    if (!receiverId) {
      toast({
        title: 'Cannot send message',
        description: 'Could not determine the recipient. Return to the applications page and try again.',
        variant: 'destructive',
      })
      return
    }

    setSending(true)
    // Clear input immediately for smooth UX
    setMessageContent('')

    const { error: sendError } = await sendMessage({
      project_id: projectId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: trimmed,
    })

    if (sendError) {
      toast({ title: 'Send failed', description: sendError, variant: 'destructive' })
      // Restore message on error
      setMessageContent(trimmed)
    }

    setSending(false)
    textareaRef.current?.focus()
  }, [messageContent, projectId, user, targetId, project, threadOtherUserId, toast])

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

      const bubbleShape = isMine
        ? cn(
          'rounded-[22px]',
          isFirstInGroup && !isLastInGroup && 'rounded-tr-[4px]',
          !isFirstInGroup && isLastInGroup && 'rounded-br-[4px]',
          !isFirstInGroup && !isLastInGroup && 'rounded-r-[4px]',
        )
        : cn(
          'rounded-[22px]',
          isFirstInGroup && !isLastInGroup && 'rounded-tl-[4px]',
          !isFirstInGroup && isLastInGroup && 'rounded-bl-[4px]',
          !isFirstInGroup && !isLastInGroup && 'rounded-l-[4px]',
        )

      return (
        <div key={msg.id}>
          {showDivider && <DateDivider label={formatDateDivider(msg.created_at)} />}

          <motion.div
            initial={{ opacity: 0, x: isMine ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'flex w-full items-end gap-3',
              isMine ? 'justify-end' : 'justify-start',
              isFirstInGroup ? 'mt-6' : 'mt-1'
            )}
          >
            {/* Other-party avatar */}
            {!isMine && (
              <div className="w-9 flex-shrink-0 self-end mb-1">
                {isLastInGroup ? (
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-[11px] font-bold border border-border">
                    {msg.sender_name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                ) : (
                  <div className="h-9 w-9" />
                )}
              </div>
            )}

            {/* Bubble Container */}
            <div className={cn('flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%]', isMine ? 'items-end' : 'items-start')}>
              {!isMine && isFirstInGroup && (
                <p className="text-[11px] font-bold text-muted-foreground mb-1.5 ml-1 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  {msg.sender_name}
                </p>
              )}

              <div
                className={cn(
                  'px-5 py-3 text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap transition-all duration-200',
                  bubbleShape,
                  isMine
                    ? 'bg-primary text-white font-medium hover:bg-primary-light'
                    : 'bg-card text-foreground border border-border/60 hover:border-border'
                )}
              >
                {msg.content}
              </div>

              {/* Timestamp */}
              {isLastInGroup && (
                <p className={cn(
                  'text-[10px] mt-2 select-none font-semibold tracking-tight uppercase',
                  isMine ? 'text-muted-foreground/70 pr-1' : 'text-muted-foreground/70 pl-1'
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
            <ArrowLeftIcon className="h-3.5 w-3.5 mr-1.5" />
            Go back
          </Button>
        </div>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">

      {/* ── Header ── */}
      <header className="glass shadow-none flex items-center gap-4 px-6 py-4 sm:px-10 border-b border-border/40 shrink-0 z-20">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="icon"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4 min-w-0">

          <div className="flex flex-col min-w-0">
            <h2 className="text-[14px] font-bold text-foreground truncate leading-tight tracking-tight">
              {recipientName}
            </h2>
            {project && (
              <p className="text-[10px] font-semibold text-primary/70 truncate leading-tight mt-1 uppercase tracking-[0.1em]">
                {project.title}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages scroll area ── */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="w-full h-full">
          <div className="page-container pt-8 pb-32">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <MessageSkeleton />
              ) : messages.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="flex flex-col gap-1">
                  {renderMessages()}
                  <div ref={bottomRef} className="h-8" />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* ── Input section ── */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3 sm:px-8 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              'flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3',
              'shadow-sm transition-all duration-200',
              'focus-within:border-zinc-400 focus-within:shadow-md'
            )}
          >
            <Textarea
              ref={textareaRef}
              placeholder={`Message ${recipientName.split(' ')[0]}…`}
              rows={1}
              className={cn(
                'flex-1 resize-none border-0 bg-transparent p-0 shadow-none',
                'text-sm text-zinc-900 leading-relaxed',
                'placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 outline-none',
                'min-h-[22px] max-h-[180px] py-0.5'
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
                'shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 mb-0.5',
                messageContent.trim() && !sending
                  ? 'bg-teal-600 text-white hover:bg-teal-700'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              )}
            >
              {sending ? (
                <div className="h-3.5 w-3.5 border-2 border-zinc-400 border-t-teal-600 rounded-full animate-spin" />
              ) : (
                <ArrowUpIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
            </button>
          </div>

          <p className="text-center text-[11px] text-zinc-400 mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </footer>

    </div>
  )
}
