import type { Job } from '@wasp/entities'

export type CoverLetterPayload = {
  jobId: string;
  title: string;
  content: string;
  description: string;
  isCompleteCoverLetter: boolean;
  includeWittyRemark: boolean;
  temperature: number;
  gptModel: string;
};

export type JobPayload = Pick<Job, 'title' | 'company' | 'location' | 'description'>;
