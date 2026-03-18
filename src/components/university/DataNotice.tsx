import { Info } from "@phosphor-icons/react"

interface DataNoticeProps {
  message: string
  className?: string
}

export function DataNotice({ message, className = "" }: DataNoticeProps) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/30 p-4 dark:border-blue-500/10 dark:bg-blue-500/5 ${className}`}>
      <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
      <div className="text-sm leading-relaxed">
        <span className="font-bold uppercase tracking-tight text-blue-600 mr-1.5">Notice:</span>
        <span className="text-slate-600 dark:text-black">
          {message}
        </span>
      </div>
    </div>
  )
}
