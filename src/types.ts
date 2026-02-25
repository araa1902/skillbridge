export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'business' | 'university'
export type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn'
export type PaymentStatus = 'pending' | 'held_in_escrow' | 'released' | 'refunded'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string // uuid references auth.users
          role: UserRole
          full_name: string
          university_id: string | null // uuid references profiles(id)
          company_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string // timestamptz
        }
        Insert: {
          id: string
          role?: UserRole
          full_name: string
          university_id?: string | null
          company_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string
          university_id?: string | null
          company_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
        }
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
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string // uuid
          project_id: string // uuid references projects(id)
          student_id: string // uuid references profiles(id)
          cover_letter: string
          status: ApplicationStatus
          created_at: string // timestamptz
        }
        Insert: {
          id?: string
          project_id: string
          student_id: string
          cover_letter: string
          status?: ApplicationStatus
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          student_id?: string
          cover_letter?: string
          status?: ApplicationStatus
          created_at?: string
        }
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
        }
        Insert: {
          id?: string
          project_id: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
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
        }
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
        }
      }
      reference_requests: {
        Row: {
          id: string // uuid
          student_id: string // uuid references profiles(id)
          employer_id: string // uuid references profiles(id)
          project_id: string // uuid references projects(id)
          student_name: string
          project_title: string
          status: 'pending' | 'completed' | 'declined'
          requested_at: string // timestamptz
          completed_at: string | null // timestamptz
        }
        Insert: {
          id?: string
          student_id: string
          employer_id: string
          project_id: string
          student_name: string
          project_title: string
          status?: 'pending' | 'completed' | 'declined'
          requested_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string
          employer_id?: string
          project_id?: string
          student_name?: string
          project_title?: string
          status?: 'pending' | 'completed' | 'declined'
          requested_at?: string
          completed_at?: string | null
        }
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