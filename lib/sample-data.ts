import { ResumeData } from "./resume-schema";

export const sampleResume: ResumeData = {
  personal: {
    fullName: "Sarah Johnson",
    jobTitle: "Registered Nurse",
    email: "sarah.johnson@email.com",
    phone: "+1 555 123 4567",
    location: "Austin, TX",
    website: "",
    linkedin: "linkedin.com/in/sarahjohnson",
  },
  summary:
    "Compassionate registered nurse with 5 years of experience in emergency and critical care. Skilled in patient assessment, rapid decision-making, and working in high-pressure environments.",
  experience: [
    {
      id: "1",
      role: "ER Nurse",
      company: "St. David's Medical Center",
      location: "Austin, TX",
      startDate: "2021",
      endDate: "",
      bullets: [
        "Triaged and treated 25+ patients per shift in a Level I trauma center",
        "Mentored 6 new graduate nurses during onboarding",
      ],
    },
  ],
  education: [
    {
      id: "1",
      school: "University of Texas at Austin",
      degree: "BSN, Nursing",
      startDate: "2016",
      endDate: "2020",
      details: "",
    },
  ],
  skills: ["Patient Assessment", "IV Therapy", "EHR (Epic)", "Triage"],
  customSections: [
    {
      id: "1",
      title: "Licenses & Certifications",
      items: ["RN License, Texas", "BLS", "ACLS", "TNCC"],
    },
  ],
};