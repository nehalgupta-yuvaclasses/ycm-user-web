import { Course, Faculty, Testimonial, FAQ, Selection } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'SSC CGL 2024 Complete Foundation Batch',
    instructor_name: 'Sandeep Sir',
    price: 1999,
    original_price: 4999,
    is_bestseller: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
    category: 'SSC',
    rating: 4.9,
    students_count: 15000,
    is_new: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Banking Awareness & GA Special',
    instructor_name: 'Priya Ma\'am',
    price: 999,
    original_price: 2499,
    is_new: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    category: 'Banking',
    rating: 4.8,
    students_count: 8000,
    is_bestseller: false,
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    title: 'Quantitative Aptitude Masterclass',
    instructor_name: 'Vikram Sir',
    price: 1499,
    original_price: 3499,
    thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    category: 'Maths',
    rating: 4.9,
    students_count: 12000,
    is_bestseller: true,
    is_new: false,
    created_at: '2024-03-01T00:00:00Z'
  },
];

export const FACULTY: Faculty[] = [
  {
    id: '1',
    name: 'Sandeep Singh',
    role: 'Reasoning Expert',
    image: 'https://picsum.photos/seed/faculty1/400/400',
    experience: '10+ Years',
    specialization: 'Logical Reasoning & Verbal',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'General Awareness',
    image: 'https://picsum.photos/seed/faculty2/400/400',
    experience: '8+ Years',
    specialization: 'Current Affairs & Banking',
  },
  {
    id: '3',
    name: 'Vikram Aditya',
    role: 'Maths Specialist',
    image: 'https://picsum.photos/seed/faculty3/400/400',
    experience: '12+ Years',
    specialization: 'Advanced Maths & Arithmetic',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rahul Kumar',
    role: 'SSC CGL Selected',
    content: 'The foundation batch at Yuva Classes was a game changer for me. The way Nehal Sir explains concepts is unmatched. The structured approach helped me clear CGL in my first attempt.',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    rating: 5,
  },
  {
    id: '2',
    name: 'Sneha Gupta',
    role: 'IBPS PO Selected',
    content: 'The study material and mock tests are exactly as per the latest exam pattern. Nehal Sir\'s guidance kept me motivated throughout my preparation journey.',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    rating: 5,
  },
  {
    id: '3',
    name: 'Amit Singh',
    role: 'Bihar Police Selected',
    content: 'I was struggling with Maths, but the way it is taught here made it my strongest subject. Highly recommend Yuva Classes to everyone in Bihar.',
    avatar: 'https://picsum.photos/seed/user3/100/100',
    rating: 5,
  },
  {
    id: '4',
    name: 'Priyanka Kumari',
    role: 'Railway NTPC Selected',
    content: 'The affordable fees and high-quality education are what make Yuva Classes the best. Nehal Sir is a true mentor who cares for every student.',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    rating: 5,
  },
  {
    id: '5',
    name: 'Vikash Yadav',
    role: 'SSC GD Selected',
    content: 'The regular mock tests and detailed analysis helped me identify my weak spots. I am now serving in BSF, all thanks to Yuva Classes.',
    avatar: 'https://picsum.photos/seed/user5/100/100',
    rating: 5,
  },
  {
    id: '6',
    name: 'Anjali Sharma',
    role: 'BPSC Aspirant',
    content: 'The environment here is so motivating. Even during tough times, the faculty was there to support and guide me. Best coaching in the region.',
    avatar: 'https://picsum.photos/seed/user6/100/100',
    rating: 5,
  },
];

export const FAQS: FAQ[] = [
  {
    id: '1',
    question: 'How can I access the classes?',
    answer: 'Once you enroll, you can access all classes through your dashboard on our website or mobile app.',
  },
  {
    id: '2',
    question: 'Are the classes live or recorded?',
    answer: 'We provide a mix of both. Most foundation courses have live sessions with recorded backups available for 1 year.',
  },
  {
    id: '3',
    question: 'Can I download the study material?',
    answer: 'Yes, all PDF notes and practice sets are downloadable for offline study.',
  },
];

export const SELECTIONS: Selection[] = [
  {
    id: '1',
    name: 'Himanshu Kumar',
    exam: 'SSC GD',
    rank: 'BSF',
    year: '2023',
    image: 'https://picsum.photos/seed/himanshu/200/200',
  },
  {
    id: '2',
    name: 'Suraj Kumar',
    exam: 'SSC GD',
    rank: 'CRPF',
    year: '2022',
    image: 'https://picsum.photos/seed/suraj/200/200',
  },
  {
    id: '3',
    name: 'Om Shri',
    exam: 'SSC GD',
    rank: 'CRPF',
    year: '2025',
    image: 'https://picsum.photos/seed/omshri/200/200',
  },
  {
    id: '4',
    name: 'Gaurav Kumar',
    exam: 'SSC GD',
    rank: 'BSF',
    year: '2025',
    image: 'https://picsum.photos/seed/gaurav/200/200',
  },
  {
    id: '5',
    name: 'Anjali Kumari',
    exam: 'Bihar Police Constable',
    rank: 'Selected',
    year: '2025',
    image: 'https://picsum.photos/seed/anjali/200/200',
  },
  {
    id: '6',
    name: 'Nikita Kumari',
    exam: 'Bihar Police Constable',
    rank: 'Selected',
    year: '2025',
    image: 'https://picsum.photos/seed/nikita/200/200',
  },
  {
    id: '7',
    name: 'Twinkle Kumari',
    exam: 'Bihar Police Constable',
    rank: 'Selected',
    year: '2025',
    image: 'https://picsum.photos/seed/twinkle/200/200',
  },
  {
    id: '8',
    name: 'Varsha Kumari',
    exam: 'Bihar Police Constable',
    rank: 'Selected',
    year: '2025',
    image: 'https://picsum.photos/seed/varsha/200/200',
  },
  {
    id: '9',
    name: 'Manish Kumar',
    exam: 'Indian Army',
    rank: 'Selected',
    year: '2024',
    image: 'https://picsum.photos/seed/manish/200/200',
  },
];
