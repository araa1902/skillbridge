import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useUniversities() {
    const [universities, setUniversities] = useState<{ id: string, full_name: string, company_name: string | null }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUniversities() {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, company_name')
                .eq('role', 'university')
                .order('full_name')

            if (!error && data) {
                setUniversities(data)
            }
            setLoading(false)
        }
        fetchUniversities()
    }, [])

    return { universities, loading }
}

export function useUniversityStudents(universityId: string | undefined, companyName?: string | null) {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!universityId) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Find all students related to this university or matching the company_name (university name)
            let studentsQuery = supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')

            if (companyName) {
                studentsQuery = studentsQuery.or(`university_id.eq.${universityId},company_name.eq."${companyName.replace(/"/g, '')}"`)
            } else {
                studentsQuery = studentsQuery.eq('university_id', universityId)
            }

            const { data: allUnivStudents, error: univStudentsError } = await studentsQuery

            if (univStudentsError) throw univStudentsError

            if (!allUnivStudents || allUnivStudents.length === 0) {
                setStudents([])
                setLoading(false)
                return
            }

            const studentsWithStats = await Promise.all(
                allUnivStudents.map(async (student) => {
                    const [appData, credData] = await Promise.all([
                        supabase.from('applications').select('id, status').eq('student_id', student.id),
                        supabase.from('credentials').select('id').eq('student_id', student.id),
                    ])

                    return {
                        id: student.id,
                        full_name: student.full_name,
                        applications_count: appData.data?.length ?? 0,
                        credentials_earned: credData.data?.length ?? 0,
                        joined_at: student.created_at,
                        active_placements: (appData.data || []).filter((a: any) => a.status === 'accepted').length,
                    }
                })
            )

            setStudents(studentsWithStats)
        } catch (err) {
            console.error('Error in useUniversityStudents:', err)
            setError(err instanceof Error ? err.message : 'Failed to load students')
        } finally {
            setLoading(false)
        }
    }, [universityId, companyName])

    useEffect(() => {
        load()

        if (!universityId) return

        const channel = supabase
            .channel(`univ_students_${universityId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `university_id=eq.${universityId}`,
                },
                () => load()
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [load, universityId])

    return { students, loading, error }
}

export function useUniversityStats(universityId: string | undefined, companyName?: string | null) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activePlacements: 0,
        totalCredentials: 0,
        averageCompetency: 0,
        placementsByStatus: [] as { name: string, value: number }[],
        credentialsOverTime: [] as { date: string, count: number }[],
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!universityId) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            let studentsQuery = supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student')

            if (companyName) {
                studentsQuery = studentsQuery.or(`university_id.eq.${universityId},company_name.eq."${companyName.replace(/"/g, '')}"`)
            } else {
                studentsQuery = studentsQuery.eq('university_id', universityId)
            }

            const { data: allUnivStudents, error: univStudentsError } = await studentsQuery

            if (univStudentsError) throw univStudentsError

            const studentIds = allUnivStudents?.map((s: any) => s.id) || []
            const studentCount = studentIds.length

            let activePlacements = 0
            let totalCredentials = 0
            let averageCompetency = 0
            let placementsByStatus: { name: string, value: number }[] = []
            let credentialsOverTime: { date: string, count: number }[] = []

            if (studentIds.length > 0) {
                // Get credentials
                const { data: credData } = await supabase
                    .from('credentials')
                    .select('rating, project_id, student_id, issued_at')
                    .in('student_id', studentIds)

                const ratings = (credData || []).map((c: any) => c.rating).filter(r => r !== null)
                if (ratings.length > 0) {
                    averageCompetency = ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length
                }

                totalCredentials = (credData || []).length

                // Get applications for status tracking
                const { data: appsData } = await supabase
                    .from('applications')
                    .select('status')
                    .in('student_id', studentIds)
                    .in('status', ['accepted', 'completed'])

                activePlacements = (appsData || []).filter(a => a.status === 'accepted').length

                // Chart data: Placements by status
                const statusCounts = (appsData || []).reduce((acc: any, app: any) => {
                    const status = app.status === 'accepted' ? 'Active' : 'Completed'
                    acc[status] = (acc[status] || 0) + 1
                    return acc
                }, {})
                
                placementsByStatus = Object.entries(statusCounts).map(([name, value]) => ({ name, value: value as number }))

                // Chart data: Credentials over time
                const credsByDate = (credData || []).reduce((acc: any, cred: any) => {
                    const date = new Date(cred.issued_at).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
                    acc[date] = (acc[date] || 0) + 1
                    return acc
                }, {})

                credentialsOverTime = Object.entries(credsByDate).map(([date, count]) => ({ date, count: count as number }))
                credentialsOverTime.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            }

            setStats({
                totalStudents: studentCount,
                activePlacements,
                totalCredentials,
                averageCompetency,
                placementsByStatus,
                credentialsOverTime,
            })
        } catch (err) {
            console.error('Error in useUniversityStats:', err)
            setError(err instanceof Error ? err.message : 'Failed to load stats')
        } finally {
            setLoading(false)
        }
    }, [universityId, companyName])

    useEffect(() => {
        load()

        if (!universityId) return

        const profileChannel = supabase
            .channel(`univ_stats_profiles_${universityId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `university_id=eq.${universityId}` }, () => load())
            .subscribe()

        const credentialsChannel = supabase
            .channel(`univ_stats_credentials_${universityId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'credentials' }, () => load())
            .subscribe()

        const applicationChannel = supabase
            .channel(`univ_stats_apps_${universityId}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => load())
            .subscribe()

        return () => {
            supabase.removeChannel(profileChannel)
            supabase.removeChannel(credentialsChannel)
            supabase.removeChannel(applicationChannel)
        }
    }, [load, universityId])

    return { stats, loading, error }
}

export function useUniversityProjects(universityId: string | undefined, companyName?: string | null) {
    const [projects, setProjects] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        if (!universityId) {
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Get university students
            let studentsQuery = supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student')

            if (companyName) {
                studentsQuery = studentsQuery.or(`university_id.eq.${universityId},company_name.eq."${companyName.replace(/"/g, '')}"`)
            } else {
                studentsQuery = studentsQuery.eq('university_id', universityId)
            }

            const { data: allUnivStudents, error: univStudentsError } = await studentsQuery

            if (univStudentsError) throw univStudentsError

            const studentIds = allUnivStudents?.map((s: any) => s.id) || []

            if (studentIds.length === 0) {
                setProjects([])
                return
            }

            // Get all applications for these students
            const { data: appsData, error: appsError } = await supabase
                .from('applications')
                .select('project_id')
                .in('student_id', studentIds)

            if (appsError) throw appsError

            const projectIds = Array.from(new Set((appsData || []).map(a => a.project_id)))

            if (projectIds.length === 0) {
                setProjects([])
                return
            }

            // Fetch the actual projects
            const { data: projectList, error: projectError } = await supabase
                .from('projects')
                .select(`
                    id,
                    title,
                    status,
                    created_at,
                    business:profiles!projects_business_id_fkey (full_name, company_name)
                `)
                .in('id', projectIds)
                .in('status', ['open', 'in_progress', 'completed', 'cancelled'])
                .order('created_at', { ascending: false })

            if (projectError) throw projectError

            const projectsWithStats = await Promise.all(
                (projectList ?? []).map(async (project: any) => {
                    const { count } = await supabase
                        .from('applications')
                        .select('*', { count: 'exact', head: true })
                        .eq('project_id', project.id)

                    return {
                        id: project.id,
                        title: project.title,
                        business_name: project.business?.company_name || project.business?.full_name || 'Unknown',
                        status: project.status,
                        applications_count: count ?? 0,
                        created_at: project.created_at,
                    }
                })
            )

            setProjects(projectsWithStats)
        } catch (err) {
            console.error('Error in useUniversityProjects:', err)
            setError(err instanceof Error ? err.message : 'Failed to load projects')
        } finally {
            setLoading(false)
        }
    }, [universityId, companyName])

    useEffect(() => {
        load()
    }, [load])

    return { projects, loading, error }
}
