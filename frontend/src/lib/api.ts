import { z } from "zod";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Zod Schemas for API responses
const JobStatusSchema = z.object({
  jobId: z.string(),
  status: z.enum(["pending", "processing", "done", "error"]),
  progress: z.number().optional(),
  message: z.string().optional(),
});

const SkillEvidenceSchema = z.object({
  snippet: z.string(),
  sourceType: z.string(),
  sourceUrl: z.string().optional(),
});

const SkillSchema = z.object({
  name: z.string(),
  type: z.enum(["hard", "soft", "emerging"]),
  confidence: z.number(),
  evidence: z.array(SkillEvidenceSchema),
});

const ProfileSchema = z.object({
  jobId: z.string(),
  name: z.string(),
  summary: z.string(),
  skills: z.array(SkillSchema),
  topSkills: z.array(SkillSchema).optional(),
});

// Export types
export type JobStatus = z.infer<typeof JobStatusSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type ProfileResponse = z.infer<typeof ProfileSchema>;

// API Client
export const apiClient = {
  async ingestCV(file?: File, urls?: string[]) {
    const formData = new FormData();
    
    if (file) {
      formData.append("file", file);
    }
    
    if (urls && urls.length > 0) {
      formData.append("urls", JSON.stringify(urls));
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/ingest`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { jobId: data.job_id };
  },

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/status/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get job status: ${response.statusText}`);
    }

    const data = await response.json();
    return JobStatusSchema.parse(data);
  },

  async getProfile(jobId: string): Promise<ProfileResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/profile/${jobId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get profile: ${response.statusText}`);
    }

    const data = await response.json();
    return ProfileSchema.parse(data);
  },
};
