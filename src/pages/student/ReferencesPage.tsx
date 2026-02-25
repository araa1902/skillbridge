import { useAuth } from '@/contexts/AuthContext'
import { useFetchStudentReferences } from '@/hooks/useReferences'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star } from 'lucide-react'

export default function ReferencesPage() {
  const { user } = useAuth()
  const { references, loading, error } = useFetchStudentReferences(user?.id || null)

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="font-semibold">Failed to load references</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Professional References</h1>
        <p className="text-gray-600">Recommendations from employers and project partners</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : references.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold">No references yet</h3>
          <p className="mt-2 text-gray-600">
            Complete projects and get references from your collaborators
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {references.map((reference) => (
            <Card key={reference.id} className="p-6">
              <div className="space-y-4">
                {/* Header with rating and date */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{reference.employer_name}</h3>
                    {reference.employer_title && (
                      <p className="text-sm text-gray-600">{reference.employer_title}</p>
                    )}
                    {reference.company_name && (
                      <p className="text-sm text-gray-500">{reference.company_name}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < reference.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(reference.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Project */}
                {reference.project_title && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Project</p>
                    <Badge variant="outline">{reference.project_title}</Badge>
                  </div>
                )}

                {/* Skills */}
                {reference.skills.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills Recognized</p>
                    <div className="flex flex-wrap gap-2">
                      {reference.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference content */}
                <div className="pt-4 border-t">
                  <p className="text-gray-700 leading-relaxed">{reference.overall_feedback}</p>
                </div>

                {/* Performance ratings */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Work Quality</p>
                    <p className="font-bold text-lg">{reference.work_quality}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Communication</p>
                    <p className="font-bold text-lg">{reference.communication}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Professionalism</p>
                    <p className="font-bold text-lg">{reference.professionalism}/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Technical Skills</p>
                    <p className="font-bold text-lg">{reference.technical_skills}/5</p>
                  </div>
                </div>

                {/* Would work again badge */}
                {reference.would_work_again && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800">✓ Employer would work with you again</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
