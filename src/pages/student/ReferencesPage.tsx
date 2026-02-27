import { useAuth } from '@/contexts/AuthContext'
import { useFetchStudentReferences } from '@/hooks/useReferences'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, DownloadSimple as Download, TrendUp as TrendingUp, Medal as Award, ChatCircle as MessageSquare } from "@phosphor-icons/react"
import { ReferenceCard } from '@/components/ReferenceCard'
import { useState, useEffect } from 'react'

export default function ReferencesPage() {
  const { user } = useAuth()
  const { references, loading, error } = useFetchStudentReferences(user?.id || null)

  const [stats, setStats] = useState({
    avgRating: 0,
    total: 0,
    topSkill: '',
    recommendationRate: 0
  })

  useEffect(() => {
    if (references.length > 0) {
      const avg = references.reduce((acc, ref) => acc + ref.rating, 0) / references.length
      const rate = (references.filter(ref => ref.would_work_again).length / references.length) * 100

      const skillCounts: Record<string, number> = {}
      references.forEach(ref => {
        ref.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      })
      const topSkill = Object.entries(skillCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'

      setStats({
        avgRating: Number(avg.toFixed(1)),
        total: references.length,
        topSkill,
        recommendationRate: Math.round(rate)
      })
    }
  }, [references])

  const handleExportPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    doc.setFontSize(22)
    doc.text('Professional Reference Portfolio', 20, 20)

    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated for ${user?.email || 'Student'} on ${new Date().toLocaleDateString()}`, 20, 30)

    let y = 50
    references.forEach((ref, i) => {
      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.setFont(undefined, 'bold')
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`${i + 1}. ${ref.project_title}`, 20, y)

      y += 7
      doc.setFont(undefined, 'normal')
      doc.setFontSize(11)
      doc.setTextColor(100, 100, 100)
      doc.text(`${ref.employer_name} @ ${ref.company_name} | Rating: ${ref.rating}/5`, 20, y)

      y += 10
      doc.setFontSize(10)
      doc.setTextColor(50, 50, 50)
      const splitText = doc.splitTextToSize(`"${ref.overall_feedback}"`, 170)
      doc.text(splitText, 20, y)

      y += (splitText.length * 5) + 15
    })

    doc.save('References_Portfolio.pdf')
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-red-700">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Professional References</h1>
          <p className="text-muted-foreground">Authenticated feedback from industry partners.</p>
        </div>

        {references.length > 0 && (
          <Button
            onClick={handleExportPdf}
            variant="outline"
            className="rounded-full border font-bold"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Portfolio
          </Button>
        )}
      </div>

      {/* Stats */}
      {references.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 border border-border rounded-2xl bg-muted/30">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Avg Rating</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold">{stats.avgRating}</span>
              <Star className="w-3.5 h-3.5 fill-accent-amber text-accent-amber" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Referral Rate</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold">{stats.recommendationRate}%</span>
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reviews</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold">{stats.total}</span>
              <Award className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Top Skill</span>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold truncate">{stats.topSkill}</span>
            </div>
          </div>
        </div>
      )}

      {/* References List */}
      <div className="space-y-8">
        {loading ? (
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : references.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-border rounded-lg bg-muted/20">
            <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-foreground mb-1">No references yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Complete projects to build your portfolio.</p>
            <Button variant="outline" className="font-bold">Browse Projects</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {references.map((reference) => (
              <ReferenceCard key={reference.id} reference={reference} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
