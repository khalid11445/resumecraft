type RoleIdeas = { keywords: string[]; bullets: string[] };
type CategoryIdeas = {
  titles: string[];
  skills: string[];
  general: string[];
  roles: RoleIdeas[];
};

const data: Record<string, CategoryIdeas> = {
  nurse: {
    titles: [
      "Registered Nurse",
      "ICU Nurse",
      "ER Nurse",
      "Pediatric Nurse",
      "Licensed Practical Nurse",
      "Nursing Assistant",
    ],
    skills: [
      "Patient Assessment",
      "IV Therapy",
      "Medication Administration",
      "EHR (Epic)",
      "Triage",
      "Infection Control",
      "Wound Care",
      "BLS / ACLS",
    ],
    general: [
      "Provided direct care to [X] patients per shift while following safety and infection-control protocols",
      "Documented assessments and treatments accurately in the electronic health record",
      "Collaborated with physicians and care teams to update patient care plans",
      "Educated patients and families on medications, procedures, and discharge instructions",
      "Mentored [X] new nurses or students during clinical placements",
    ],
    roles: [
      {
        keywords: ["emergency", "trauma", "er nurse", "a&e"],
        bullets: [
          "Triaged and treated [X]+ patients per shift in a fast-paced emergency department",
          "Responded to trauma and critical cases, stabilizing patients before transfer or admission",
          "Performed IV insertion, medication administration, and wound care under pressure",
          "Kept calm, clear communication with patients and families during emergencies",
        ],
      },
      {
        keywords: ["icu", "critical", "intensive"],
        bullets: [
          "Monitored ventilated and critically ill patients and responded quickly to changes in condition",
          "Managed IV infusions and hemodynamic monitoring equipment",
          "Coordinated care plans with physicians, respiratory therapists, and pharmacists",
          "Maintained a nurse-to-patient ratio of [X:X] while meeting documentation standards",
        ],
      },
      {
        keywords: ["pediatric", "paediatric", "child"],
        bullets: [
          "Cared for children aged [X to X] with a focus on comfort and family-centered care",
          "Calculated and administered weight-based medication doses using double-check procedures",
          "Taught parents and caregivers about home care, nutrition, and follow-up",
          "Used age-appropriate communication to reduce anxiety during procedures",
        ],
      },
    ],
  },

  student: {
    titles: [
      "Business Student",
      "Engineering Student",
      "Recent Graduate",
      "Intern",
      "Part-time Sales Assistant",
      "Volunteer",
    ],
    skills: [
      "Microsoft Excel",
      "Public Speaking",
      "Teamwork",
      "Research",
      "Time Management",
      "Problem Solving",
      "Canva",
      "Communication",
    ],
    general: [
      "Balanced coursework and [activity] while maintaining a GPA of [X]",
      "Worked in teams of [X] to deliver class projects on time",
      "Presented project results to classmates and instructors",
      "Used Excel to organize and analyze data for [project or course]",
      "Took initiative to [describe action], resulting in [result]",
    ],
    roles: [
      {
        keywords: ["intern"],
        bullets: [
          "Supported the [team] team with [tasks], completing [X] assignments on schedule",
          "Researched [topic] and presented findings to the team",
          "Learned [tool or process] and applied it to improve [task]",
          "Communicated with [clients or colleagues] by email and in meetings",
        ],
      },
      {
        keywords: ["sales", "cashier", "retail", "customer", "store", "shop"],
        bullets: [
          "Served [X]+ customers per shift and handled cash and card payments accurately",
          "Recommended products based on customer needs and helped increase sales by [X]%",
          "Kept inventory organized and shelves stocked",
          "Resolved customer questions and complaints politely and quickly",
        ],
      },
      {
        keywords: ["tutor", "teaching"],
        bullets: [
          "Tutored [X] students in [subject], helping them improve their grades",
          "Prepared simple lesson plans and practice exercises",
          "Adapted explanations to each student's level and learning style",
          "Tracked progress and gave regular feedback to students and parents",
        ],
      },
      {
        keywords: ["volunteer"],
        bullets: [
          "Volunteered [X] hours per week with [organization]",
          "Helped organize [event] for [X]+ participants",
          "Coordinated a team of [X] volunteers to achieve [goal]",
          "Welcomed and supported visitors, participants, or beneficiaries",
        ],
      },
    ],
  },

  banking: {
    titles: [
      "Financial Analyst",
      "Credit Analyst",
      "Investment Banking Analyst",
      "Accountant",
      "Relationship Manager",
      "Auditor",
    ],
    skills: [
      "Financial Modeling",
      "Excel",
      "Credit Analysis",
      "Bloomberg",
      "Risk Management",
      "Financial Reporting",
      "SQL",
      "Valuation",
    ],
    general: [
      "Analyzed financial data to support decisions on [area], improving [metric] by [X]%",
      "Prepared monthly reports and presentations for senior management",
      "Built Excel models to forecast [revenue, cash flow, or risk] across [X] scenarios",
      "Ensured compliance with internal policies and regulatory requirements",
      "Collaborated with [teams] to deliver [project] on time and within budget",
    ],
    roles: [
      {
        keywords: ["credit", "loan", "lending"],
        bullets: [
          "Assessed the creditworthiness of [X]+ borrowers using financial statements and ratios",
          "Monitored a loan portfolio of [$X] and flagged risks early",
          "Prepared credit memos for committee review",
          "Recommended approval or rejection supported by cash-flow analysis",
        ],
      },
      {
        keywords: ["investment", "m&a", "banker", "analyst"],
        bullets: [
          "Built valuation models (DCF, comparables) for [X] transactions",
          "Prepared pitch books and client presentations",
          "Conducted market and industry research to support deal teams",
          "Reviewed financial statements and due diligence materials",
        ],
      },
      {
        keywords: ["account", "audit"],
        bullets: [
          "Reconciled accounts and supported month-end closing for [X] entities",
          "Reviewed [X]+ transactions to detect errors and ensure accuracy",
          "Improved a reporting process, saving [X] hours per month",
          "Prepared documentation to support external audits",
        ],
      },
      {
        keywords: ["relationship", "client", "branch", "advisor"],
        bullets: [
          "Managed a portfolio of [X] clients with total assets of [$X]",
          "Identified client needs and recommended suitable products, reaching [X]% of target",
          "Resolved client queries and complaints within [X] hours",
          "Strengthened client relationships and improved retention by [X]%",
        ],
      },
    ],
  },

  tech: {
    titles: [
      "Frontend Developer",
      "Backend Developer",
      "Full-Stack Developer",
      "Software Engineer",
      "Data Analyst",
      "DevOps Engineer",
    ],
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "SQL",
      "Git",
      "REST APIs",
      "Docker",
    ],
    general: [
      "Built and shipped features used by [X]+ users",
      "Wrote clean, tested code and took part in code reviews",
      "Collaborated with designers and product managers in an agile team",
      "Fixed [X] bugs and improved performance by [X]%",
      "Documented code and processes to help teammates onboard faster",
    ],
    roles: [
      {
        keywords: ["frontend", "front-end", "front end", "react", "web developer"],
        bullets: [
          "Built responsive interfaces with React and TypeScript used by [X]+ users",
          "Improved page load time by [X]% through code splitting and image optimization",
          "Implemented accessible components that follow WCAG guidelines",
          "Worked with designers to turn mockups into reusable components",
        ],
      },
      {
        keywords: ["backend", "back-end", "back end", "server", "api"],
        bullets: [
          "Designed and maintained REST APIs handling [X]+ requests per day",
          "Optimized database queries, reducing response time by [X]%",
          "Wrote automated tests, raising coverage to [X]%",
          "Implemented authentication and authorization to protect user data",
        ],
      },
      {
        keywords: ["data", "analytics", "bi "],
        bullets: [
          "Cleaned and analyzed datasets of [X]+ records using SQL and Python",
          "Built dashboards in [Power BI or Tableau] used by [team]",
          "Identified trends that led to [result]",
          "Presented insights to non-technical stakeholders",
        ],
      },
      {
        keywords: ["devops", "cloud", "infrastructure", "sre"],
        bullets: [
          "Automated deployments with CI/CD pipelines, cutting release time by [X]%",
          "Managed cloud infrastructure on [AWS, Azure, or GCP]",
          "Set up monitoring and alerts, reducing downtime by [X]%",
          "Containerized services with Docker to standardize environments",
        ],
      },
    ],
  },

  teacher: {
    titles: [
      "Primary School Teacher",
      "High School Teacher",
      "English Teacher",
      "Math Teacher",
      "Teaching Assistant",
      "Private Tutor",
    ],
    skills: [
      "Lesson Planning",
      "Classroom Management",
      "Differentiated Instruction",
      "Assessment",
      "Parent Communication",
      "Curriculum Design",
      "Google Classroom",
      "Student Engagement",
    ],
    general: [
      "Planned and delivered engaging lessons for [X] students aligned with the curriculum",
      "Assessed student progress and gave regular, constructive feedback",
      "Maintained a positive and inclusive classroom environment",
      "Communicated regularly with parents about progress and behavior",
      "Collaborated with colleagues to develop shared teaching materials",
    ],
    roles: [
      {
        keywords: ["primary", "elementary", "class teacher", "kindergarten"],
        bullets: [
          "Taught [X] pupils aged [X to X] across core subjects",
          "Raised average reading or math scores by [X]% over one school year",
          "Used games and hands-on activities to keep young learners engaged",
          "Set up classroom routines that supported focus and respect",
        ],
      },
      {
        keywords: ["english", "french", "arabic", "language"],
        bullets: [
          "Taught [language] at [level], improving exam pass rates by [X]%",
          "Designed speaking, listening, and writing activities for mixed-ability groups",
          "Used digital tools and authentic materials to motivate students",
          "Prepared students for [exam]",
        ],
      },
      {
        keywords: ["math", "science", "physics", "chemistry", "biology"],
        bullets: [
          "Taught [subject] to [X] students, raising average test scores by [X]%",
          "Designed practice problems and experiments that connect concepts to real life",
          "Supported struggling students with extra sessions and step-by-step explanations",
          "Used test data to adjust teaching plans",
        ],
      },
      {
        keywords: ["assistant", "tutor", "private"],
        bullets: [
          "Supported the lead teacher with [X] students in daily classroom activities",
          "Gave one-to-one help to students who needed extra support",
          "Prepared materials and organized classroom resources",
          "Monitored students during activities and reported concerns to the teacher",
        ],
      },
    ],
  },
};

export function getSuggestions(categoryId: string): CategoryIdeas {
  return data[categoryId] ?? data.student;
}

// Bullets for a given role or job title text; falls back to general ones
export function bulletsFor(categoryId: string, text: string): string[] {
  const s = getSuggestions(categoryId);
  const t = text.toLowerCase().trim();
  const match = t
    ? s.roles.find((r) => r.keywords.some((k) => t.includes(k)))
    : undefined;
  return match ? [...match.bullets, ...s.general] : s.general;
}