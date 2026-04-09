import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { ShieldCheck, Clock } from "@phosphor-icons/react"
import { PoundSterling, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type PayoutStatus = "in_escrow" | "processing" | "paid"

type EarningsRecord = {
  id: string
  projectTitle: string
  budget: number
  fee: number
  takeHome: number
  status: PayoutStatus
  date: string
}

export default function EarningsDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [earnings, setEarnings] = useState<EarningsRecord[]>([])
  
  useEffect(() => {
    async function loadEarnings() {
      if (!user) return
      
      const { data, error } = await supabase
        .from("applications")
        .select(`
          id,
          status,
          created_at,
          projects (
            title,
            budget,
            status
          )
        `)
        .eq("student_id", user.id)
        .in("status", ["accepted", "completed"])
        
      if (!error && data) {
        const records: EarningsRecord[] = data.map(app => {
          const project = app.projects as any
          const budget = project?.budget || 0
          const fee = budget * 0.1
          const takeHome = budget - fee
          
          let status: PayoutStatus = "in_escrow"
          if (project?.status === "completed") status = "processing"
          if (app.status === "completed") status = "paid" // Simplifying paid logic for UI
          
          return {
            id: app.id,
            projectTitle: project?.title || "Unknown Project",
            budget,
            fee,
            takeHome,
            status,
            date: new Date(app.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
          }
        })
        
        setEarnings(records)
      }
      setLoading(false)
    }
    
    loadEarnings()
  }, [user])
  
  const totalEarned = earnings.filter(e => e.status === "paid").reduce((sum, e) => sum + e.takeHome, 0)
  const totalEscrow = earnings.filter(e => e.status === "in_escrow").reduce((sum, e) => sum + e.takeHome, 0)
  const totalProcessing = earnings.filter(e => e.status === "processing").reduce((sum, e) => sum + e.takeHome, 0)
  
  return (
    <div className="page-container py-8 flex flex-col gap-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-800 tracking-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          Earnings & Payouts
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          All payments are securely handled through <strong className="text-foreground">SkillBridge Escrow</strong>.
        </p>
      </div>
      
      {/* Transparency Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 text-primary">
          <PoundSterling className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-700 text-foreground text-sm tracking-tight uppercase">How payouts work</h3>
          <p className="text-sm text-primary/80 mt-1 max-w-2xl leading-relaxed">
            SkillBridge charges a flat <strong>10% platform fee</strong> on all projects. Your estimated take-home pay is perfectly transparent upfront. Funds are held securely in escrow while you work, and automatically released 48 hours after the employer approves your deliverables.
          </p>
        </div>
      </div>
      
      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="surface p-5 border shadow-sm flex flex-col gap-1">
          <p className="text-sm font-600 text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Available to withdraw
          </p>
          <p className="text-3xl font-800" style={{ fontFamily: "var(--font-display)" }}>
            £{totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="surface p-5 border shadow-sm flex flex-col gap-1">
          <p className="text-sm font-600 text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4" /> Processing
          </p>
          <p className="text-3xl font-800" style={{ fontFamily: "var(--font-display)" }}>
            £{totalProcessing.toLocaleString()}
          </p>
        </div>
        <div className="surface-brand p-5 border shadow-sm flex flex-col gap-1">
          <p className="text-sm font-600 text-primary uppercase tracking-widest">
            Pending in Escrow
          </p>
          <p className="text-3xl font-800" style={{ fontFamily: "var(--font-display)" }}>
            £{totalEscrow.toLocaleString()}
          </p>
        </div>
      </div>
      
      {/* Payouts list */}
      <div className="surface rounded-2xl border flex flex-col">
        <div className="p-5 border-b">
          <h3 className="font-700 text-lg">Transaction History</h3>
        </div>
        
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">Loading transactions...</div>
        ) : earnings.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center">
            <PoundSterling className="w-12 h-12 text-muted/50 mb-3" />
            <p className="text-foreground font-600">No earnings yet</p>
            <p className="text-sm text-muted-foreground mt-1">Complete a project to see your payouts here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b">
                  <TableHead className="w-[300px] font-700 py-4">Project & Date</TableHead>
                  <TableHead className="text-right font-700 py-4">Gross</TableHead>
                  <TableHead className="text-right font-700 py-4">Fee (10%)</TableHead>
                  <TableHead className="text-right font-700 py-4">Take-Home</TableHead>
                  <TableHead className="text-right font-700 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings.map((record) => (
                  <TableRow key={record.id} className="group">
                    <TableCell className="py-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-600 text-foreground group-hover:text-primary transition-colors">
                          {record.projectTitle}
                        </span>
                        <span className="text-xs text-muted-foreground">{record.date}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right font-500">
                      £{record.budget.toLocaleString()}
                    </TableCell>
                    
                    <TableCell className="text-right text-destructive font-500">
                      -£{record.fee.toLocaleString()}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <span className="font-700 text-base text-emerald-600">
                        £{record.takeHome.toLocaleString()}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      {record.status === "paid" && (
                        <span className="badge badge--success py-1 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Released
                        </span>
                      )}
                      {record.status === "processing" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-600 bg-amber-50 text-amber-600 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Processing
                        </span>
                      )}
                      {record.status === "in_escrow" && (
                        <span className="badge badge--primary py-1 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> In Escrow
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
