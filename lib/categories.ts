import { ResumeData } from "./resume-schema";
import { sampleResume } from "./sample-data";

export type Category = {
  id: string;
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

export const categories: Category[] = [
  {
    id: "nurse",
    name: "Nurse / Healthcare",
    description: "Highlight licenses, certifications, and clinical experience.",
    recommendedSections: ["Licenses", "Certifications", "Clinical rotations"],
    starter: sampleResume,
  },
  {
    id: "student",
    name: "Student / First job",
    description: "Education first, plus projects and volunteering.",
    recommendedSections: ["Projects", "Volunteering", "Activities"],
    starter: student,
  },
  {
    id: "banking",
    name: "Banking / Finance",
    description: "Results-focused, one-page layout with certifications.",
    recommendedSections: ["Certifications", "Deals / Metrics"],
    starter: banking,
  },
];

export function getCategory(id: string): Category {
  return categories.find((c) => c.id === id) ?? categories[0];
}