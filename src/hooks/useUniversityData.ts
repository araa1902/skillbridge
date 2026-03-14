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

    const load = useCallback(async () => {
        if (!universityId) {
            setLoading(false)
            return
        }

        setLoading(true)
        
        let query = supabase
            .from('profiles')
            .select(`
          id,
          full_name,
          email,
          created_at
        `)
            .eq('role', 'student')
            
        if (companyName) {
            query = query.or(`university_id.eq.${universityId},company_name.eq."${companyName.replace(/"/g, '')}"`)
        } else {
            query = query.eq('university_id', universityId)
        }
            
        const { data: studentList, error: studentListError } = await query
            .order('created_at', { ascending: false })
            .limit(20)

        if (studentListError || !studentList) {
            setStudents([])
            setLoading(false)
            return
        }

        // Fetch applications and credentials for each student
        const studentsWithStats = await Promise.all(
            studentList.map(async (student: any) => {
                const [appData, credData] = await Promise.all([
                    supabase
                        .from('applications')
                        .select('*', { count: 'exact', head: true })
                        .eq('student_id', student.id),
                    supabase
                        .from('credentials')
                        .select('*', { count: 'exact', head: true })
                        .eq('student_id', student.id),
                ])

                // Calculate total earnings
                const acceptedApps = (appData.data || []).filter((a: any) => a.status === 'accepted')
                let totalEarnings = 0

                if (acceptedApps.length > 0) {
                    const projectIds = acceptedApps.map((a: any) => a.project_id)
                    const { data: projectsData } = await supabase
                        .from('projects')
                        .select('budget')
                        .in('id', projectIds)
                    
                    totalEarnings = (projectsData || []).reduce((sum: number, p: any) => sum + (Number(p.budget) || 0), 0)
                }

                return {
                    id: student.id,
                    full_name: student.full_name,
                    email: student.email,
                    applications_count: appData.count ?? 0,
                    credentials_earned: credData.count ?? 0,
                    joined_at: student.created_at,
                    active_placements: acceptedApps.length,
                    total_earnings: totalEarnings,
                }
            })
        )

        setStudents(studentsWithStats)
        setLoading(false)
    }, [universityId])

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

    return { students, loading }
}

export function useUniversityStats(universityId: string | undefined, companyName?: string | null) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        activePlacements: 0,
        totalEarnings: 0,
        averageCompetency: 0,
    })
    const [loading, setLoading] = useState(true)

    const load = useCallback(async () => {
        if (!universityId) {
            setLoading(false)
            return
        }

        setLoading(true)

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

        if (univStudentsError) {
            setLoading(false)
            return
        }

        const studentIds = allUnivStudents?.map((s: any) => s.id) || []
        const studentCount = studentIds.length

        let activePlacements = 0
        let totalEarnings = 0
        let averageCompetency = 0

        if (studentIds.length > 0) {
            // Get credentials to calculate average competency rating
            const { data: credData } = await supabase
                .from('credentials')
                .select('rating')
                .in('student_id', studentIds)
                .not('rating', 'is', null)

            const ratings = (credData || []).map((c: any) => c.rating || 0)
            if (ratings.length > 0) {
                averageCompetency = ratings.reduce((sum: number, val: number) => sum + val, 0) / ratings.length
            }

            // Get accepted applications to calculate active placements and total earnings
            const { data: appsData } = await supabase
                .from('applications')
                .select('project_id')
                .in('student_id', studentIds)
                .eq('status', 'accepted')

            const acceptedProjectIds = (appsData || []).map((a: any) => a.project_id)
            activePlacements = acceptedProjectIds.length

            if (acceptedProjectIds.length > 0) {
                const { data: projectsData } = await supabase
                    .from('projects')
                    .select('budget')
                    .in('id', acceptedProjectIds)
                
                totalEarnings = (projectsData || []).reduce((sum: number, p: any) => sum + (Number(p.budget) || 0), 0)
            }
        }

        setStats({
            totalStudents: studentCount,
            activePlacements,
            totalEarnings,
            averageCompetency,
        })
        setLoading(false)
    }, [universityId])

    useEffect(() => {
        load()

        if (!universityId) return

        // This is complex - we'll listen for any relevant changes
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

    return { stats, loading }
}
