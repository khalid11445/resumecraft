type Pack = {
  general: string[];
  roles: { keywords: string[]; texts: string[] }[];
};

const packs: Record<string, Pack> = {
  nurse: {
    general: [
      "Compassionate registered nurse with [X] years of experience in [unit]. Skilled in patient assessment, medication administration, and clear communication with families and care teams.",
      "Dedicated nurse committed to safe, patient-centered care. Experienced in [specialty], with strong documentation habits and a calm approach under pressure.",
      "Recent nursing graduate with clinical placements in [units] and a solid foundation in patient care, infection control, and teamwork. Eager to grow in [area].",
    ],
    roles: [
      {
        keywords: ["emergency", "trauma", "er nurse"],
        texts: [
          "Emergency nurse with [X] years of experience in fast-paced departments. Skilled in triage, rapid assessment, and staying calm and organized during critical cases.",
        ],
      },
      {
        keywords: ["icu", "critical", "intensive"],
        texts: [
          "Critical care nurse with [X] years of experience monitoring and treating critically ill patients. Strong in ventilator care, hemodynamic monitoring, and teamwork with physicians.",
        ],
      },
    ],
  },

  student: {
    general: [
      "Motivated [field] student seeking an internship in [area]. Strong teamwork, communication, and analytical skills, with experience in [project or activity].",
      "Recent graduate in [degree] with hands-on project experience and a fast learning curve. Looking for an entry-level role in [industry] to apply my skills in [skills].",
      "Organized and reliable student balancing studies with [job or activity]. Eager to gain experience, take initiative, and contribute to a team.",
    ],
    roles: [
      {
        keywords: ["intern"],
        texts: [
          "Intern with a background in [field] and experience in [skills]. Quick learner who communicates clearly and delivers tasks on time.",
        ],
      },
      {
        keywords: ["sales", "retail", "cashier", "customer"],
        texts: [
          "Customer-focused sales assistant who serves [X]+ customers per shift. Friendly, accurate with cash handling, and comfortable working in a busy environment.",
        ],
      },
    ],
  },

  banking: {
    general: [
      "Finance professional with [X] years of experience in [area]. Strong in financial analysis, Excel modeling, and presenting clear recommendations to senior stakeholders.",
      "Detail-oriented analyst experienced in [reporting, credit, or risk]. Known for accurate work, clear communication, and meeting tight deadlines.",
      "Finance graduate with internship experience in [area] and strong quantitative skills. Looking to start a career in [banking, audit, or analysis].",
    ],
    roles: [
      {
        keywords: ["credit", "loan", "lending"],
        texts: [
          "Credit analyst with [X] years of experience assessing borrowers and monitoring a portfolio of [$X]. Skilled in financial statement analysis and writing credit memos.",
        ],
      },
      {
        keywords: ["investment", "m&a", "banker"],
        texts: [
          "Investment banking analyst with experience in valuation, financial modeling, and pitch materials across [X] transactions. Works well under tight deadlines.",
        ],
      },
    ],
  },

  tech: {
    general: [
      "Software developer with [X] years of experience building [web or mobile] applications with [technologies]. Focused on clean code, performance, and good user experience.",
      "Problem-solver who enjoys turning ideas into working products. Experienced in [stack], collaborating in agile teams, and shipping features used by [X]+ users.",
      "Junior developer with strong fundamentals in [languages] and projects such as [project]. Quick learner looking to grow in a collaborative engineering team.",
    ],
    roles: [
      {
        keywords: ["frontend", "front-end", "front end", "react"],
        texts: [
          "Frontend developer with [X] years of experience building fast, accessible interfaces with React and TypeScript. Passionate about design systems and performance.",
        ],
      },
      {
        keywords: ["backend", "back-end", "back end", "api"],
        texts: [
          "Backend developer with [X] years of experience designing reliable APIs and databases. Focused on performance, testing, and security.",
        ],
      },
      {
        keywords: ["data", "analytics"],
        texts: [
          "Data analyst with [X] years of experience turning data into clear insights using SQL, Python, and dashboards. Comfortable presenting to non-technical teams.",
        ],
      },
    ],
  },

  teacher: {
    general: [
      "Dedicated teacher with [X] years of experience creating engaging, inclusive classrooms. Skilled in lesson planning, assessment, and communicating with parents.",
      "Student-centered educator who adapts lessons to different learning styles. Experienced in [subject or level] with a record of improving student results.",
      "Newly qualified teacher with classroom placements in [level] and a passion for [subject]. Eager to build a positive and structured learning environment.",
    ],
    roles: [
      {
        keywords: ["primary", "elementary", "class teacher"],
        texts: [
          "Primary school teacher with [X] years of experience teaching pupils aged [X to X]. Uses hands-on activities and clear routines to keep young learners engaged.",
        ],
      },
      {
        keywords: ["english", "french", "arabic", "language"],
        texts: [
          "Language teacher with [X] years of experience teaching [language] at [level]. Focuses on speaking confidence and exam success.",
        ],
      },
    ],
  },
};

export function summariesFor(categoryId: string, jobTitle: string): string[] {
  const pack = packs[categoryId] ?? packs.student;
  const t = jobTitle.toLowerCase().trim();
  const match = t
    ? pack.roles.find((r) => r.keywords.some((k) => t.includes(k)))
    : undefined;
  return match ? [...match.texts, ...pack.general].slice(0, 3) : pack.general;
}