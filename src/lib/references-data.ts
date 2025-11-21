import { Reference, ReferenceRequest } from "@/types/reference";

export const studentReferences: Reference[] = [
  {
    id: "ref-1",
    studentId: "student-1",
    studentName: "Aisha Patel",
    employerId: "emp-1",
    employerName: "Rajesh Kumar",
    employerTitle: "Marketing Director",
    companyName: "TechStart Ltd",
    projectId: "1",
    projectTitle: "Website Redesign Project",
    rating: 5,
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
    strengths: [
      "Exceptional attention to detail",
      "Proactive communication",
      "Creative problem-solving",
      "Met all deadlines ahead of schedule"
    ],
    areasForImprovement: [
      "Could explore more advanced animation techniques"
    ],
    overallFeedback: "Aisha was an outstanding contributor to our website redesign project. Her design work exceeded our expectations, and she demonstrated a deep understanding of user experience principles. She was proactive in communication, always kept us updated on progress, and delivered high-quality work consistently. I would highly recommend Aisha for any design-related opportunities and would definitely work with her again.",
    workQuality: 5,
    communication: 5,
    professionalism: 5,
    technicalSkills: 5,
    wouldWorkAgain: true,
    isPublic: true,
    createdAt: "2024-01-15T00:00:00Z",
    verifiedByPlatform: true
  },
  {
    id: "ref-2",
    studentId: "student-1",
    studentName: "Aisha Patel",
    employerId: "emp-2",
    employerName: "Maria Gonzalez",
    employerTitle: "Head of Analytics",
    companyName: "FinCorp Solutions",
    projectId: "2",
    projectTitle: "Data Analysis & Visualization",
    rating: 4,
    skills: ["Python", "Data Analysis", "Pandas", "Visualization"],
    strengths: [
      "Strong analytical thinking",
      "Clear documentation",
      "Quick learner",
      "Good collaboration skills"
    ],
    areasForImprovement: [
      "Could improve statistical modeling knowledge",
      "More experience with big data tools would be beneficial"
    ],
    overallFeedback: "Aisha delivered solid work on our data analysis project. She quickly grasped complex datasets and provided valuable insights. Her Python skills are strong, and she created clear, professional visualizations. While there's room to grow in advanced statistical techniques, her foundation is excellent and she's clearly eager to learn.",
    workQuality: 4,
    communication: 5,
    professionalism: 5,
    technicalSkills: 4,
    wouldWorkAgain: true,
    isPublic: true,
    createdAt: "2024-01-28T00:00:00Z",
    verifiedByPlatform: true
  },
  {
    id: "ref-3",
    studentId: "student-1",
    studentName: "Aisha Patel",
    employerId: "emp-3",
    employerName: "Ahmed Hassan",
    employerTitle: "CEO",
    companyName: "GreenTech Innovations",
    projectId: "3",
    projectTitle: "Marketing Campaign Development",
    rating: 5,
    skills: ["Digital Marketing", "Content Strategy", "SEO", "Analytics"],
    strengths: [
      "Creative campaign ideas",
      "Data-driven approach",
      "Excellent written communication",
      "Strong initiative"
    ],
    areasForImprovement: [
      "Could explore more paid advertising channels"
    ],
    overallFeedback: "Working with Aisha was a pleasure. She brought fresh, creative ideas to our marketing campaign and backed them up with solid research and data. Her content was engaging and on-brand, and she showed genuine interest in understanding our business goals. The campaign exceeded our engagement targets by 40%. Highly recommended!",
    workQuality: 5,
    communication: 5,
    professionalism: 5,
    technicalSkills: 4,
    wouldWorkAgain: true,
    isPublic: true,
    createdAt: "2024-02-10T00:00:00Z",
    verifiedByPlatform: true
  }
];

export const pendingReferenceRequests: ReferenceRequest[] = [
  {
    id: "req-1",
    studentId: "student-2",
    studentName: "Carlos Ramirez",
    employerId: "emp-1",
    projectId: "4",
    projectTitle: "Mobile App Development",
    status: "pending",
    requestedAt: "2024-02-05T00:00:00Z"
  }
];
