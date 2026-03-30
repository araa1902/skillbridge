export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'student' | 'business' | 'university'
export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn' | 'completed'
export type PaymentStatus = 'pending' | 'held_in_escrow' | 'released' | 'refunded'
export type ReferenceRequestStatus = 'pending' | 'completed' | 'declined'

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string // uuid references auth.users
                    role: UserRole
                    full_name: string
                    university_id: string | null // uuid references profiles(id)
                    company_name: string | null
                    website: string | null
                    bio: string | null
                    skills: string[] | null
                    cv_url: string | null
                    cv_name: string | null
                    created_at: string // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id: string
                    role?: UserRole
                    full_name: string
                    university_id?: string | null
                    company_name?: string | null
                    website?: string | null
                    bio?: string | null
                    skills?: string[] | null
                    cv_url?: string | null
                    cv_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: UserRole
                    full_name?: string
                    university_id?: string | null
                    company_name?: string | null
                    website?: string | null
                    bio?: string | null
                    skills?: string[] | null
                    cv_url?: string | null
                    cv_name?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_university_id_fkey"
                        columns: ["university_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            projects: {
                Row: {
                    id: string // uuid
                    business_id: string // uuid references profiles(id)
                    title: string
                    description: string
                    deliverables: string
                    required_skills: string[]
                    budget: number
                    payment_status: PaymentStatus
                    stripe_payment_intent_id: string | null
                    duration_hours: number
                    status: ProjectStatus
                    category: string | null
                    deadline: string | null
                    project_documents_url: string | null
                    created_at: string // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id?: string
                    business_id: string
                    title: string
                    description: string
                    deliverables: string
                    required_skills?: string[]
                    budget?: number
                    payment_status?: PaymentStatus
                    stripe_payment_intent_id?: string | null
                    duration_hours?: number
                    status?: ProjectStatus
                    project_documents_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string
                    title?: string
                    description?: string
                    deliverables?: string
                    required_skills?: string[]
                    budget?: number
                    payment_status?: PaymentStatus
                    stripe_payment_intent_id?: string | null
                    duration_hours?: number
                    status?: ProjectStatus
                    project_documents_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "projects_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            applications: {
                Row: {
                    id: string // uuid
                    project_id: string // uuid references projects(id)
                    student_id: string // uuid references profiles(id)
                    cover_letter: string
                    status: ApplicationStatus
                    created_at: string // timestamptz
                    updated_at: string // timestamptz
                    deliverable_link: string | null
                    cv_url: string | null
                    cv_name: string | null
                }
                Insert: {
                    id?: string
                    project_id: string
                    student_id: string
                    cover_letter: string
                    status?: ApplicationStatus
                    created_at?: string
                    updated_at?: string
                    deliverable_link?: string | null
                    cv_url?: string | null
                    cv_name?: string | null
                }
                Update: {
                    id?: string
                    project_id?: string
                    student_id?: string
                    cover_letter?: string
                    status?: ApplicationStatus
                    created_at?: string
                    updated_at?: string
                    deliverable_link?: string | null
                    cv_url?: string | null
                    cv_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "applications_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            messages: {
                Row: {
                    id: string // uuid
                    project_id: string // uuid references projects(id)
                    sender_id: string // uuid references profiles(id)
                    receiver_id: string // uuid references profiles(id)
                    content: string
                    read: boolean
                    created_at: string // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id?: string
                    project_id: string
                    sender_id: string
                    receiver_id: string
                    content: string
                    read?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    sender_id?: string
                    receiver_id?: string
                    content?: string
                    read?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_receiver_id_fkey"
                        columns: ["receiver_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            credentials: {
                Row: {
                    id: string // uuid
                    student_id: string // uuid references profiles(id)
                    business_id: string // uuid references profiles(id)
                    project_id: string // uuid references projects(id)
                    skills_verified: string[]
                    feedback: string | null
                    rating: number | null // 1-5
                    issued_at: string // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id?: string
                    student_id: string
                    business_id: string
                    project_id: string
                    skills_verified?: string[]
                    feedback?: string | null
                    rating?: number | null
                    issued_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    business_id?: string
                    project_id?: string
                    skills_verified?: string[]
                    feedback?: string | null
                    rating?: number | null
                    issued_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "credentials_business_id_fkey"
                        columns: ["business_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "credentials_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "credentials_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            employer_references: {
                Row: {
                    id: string // uuid
                    student_id: string // uuid references profiles(id)
                    employer_id: string // uuid references profiles(id)
                    project_id: string // uuid references projects(id)
                    student_name: string
                    employer_name: string
                    employer_title: string
                    company_name: string
                    company_logo: string | null
                    project_title: string
                    rating: number // 1-5
                    work_quality: number // 1-5
                    communication: number // 1-5
                    professionalism: number // 1-5
                    technical_skills: number // 1-5
                    skills: string[]
                    strengths: string[]
                    areas_for_improvement: string[]
                    overall_feedback: string
                    would_work_again: boolean
                    is_public: boolean
                    verified_by_platform: boolean
                    created_at: string // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id?: string
                    student_id: string
                    employer_id: string
                    project_id: string
                    student_name: string
                    employer_name: string
                    employer_title: string
                    company_name: string
                    company_logo?: string | null
                    project_title: string
                    rating: number
                    work_quality: number
                    communication: number
                    professionalism: number
                    technical_skills: number
                    skills?: string[]
                    strengths?: string[]
                    areas_for_improvement?: string[]
                    overall_feedback: string
                    would_work_again?: boolean
                    is_public?: boolean
                    verified_by_platform?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    employer_id?: string
                    project_id?: string
                    student_name?: string
                    employer_name?: string
                    employer_title?: string
                    company_name?: string
                    company_logo?: string | null
                    project_title?: string
                    rating?: number
                    work_quality?: number
                    communication?: number
                    professionalism?: number
                    technical_skills?: number
                    skills?: string[]
                    strengths?: string[]
                    areas_for_improvement?: string[]
                    overall_feedback?: string
                    would_work_again?: boolean
                    is_public?: boolean
                    verified_by_platform?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "employer_references_employer_id_fkey"
                        columns: ["employer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "employer_references_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "employer_references_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reference_requests: {
                Row: {
                    id: string // uuid
                    student_id: string // uuid references profiles(id)
                    employer_id: string // uuid references profiles(id)
                    project_id: string // uuid references projects(id)
                    student_name: string
                    project_title: string
                    status: ReferenceRequestStatus
                    requested_at: string // timestamptz
                    completed_at: string | null // timestamptz
                    updated_at: string // timestamptz
                }
                Insert: {
                    id?: string
                    student_id: string
                    employer_id: string
                    project_id: string
                    student_name: string
                    project_title: string
                    status?: ReferenceRequestStatus
                    requested_at?: string
                    completed_at?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    employer_id?: string
                    project_id?: string
                    student_name?: string
                    project_title?: string
                    status?: ReferenceRequestStatus
                    requested_at?: string
                    completed_at?: string | null
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reference_requests_employer_id_fkey"
                        columns: ["employer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reference_requests_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reference_requests_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            user_feedback: {
                Row: {
                    id: string
                    user_id: string
                    category: string
                    content: string
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    category: string
                    content: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    category?: string
                    content?: string
                    status?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_feedback_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }

        Views: {
            [_ in never]: never
        }
        Functions: {
            get_user_role: {
                Args: Record<PropertyKey, never>
                Returns: UserRole
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

export * from './reference'
export * from './session'
