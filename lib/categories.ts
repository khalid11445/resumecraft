import { ResumeData } from "./resume-schema";
import { sampleResume } from "./sample-data";

export type Category = {
  id: string;
  color: string;
  name: string;
  description: string;
  recommendedSections: string[];
  starter: ResumeData;
};

const student: ResumeData = {
  personal: {
    fullName: "Alex Martin",
    jobTitle: "Business Student",
    email: "alex.martin@email.com",
    phone: "+1 555 987 6543",
    location: "Boston, MA",
    website: "",
    linkedin: "linkedin.com/in/alexmartin",
  },
  summary:
    "Motivated business student seeking an internship. Strong teamwork and analytical skills, with leadership experience in campus organizations.",
  experience: [
    {
      id: "1",
      role: "Sales Assistant (Part-time)",
      company: "Campus Bookstore",
      location: "Boston, MA",
      startDate: "2024",
      endDate: "",
      bullets: [
        "Served 80+ customers per shift and handled cash accurately",
        "Helped reorganize inventory, cutting restocking time by 20%",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Boston University",
      degree: "BSc, Business Administration",
      startDate: "2023",
      endDate: "2027",
      details: "GPA: 3.7/4.0",
    },
  ],
  skills: ["Excel", "Public Speaking", "Teamwork", "Research"],
  customSections: [
    {
      id: "1",
      title: "Projects & Volunteering",
      items: [
        "Marketing plan for a local cafe (class project, team of 4)",
        "Volunteer tutor, 2 hours per week",
      ],
    },
  ],
};

const banking: ResumeData = {
  personal: {
    fullName: "Daniel Carter",
    jobTitle: "Financial Analyst",
    email: "daniel.carter@email.com",
    phone: "+1 555 222 3344",
    location: "New York, NY",
    website: "",
    linkedin: "linkedin.com/in/danielcarter",
  },
  summary:
    "Financial analyst with 4 years of experience in corporate banking, credit analysis, and financial modeling.",
  experience: [
    {
      id: "1",
      role: "Credit Analyst",
      company: "Northbridge Bank",
      location: "New York, NY",
      startDate: "2022",
      endDate: "",
      bullets: [
        "Analyzed a $120M loan portfolio and flagged risks that reduced defaults by 12%",
        "Built financial models used in 40+ credit committee decisions",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "New York University",
      degree: "BSc, Finance",
      startDate: "2017",
      endDate: "2021",
      details: "",
    },
  ],
  skills: ["Financial Modeling", "Excel", "Credit Analysis", "Bloomberg"],
  customSections: [
    {
      id: "1",
      title: "Certifications",
      items: ["CFA Level II Candidate", "FRM Part I"],
    },
  ],
};

const tech: ResumeData = {
  personal: {
    fullName: "Omar Haddad",
    jobTitle: "Frontend Developer",
    email: "omar.haddad@email.com",
    phone: "+212 600 000 000",
    location: "Casablanca, Morocco",
    website: "omarhaddad.dev",
    linkedin: "linkedin.com/in/omarhaddad",
  },
  summary:
    "Frontend developer with 3 years of experience building fast, accessible web apps with React and TypeScript.",
  experience: [
    {
      id: "1",
      role: "Frontend Developer",
      company: "Atlas Digital",
      location: "Casablanca, Morocco",
      startDate: "2023",
      endDate: "",
      bullets: [
        "Rebuilt the checkout flow in React, raising conversion by 15%",
        "Cut page load time from 4s to 1.5s with code splitting and image optimization",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "ENSIAS",
      degree: "Software Engineering Degree",
      startDate: "2018",
      endDate: "2023",
      details: "",
    },
  ],
  skills: ["React", "TypeScript", "Next.js", "Node.js", "Git"],
  customSections: [
    {
      id: "1",
      title: "Projects",
      items: [
        "Open-source UI library, 300+ GitHub stars",
        "Personal finance tracker built with Next.js and Supabase",
      ],
    },
  ],
};

const teacher: ResumeData = {
  personal: {
    fullName: "Laila Benali",
    jobTitle: "Primary School Teacher",
    email: "laila.benali@email.com",
    phone: "+212 611 111 111",
    location: "Rabat, Morocco",
    website: "",
    linkedin: "",
  },
  summary:
    "Dedicated primary school teacher with 6 years of experience creating engaging, inclusive classrooms and improving student outcomes.",
  experience: [
    {
      id: "1",
      role: "Class Teacher, Grade 4",
      company: "Al Amal School",
      location: "Rabat, Morocco",
      startDate: "2020",
      endDate: "",
      bullets: [
        "Raised average reading scores by 18% in one school year",
        "Designed project-based lessons used by 5 other teachers",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "Mohammed V University",
      degree: "Bachelor's in Education",
      startDate: "2015",
      endDate: "2019",
      details: "",
    },
  ],
  skills: [
    "Classroom Management",
    "Lesson Planning",
    "Differentiated Instruction",
    "Parent Communication",
  ],
  customSections: [
    {
      id: "1",
      title: "Certifications & Training",
      items: [
        "Teaching Certificate",
        "First Aid Training",
        "Inclusive Education Workshop",
      ],
    },
  ],
};

export const categories: Category[] = [
  {
    id: "nurse",
    color: "#0f766e",
    name: "Nurse / Healthcare",
    description: "Highlight licenses, certifications, and clinical experience.",
    recommendedSections: ["Licenses", "Certifications", "Clinical rotations"],
    starter: sampleResume,
  },
  {
    id: "student",
    color: "#c2410c",
    name: "Student / First job",
    description: "Education first, plus projects and volunteering.",
    recommendedSections: ["Projects", "Volunteering", "Activities"],
    starter: student,
  },
  {
    id: "banking",
    color: "#1e3a8a",
    name: "Banking / Finance",
    description: "Results-focused, one-page layout with certifications.",
    recommendedSections: ["Certifications", "Deals / Metrics"],
    starter: banking,
  },
  {
    id: "tech",
    color: "#4f46e5",
    name: "Tech / Developer",
    description: "Skills, projects, and links to your GitHub or portfolio.",
    recommendedSections: ["Projects", "Open source", "Certifications"],
    starter: tech,
  },
  {
    id: "teacher",
    color: "#15803d",
    name: "Teacher / Education",
    description: "Classroom results, training, and certifications.",
    recommendedSections: ["Certifications", "Training", "Extracurriculars"],
    starter: teacher,
  },
];

export function getCategory(id: string): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}