import { useEffect, useState } from 'react'
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

export function useFetchMyStudents(universityId: string | undefined) {
    const [students, setStudents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!universityId) {
            setLoading(false)
            return
        }

        async function fetchStudents() {
            setLoading(true)
            const { data: studentList, error: studentListError } = await supabase
                .from('profiles')
                .select(`
          id,
          full_name,
          email,
          created_at
        `)
                .eq('role', 'student')
                .eq('university_id', universityId)
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

                    return {
                        id: student.id,
                        full_name: student.full_name,
                        email: student.email,
                        applications_count: appData.count ?? 0,
                        credentials_earned: credData.count ?? 0,
                        joined_at: student.created_at,
                    }
                })
            )

            setStudents(studentsWithStats)
            setLoading(false)
        }

        fetchStudents()
    }, [universityId])

    return { students, loading }
}

export function useUniversityStats(universityId: string | undefined) {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalProjects: 0,
        totalCredentialsIssued: 0,
        activeConnections: 0,
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!universityId) {
            setLoading(false)
            return
        }

        async function fetchStats() {
            setLoading(true)

            const { data: allUnivStudents, error: univStudentsError } = await supabase
                .from('profiles')
                .select('id')
                .eq('role', 'student')
                .eq('university_id', universityId)

            if (univStudentsError) {
                setLoading(false)
                return
            }

            const studentIds = allUnivStudents?.map((s: any) => s.id) || []
            const studentCount = studentIds.length

            let projectCount = 0
            let credentialCount = 0
            let activeConnections = 0

            if (studentIds.length > 0) {
                // Get total credentials issued to these students
                const { count: cCount } = await supabase
                    .from('credentials')
                    .select('*', { count: 'exact', head: true })
                    .in('student_id', studentIds)

                credentialCount = cCount ?? 0

                // Get projects students have applied to
                const { data: appsData } = await supabase
                    .from('applications')
                    .select('project_id, status')
                    .in('student_id', studentIds)

                projectCount = new Set((appsData ?? []).map((a: any) => a.project_id)).size

                // Get active connections
                const { data: messageData } = await supabase
                    .from('messages')
                    .select('project_id, sender_id, receiver_id')

                const relevantMessages = (messageData ?? []).filter((m: any) =>
                    studentIds.includes(m.sender_id) || studentIds.includes(m.receiver_id)
                )
                activeConnections = new Set(relevantMessages.map((m: any) => m.project_id)).size
            }

            setStats({
                totalStudents: studentCount,
                totalProjects: projectCount,
                totalCredentialsIssued: credentialCount,
                activeConnections: activeConnections,
            })
            setLoading(false)
        }

        fetchStats()
    }, [universityId])

    return { stats, loading }
}
