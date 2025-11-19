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
