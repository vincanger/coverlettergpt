import HttpError from '@wasp/core/HttpError.js';
import fetch from 'node-fetch';
import type { Resume, Job, CoverLetter } from '@wasp/entities';
import type { UploadResume, GenerateCoverLetter, CreateJob, UpdateCoverLetter, UpdateJob, ShareIncrementer } from '@wasp/actions/types';

const gptConfig = {
  completeCoverLetter: "You are a cover letter generator. You will be given a job description along with the job applicant's resume. You will write a cover letter for the applicant that matches their past experiences from the resume with the job description. Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job. You will write the cover letter in a modern, professional style without being too formal, as a software developer might do naturally. ",
  ideasForCoverLetter: "You are a cover letter idea generator. You will be given a job description along with the job applicant's resume. You will generate a bullet point list of ideas for the applicant to use in their cover letter. ",
}

type CoverLetterPayload = Pick<CoverLetter, 'title' | 'jobId'> & Pick<Resume, 'content'> & { description: string, isCompleteCoverLetter: boolean  };

export const generateCoverLetter: GenerateCoverLetter<CoverLetterPayload, CoverLetter> = async (
  { jobId, title, content, description, isCompleteCoverLetter },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let command;
  let tokenNumber;
  if (isCompleteCoverLetter) {
    command = gptConfig.completeCoverLetter
    tokenNumber = 1000
  } else { 
    command = gptConfig.ideasForCoverLetter;
    tokenNumber = 500
  }

  console.log('\n\n arguments >>>>', jobId, title, content, description, isCompleteCoverLetter, '\n\n')

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `My Resume: ${content}. Job Description: ${description}.`
      },
    ],
    max_tokens: tokenNumber,
    temperature: 0.6,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  });

  type OpenAIResponse = {
    id: string;
    object: string;
    created: number;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    choices: [{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }]
  }

  const json = (await response.json()) as OpenAIResponse;
  console.log("\n\n response >>>>", json, "\n\n")
  console.log("\n\n coverLetter Create args >>>>", {
      title,
      content: json.choices[0].message.content,
      tokenUsage: json.usage.completion_tokens,
      user: { connect: { id: context.user.id } },
      job: { connect: { id: jobId } },
    }, "\n\n")

  
  return context.entities.CoverLetter.create({
    data: {
      title,
      content: json.choices[0].message.content,
      tokenUsage: json.usage.completion_tokens,
      user: { connect: { id: context.user.id } },
      job: { connect: { id: jobId } },
    },
  });
};

export type JobPayload = Pick<Job, 'title' | 'company' | 'location' | 'description'>;

export const createJob: CreateJob<JobPayload, Job> = ({ title, company, location, description }, context) => {
  console.log('create job');
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.create({
    data: {
      title,
      description,
      location,
      company,
      user: { connect: { id: context.user.id } },
    },
  });
};

export type UpdateJobPayload = Pick<Job, 'id' | 'title' | 'company' | 'location' | 'description' | 'isCompleted'>;


export const updateJob: UpdateJob<UpdateJobPayload, Job> = ({ id, title, company, location, description, isCompleted }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      location,
      company,
      isCompleted
    },
  });
}

export type UpdateCoverLetterPayload = Pick<Job, 'id' | 'description'> & Pick<CoverLetter, 'content'> & { isCompleteCoverLetter: boolean };

export const updateCoverLetter: UpdateCoverLetter<UpdateCoverLetterPayload, Job | CoverLetter> = async ({ id, description, content, isCompleteCoverLetter }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const job = await context.entities.Job.findFirst({
    where: {
      id,
      user: { id: context.user.id }
    },
  });

  if (!job) {
    throw new HttpError(404);
  }

  console.log('generating cover letter >>>', { id, description, content, isCompleteCoverLetter });
  const coverLetter = await generateCoverLetter({ jobId: id, title: job.title, content, description: job.description, isCompleteCoverLetter }, context)

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      description,
      coverLetter: { connect: { id: coverLetter.id } },
    },
    include: {
      coverLetter: true,
    },
  });
};

type resumePayload = Pick<Resume, 'content'>;

export const uploadResume: UploadResume<resumePayload, Resume> = ({ content }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Resume.create({
    data: {
      content,
      user: { connect: { id: context.user.id } },
    },
  });
};

export const updateResume: UploadResume<resumePayload, Resume> = ({ content }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Resume.create({
    data: {
      content,
      user: { connect: { id: context.user.id } },
    },
  });
};

type SharePayload = Pick<Job, 'id'>;

export const shareIncrementer: ShareIncrementer<SharePayload, Job> = async ({ id }, context: any) => {
  console.log('here', id);
  const job = await context.entities.Job.findUnique({
    where: {
      id,
    },
  });

  console.log('job', job);

  if (!job) {
    throw new HttpError(404);
  }

  return context.entities.Job.update({
    where: {
      id,
    },
    data: {
      shares: {
        increment: 1,
      },
    },
  });
};
