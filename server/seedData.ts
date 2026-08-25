export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
  college: string;
  department: string;
  year: string;
  avatar: string;
  bio: string;
  karma: number;
  tradesCompleted: number;
  ratingAvg: number;
  reviewsCount: number;
  badges: string[];
  joinedDate: string;
}

export interface ListingRecord {
  id: string;
  title: string;
  description: string;
  category: 'Resources' | 'Services' | 'Opportunities';
  subcategory: string;
  price: number;
  priceUnit?: string;
  condition?: string;
  imageUrl: string;
  location: string;
  tags: string[];
  sellerId: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    year: string;
    rating: number;
    tradesCompleted: number;
  };
  createdAt: string;
  createdAtTimestamp: number;
  status: 'active' | 'pending' | 'sold' | 'exchanged';
  views: number;
  acceptedTradeOffers?: string[];
}

export interface MessageRecord {
  id: string;
  listingId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  timestampMs: number;
  isRead: boolean;
}

export interface ReviewRecord {
  id: string;
  listingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  createdAtTimestamp: number;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'trade' | 'karma' | 'badge' | 'system';
  link?: string;
  isRead: boolean;
  createdAt: string;
  createdAtTimestamp: number;
}

export interface SavedListingRecord {
  id: string;
  userId: string;
  listingId: string;
  savedAt: string;
}

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'user-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Computer Science',
    year: 'Senior (4th Year)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'CS Senior obsessed with distributed systems & hardware hacking. Always willing to trade textbooks or debug your React & Python projects.',
    karma: 680,
    tradesCompleted: 14,
    ratingAvg: 4.9,
    reviewsCount: 11,
    badges: ['Campus Hero', 'Top Seller', 'Trusted Peer', 'Community Beacon'],
    joinedDate: 'Sep 2023',
  },
  {
    id: 'user-2',
    name: 'Maya Chen',
    email: 'maya.chen@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Electrical Engineering',
    year: 'Junior (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'EE junior specializing in embedded systems & PCB design. President of the Robotics club.',
    karma: 420,
    tradesCompleted: 8,
    ratingAvg: 4.8,
    reviewsCount: 7,
    badges: ['Trusted Peer', 'Tech Guru'],
    joinedDate: 'Oct 2023',
  },
  {
    id: 'user-3',
    name: 'David Kim',
    email: 'david.kim@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Mechanical Engineering',
    year: 'Sophomore (2nd Year)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'MechE student, 3D printing enthusiast, avid cyclist and textbook recycler.',
    karma: 310,
    tradesCompleted: 6,
    ratingAvg: 5.0,
    reviewsCount: 5,
    badges: ['First Exchange', 'Top Seller'],
    joinedDate: 'Jan 2024',
  },
  {
    id: 'user-4',
    name: 'Sophia Patel',
    email: 'sophia.patel@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Biology & Pre-Med',
    year: 'Senior (4th Year)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    bio: 'Pre-med student offering organic chemistry tutoring and MCAT prep resource exchanges.',
    karma: 550,
    tradesCompleted: 12,
    ratingAvg: 5.0,
    reviewsCount: 10,
    badges: ['Campus Hero', 'Trusted Peer', 'Community Beacon'],
    joinedDate: 'Aug 2023',
  },
  {
    id: 'user-5',
    name: 'Marcus Brody',
    email: 'marcus.brody@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Graphic Design',
    year: 'Junior (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'UI/UX & brand designer. Love trading design critique sessions for tech gear and textbooks.',
    karma: 390,
    tradesCompleted: 7,
    ratingAvg: 4.7,
    reviewsCount: 6,
    badges: ['Trusted Peer'],
    joinedDate: 'Nov 2023',
  },
  {
    id: 'user-6',
    name: 'Elena Rostova',
    email: 'elena.rostova@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Economics',
    year: 'Senior (4th Year)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Econ senior, data analytics nerd with R & STATA. Dorm decluttering ongoing!',
    karma: 280,
    tradesCompleted: 5,
    ratingAvg: 4.9,
    reviewsCount: 4,
    badges: ['First Exchange'],
    joinedDate: 'Feb 2024',
  },
  {
    id: 'user-7',
    name: 'Liam Vance',
    email: 'liam.vance@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Computer Engineering',
    year: 'Freshman (1st Year)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Freshman looking for dorm gear, calculus guides, and Arduino starter kits.',
    karma: 150,
    tradesCompleted: 2,
    ratingAvg: 4.8,
    reviewsCount: 2,
    badges: ['First Exchange'],
    joinedDate: 'Aug 2024',
  },
  {
    id: 'user-8',
    name: 'Zoe Washington',
    email: 'zoe.washington@campus.edu',
    password: 'password123',
    college: 'State University',
    department: 'Psychology',
    year: 'Junior (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    bio: 'Psych major, campus lab assistant. Organizing campus swap-meets and study circles.',
    karma: 460,
    tradesCompleted: 9,
    ratingAvg: 5.0,
    reviewsCount: 8,
    badges: ['Campus Hero', 'Trusted Peer'],
    joinedDate: 'Sep 2023',
  },
];

