import { Session, BookedSession } from "@/types/session";

export const sessions: Session[] = [
  {
    id: "1",
    title: "Frontend Development Mastery",
    description: "Learn advanced React patterns, performance optimization, and modern frontend architecture from a senior engineer at Google.",
    mentor: {
      name: "Sarah Chen",
      title: "Senior Frontend Engineer",
      company: "Google",
      avatar: "SC",
      rating: 4.9,
      expertise: ["React", "TypeScript", "Performance", "Architecture"]
    },
    duration: 60,
    price: 89,
    category: "Web Development",
    skills: ["React", "TypeScript", "Performance Optimization"],
    level: "Advanced",
    availableSlots: [
      { date: "2024-02-15", time: "10:00", timezone: "PST" },
      { date: "2024-02-16", time: "14:00", timezone: "PST" },
      { date: "2024-02-18", time: "09:00", timezone: "PST" }
    ],
    enrolled: 12,
    maxCapacity: 15,
    sessionType: "group",
    status: "upcoming",
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    title: "Data Science Career Transition",
    description: "One-on-one mentorship session to help you transition into data science. Portfolio review, interview prep, and career roadmap.",
    mentor: {
      name: "Dr. Michael Rodriguez",
      title: "Principal Data Scientist",
      company: "Netflix",
      avatar: "MR",
      rating: 4.8,
      expertise: ["Machine Learning", "Python", "Career Transition", "Analytics"]
    },
    duration: 45,
    price: 120,
    category: "Data Science",
    skills: ["Python", "Machine Learning", "Career Planning"],
    level: "Intermediate",
    availableSlots: [
      { date: "2024-02-14", time: "16:00", timezone: "EST" },
      { date: "2024-02-15", time: "11:00", timezone: "EST" },
      { date: "2024-02-17", time: "13:00", timezone: "EST" }
    ],
    enrolled: 1,
    maxCapacity: 1,
    sessionType: "one-on-one",
    status: "upcoming",
    createdAt: "2024-01-20T00:00:00Z"
  },
  {
    id: "3",
    title: "UX Design Workshop: User Research",
    description: "Hands-on workshop covering user research methodologies, interview techniques, and data analysis for better product decisions.",
    mentor: {
      name: "Jessica Park",
      title: "Senior UX Designer",
      company: "Airbnb",
      avatar: "JP",
      rating: 4.9,
      expertise: ["UX Research", "Design Thinking", "Prototyping", "User Testing"]
    },
    duration: 90,
    price: 75,
    category: "Design",
    skills: ["User Research", "Design Thinking", "Analytics"],
    level: "Beginner",
    availableSlots: [
      { date: "2024-02-20", time: "18:00", timezone: "PST" },
      { date: "2024-02-22", time: "19:00", timezone: "PST" }
    ],
    enrolled: 8,
    maxCapacity: 20,
    sessionType: "workshop",
    status: "upcoming",
    createdAt: "2024-01-25T00:00:00Z"
  }
];

export const myBookedSessions: BookedSession[] = [
  {
    ...sessions[0],
    bookingId: "booking-1",
    bookedSlot: { date: "2024-02-15", time: "10:00", timezone: "PST" },
    bookingStatus: "confirmed",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  }
];
