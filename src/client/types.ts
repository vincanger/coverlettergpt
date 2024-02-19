import { type Job } from "wasp/entities";

export type JobPayload = Pick<Job, 'title' | 'company' | 'location' | 'description'>;
