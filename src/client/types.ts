export type CoverLetterPayload = {
  jobId: string;
  title: string;
  content: string;
  description: string;
  isCompleteCoverLetter: boolean;
  includeWittyRemark: boolean;
  temperature: number;
};