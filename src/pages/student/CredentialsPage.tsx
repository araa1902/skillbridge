import { useAuth } from '@/contexts/AuthContext'
import { useFetchStudentCredentials } from '@/hooks/useCredentials'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Award, Star } from 'lucide-react'

export default function CredentialsPage() {
  const { user } = useAuth()
  const { credentials, loading, error } = useFetchStudentCredentials(user?.id || null)

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <h3 className="font-semibold">Failed to load credentials</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Credentials & Certificates</h1>
        <p className="text-gray-600">Badges and certificates earned from completed projects</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : credentials.length === 0 ? (
        <Card className="p-12 text-center">
          <Award className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold">No credentials yet</h3>
          <p className="mt-2 text-gray-600">
            Complete projects to earn credentials and showcase your skills
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential) => (
            <Card key={credential.id} className="overflow-hidden">
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <Award className="h-8 w-8" />
                    <h3 className="mt-4 text-xl font-bold">{credential.project_title}</h3>
                  </div>
                  {credential.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                      <span className="font-bold">{credential.rating}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Credential Details */}
              <div className="p-6 space-y-4">
                {/* Skills Verified */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills Verified</p>
                  <div className="flex flex-wrap gap-2">
                    {credential.skills_verified && credential.skills_verified.length > 0 ? (
                      credential.skills_verified.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No specific skills tagged</span>
                    )}
                  </div>
                </div>

                {/* Issuer */}
                <div>
                  <p className="text-sm font-semibold text-gray-700">Issued by</p>
                  <p className="text-sm text-gray-600">{credential.business_name}</p>
                </div>

                {/* Feedback */}
                {credential.feedback && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Feedback</p>
                    <p className="text-sm text-gray-600 italic">"{credential.feedback}"</p>
                  </div>
                )}

                {/* Date Issued */}
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Issued {new Date(credential.issued_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
