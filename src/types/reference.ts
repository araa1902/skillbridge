export interface Reference {
  id: string;
  studentId: string;
  studentName: string;
  employerId: string;
  employerName: string;
  employerTitle: string;
  companyName: string;
  companyLogo?: string;
  projectId: string;
  projectTitle: string;
  rating: number; // 1-5
  skills: string[];
  strengths: string[];
  areasForImprovement: string[];
  overallFeedback: string;
  workQuality: number; // 1-5
  communication: number; // 1-5
  professionalism: number; // 1-5
  technicalSkills: number; // 1-5
  wouldWorkAgain: boolean;
  isPublic: boolean;
  createdAt: string;
  verifiedByPlatform: boolean;
}

export interface ReferenceRequest {
  id: string;
  studentId: string;
  studentName: string;
  employerId: string;
  projectId: string;
  projectTitle: string;
  status: 'pending' | 'completed' | 'declined';
  requestedAt: string;
  completedAt?: string;
}

export interface ReferenceRequestFromDB {
  id: string;
  student_id: string;
  student_name: string;
  employer_id: string;
  project_id: string;
  project_title: string;
  status: 'pending' | 'completed' | 'declined';
  requested_at: string;
  completed_at?: string;
  updated_at?: string;
}