export const INITIAL_LISTINGS: ListingRecord[] = [
  {
    id: 'list-1',
    title: 'Sony WH-1000XM4 Noise Canceling Headphones',
    description: 'Great condition, pristine battery life (30hrs). Includes original hard shell case and USB-C cable. Perfect for library study sessions and deep focus sprints.',
    category: 'Resources',
    subcategory: 'Electronics',
    price: 3500,
    condition: 'Like New',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    location: 'Engineering Quad / Dorm 4',
    tags: ['Audio', 'Electronics', 'Study', 'Noise-Canceling'],
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science',
      year: 'Senior',
      rating: 4.9,
      tradesCompleted: 14,
    },
    createdAt: '2 hours ago',
    createdAtTimestamp: Date.now() - 7200000,
    status: 'active',
    views: 42,
  },
  {
    id: 'list-2',
    title: 'Organic Chemistry: Structure and Function (8th Edition)',
    description: 'Vollhardt & Schore hardback. Light highlighting in chapters 1-4, spine and pages in excellent structural shape. Essential for CHEM 2200.',
    category: 'Resources',
    subcategory: 'Textbooks',
    price: 450,
    condition: 'Good',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    location: 'Science Library lobby',
    tags: ['Chemistry', 'Pre-Med', 'Textbook', 'STEM'],
    sellerId: 'user-4',
    seller: {
      id: 'user-4',
      name: 'Sophia Patel',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      department: 'Biology',
      year: 'Senior',
      rating: 5.0,
      tradesCompleted: 12,
    },
    createdAt: '4 hours ago',
    createdAtTimestamp: Date.now() - 14400000,
    status: 'active',
    views: 31,
  },
  {
    id: 'list-3',
    title: 'Python, Algorithms & Data Structures Tutoring',
    description: '1-on-1 coaching for CS 101/201. Passed with A+. We will tackle dynamic programming, tree traversals, recursion, and LeetCode prep for tech interviews.',
    category: 'Services',
    subcategory: 'Tutoring',
    price: 400,
    priceUnit: '/hr',
    condition: 'Available Weekly',
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    location: 'Student Union or Zoom',
    tags: ['Coding', 'Python', 'LeetCode', 'CS'],
    sellerId: 'user-1',
    seller: {
      id: 'user-1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Computer Science',
      year: 'Senior',
      rating: 4.9,
      tradesCompleted: 14,
    },
    createdAt: '1 day ago',
    createdAtTimestamp: Date.now() - 86400000,
    status: 'active',
    views: 68,
  },
  {
    id: 'list-4',
    title: 'Hackathon Teammates Wanted: AI Campus Assistant',
    description: 'Looking for a full-stack engineer and a UI/UX designer to compete in the Annual State Hackathon next weekend. We have early prototype APIs ready!',
    category: 'Opportunities',
    subcategory: 'Projects & Hackathons',
    price: 0,
    condition: 'Open Roles: 2',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    location: 'Innovation Hub Room 304',
    tags: ['Hackathon', 'AI', 'React', 'Team'],
    sellerId: 'user-2',
    seller: {
      id: 'user-2',
      name: 'Maya Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      department: 'Electrical Engineering',
      year: 'Junior',
      rating: 4.8,
      tradesCompleted: 8,
    },
    createdAt: '2 days ago',
    createdAtTimestamp: Date.now() - 172800000,
    status: 'active',
    views: 95,
  },
  {
    id: 'list-5',
    title: 'Custom 3D Printing & CAD Rapid Prototyping',
    description: 'High resolution PLA/PETG 3D prints on tuned Bambu Lab X1C. Send STL or STEP file. Rapid turnaround under 24 hours on campus.',
    category: 'Services',
    subcategory: 'Coding & Tech',
    price: 250,
    priceUnit: '/part',
    condition: 'Fast Delivery',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    location: 'Engineering Makerspace',
    tags: ['3D Printing', 'CAD', 'Prototyping', 'Hardware'],
    sellerId: 'user-3',
    seller: {
      id: 'user-3',
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Mechanical Engineering',
      year: 'Sophomore',
      rating: 5.0,
      tradesCompleted: 6,
    },
    createdAt: '3 days ago',
    createdAtTimestamp: Date.now() - 259200000,
    status: 'active',
    views: 54,
  },
  {
    id: 'list-6',
    title: 'Raspberry Pi 4 Model B (4GB) + Starter Sensor Kit',
    description: 'Includes 32GB microSD preloaded with Raspberry Pi OS, official power adapter, micro-HDMI cable, and 20+ sensor modules.',
    category: 'Resources',
    subcategory: 'Electronics',
    price: 2400,
    condition: 'Excellent',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    location: 'North Dorm Quad',
    tags: ['Raspberry Pi', 'IoT', 'Hardware', 'Sensors'],
    sellerId: 'user-2',
    seller: {
      id: 'user-2',
      name: 'Maya Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      department: 'Electrical Engineering',
      year: 'Junior',
      rating: 4.8,
      tradesCompleted: 8,
    },
    createdAt: '3 days ago',
    createdAtTimestamp: Date.now() - 270000000,
    status: 'active',
    views: 88,
  },
  {
    id: 'list-7',
    title: 'Professional Resume & Portfolio Design Critique',
    description: 'Polished portfolio teardowns for internships and full-time roles. I will review visual layout, typography, ATS compliance, and case study narrative.',
    category: 'Services',
    subcategory: 'Design',
    price: 350,
    priceUnit: '/review',
    condition: '24hr Turnaround',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    location: 'Online / PDF Markup',
    tags: ['Design', 'Resume', 'Career', 'Portfolio'],
    sellerId: 'user-5',
    seller: {
      id: 'user-5',
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Graphic Design',
      year: 'Junior',
      rating: 4.7,
      tradesCompleted: 7,
    },
    createdAt: '4 days ago',
    createdAtTimestamp: Date.now() - 345600000,
    status: 'active',
    views: 39,
  },
  {
    id: 'list-8',
    title: 'Undergrad Research Assistant: Cognitive Behavioral Lab',
    description: 'Dr. Harmon lab looking for 1 motivated student to assist with EEG data collection and subject intake. 6 hours/week, credit or stipend available.',
    category: 'Opportunities',
    subcategory: 'Lab Research',
    price: 0,
    condition: 'Fall Semester',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    location: 'Behavioral Sciences Bldg Room 210',
    tags: ['Research', 'Psychology', 'Neuroscience', 'Lab'],
    sellerId: 'user-8',
    seller: {
      id: 'user-8',
      name: 'Zoe Washington',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      department: 'Psychology',
      year: 'Junior',
      rating: 5.0,
      tradesCompleted: 9,
    },
    createdAt: '5 days ago',
    createdAtTimestamp: Date.now() - 432000000,
    status: 'active',
    views: 112,
  },
  {
    id: 'list-9',
    title: 'Keurig K-Mini Single Serve Coffee Maker',
    description: 'Matte black, fits tight dorm desk spaces perfectly. Cleaned and descaled. Includes 15 K-Cup pods for free.',
    category: 'Resources',
    subcategory: 'Dorm Essentials',
    price: 1200,
    condition: 'Great',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    location: 'West Campus Residence Hall',
    tags: ['Coffee', 'Dorm', 'Kitchen', 'Appliances'],
    sellerId: 'user-6',
    seller: {
      id: 'user-6',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      department: 'Economics',
      year: 'Senior',
      rating: 4.9,
      tradesCompleted: 5,
    },
    createdAt: '5 days ago',
    createdAtTimestamp: Date.now() - 440000000,
    status: 'active',
    views: 47,
  },
  {
    id: 'list-10',
    title: 'Campus Portrait & Graduation Photo Sessions',
    description: '30-minute mini session with 10 high-resolution color-graded edits. Great for LinkedIn heads, graduation announcements, and club profiles.',
    category: 'Services',
    subcategory: 'Photography',
    price: 600,
    priceUnit: '/session',
    condition: 'Weekend Slots',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    location: 'Campus Bell Tower / Quad',
    tags: ['Photography', 'Headshot', 'LinkedIn', 'Graduation'],
    sellerId: 'user-5',
    seller: {
      id: 'user-5',
      name: 'Marcus Brody',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Graphic Design',
      year: 'Junior',
      rating: 4.7,
      tradesCompleted: 7,
    },
    createdAt: '6 days ago',
    createdAtTimestamp: Date.now() - 518400000,
    status: 'active',
    views: 73,
  },
];

export const INITIAL_MESSAGES: MessageRecord[] = [];

export const INITIAL_REVIEWS: ReviewRecord[] = [
  {
    id: 'rev-1',
    listingId: 'list-1',
    reviewerId: 'user-3',
    reviewerName: 'David Kim',
    reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    revieweeId: 'user-1',
    rating: 5,
    comment: 'Super fast meetup at the engineering quad. Item was in mint condition exactly as described!',
    createdAt: '3 days ago',
    createdAtTimestamp: Date.now() - 259200000,
  },
  {
    id: 'rev-2',
    listingId: 'list-2',
    reviewerId: 'user-8',
    reviewerName: 'Zoe Washington',
    reviewerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    revieweeId: 'user-4',
    rating: 5,
    comment: 'Saved me ₹3,500 on semester textbooks! Super friendly and organized.',
    createdAt: '1 week ago',
    createdAtTimestamp: Date.now() - 604800000,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [];
