import { z } from "zod";

export const resumeSchema = z.object({
  personal: z.object({
    fullName: z.string().min(1, "Name is required"),
    jobTitle: z.string().optional(),
    email: z.string().email("Invalid email"),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    linkedin: z.string().optional(),
    photo: z.string().optional(),
  }),

  summary: z.string().optional(),

  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string().min(1, "Role is required"),
      company: z.string().min(1, "Company is required"),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      bullets: z.array(z.string()),
    })
  ),

  education: z.array(
    z.object({
      id: z.string(),
      school: z.string().min(1, "School is required"),
      degree: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      details: z.string().optional(),
    })
  ),

  skills: z.array(z.string()),

  customSections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      items: z.array(z.string()),
    })
  ),
});

export type ResumeData = z.infer<typeof resumeSchema>;