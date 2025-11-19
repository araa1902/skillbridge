export interface Session {
  id: string;
  title: string;
  description: string;
  mentor: {
    name: string;
    title: string;
    company: string;
    avatar: string;
    rating: number;
    expertise: string[];
  };
  duration: number; // in minutes
  price: number;
  category: string;
  skills: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  availableSlots: {
    date: string;
    time: string;
    timezone: string;
  }[];
  enrolled: number;
  maxCapacity: number;
  sessionType: 'one-on-one' | 'group' | 'workshop';
  status: 'upcoming' | 'live' | 'completed';
  createdAt: string;
}

export interface BookedSession extends Session {
  bookingId: string;
  bookedSlot: {
    date: string;
    time: string;
    timezone: string;
  };
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  meetingLink?: string;
}
