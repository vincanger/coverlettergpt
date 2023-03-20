import HttpError from '@wasp/core/HttpError.js';
import fetch from 'node-fetch';
import type { Job, CoverLetter, User } from '@wasp/entities';
import type {
  GenerateCoverLetter,
  CreateJob,
  UpdateCoverLetter,
  UpdateJob,
  UpdateUser,
  StripePayment,
} from '@wasp/actions/types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});

const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

const gptConfig = {
  completeCoverLetter: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description.
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, professional style without being too formal, as a software developer might do naturally.`,
  coverLetterWithAWittyRemark: `You are a cover letter generator.
You will be given a job description along with the job applicant's resume.
You will write a cover letter for the applicant that matches their past experiences from the resume with the job description.
Rather than simply outlining the applicant's past experiences, you will give more detail and explain how those experiences will help the applicant succeed in the new job.
You will write the cover letter in a modern, relaxed style, as a software developer might do naturally.
Include a job related joke at the end of the cover letter.`,
  ideasForCoverLetter:
    "You are a cover letter idea generator. You will be given a job description along with the job applicant's resume. You will generate a bullet point list of ideas for the applicant to use in their cover letter. ",
};

type CoverLetterPayload = Pick<CoverLetter, 'title' | 'jobId'> & {
  content: string;
  description: string;
  isCompleteCoverLetter: boolean;
  includeWittyRemark: boolean;
  temperature: number;
};

export const generateCoverLetter: GenerateCoverLetter<CoverLetterPayload, CoverLetter> = async (
  { jobId, title, content, description, isCompleteCoverLetter, includeWittyRemark, temperature },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let command;
  let tokenNumber;
  if (isCompleteCoverLetter) {
    command = includeWittyRemark ? gptConfig.coverLetterWithAWittyRemark : gptConfig.completeCoverLetter;
    tokenNumber = 1000;
  } else {
    command = gptConfig.ideasForCoverLetter;
    tokenNumber = 500;
  }

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: command,
      },
      {
        role: 'user',
        content: `My Resume: ${content}. Job title: ${title} Job Description: ${description}.`,
      },
    ],
    max_tokens: tokenNumber,
    temperature,
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
    choices: [
      {
        index: number;
        message: {
          role: string;
          content: string;
        };
        finish_reason: string;
      }
    ];
  };

  const json = (await response.json()) as OpenAIResponse;

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

export const updateJob: UpdateJob<UpdateJobPayload, Job> = (
  { id, title, company, location, description, isCompleted },
  context
) => {
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
      isCompleted,
    },
  });
};

export type UpdateCoverLetterPayload = Pick<Job, 'id' | 'description'> &
  Pick<CoverLetter, 'content'> & { isCompleteCoverLetter: boolean; includeWittyRemark: boolean; temperature: number };

export const updateCoverLetter: UpdateCoverLetter<UpdateCoverLetterPayload, Job | CoverLetter> = async (
  { id, description, content, isCompleteCoverLetter, includeWittyRemark, temperature },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const job = await context.entities.Job.findFirst({
    where: {
      id,
      user: { id: context.user.id },
    },
  });

  if (!job) {
    throw new HttpError(404);
  }

  const coverLetter = await generateCoverLetter(
    {
      jobId: id,
      title: job.title,
      content,
      description: job.description,
      isCompleteCoverLetter,
      includeWittyRemark,
      temperature,
    },
    context
  );

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

type UpdateUserPayload = Pick<User, 'email'>;
type UpdateUserResult = Pick<User, 'id' | 'email' | 'hasPaid'>;

export const updateUser: UpdateUser<UpdateUserPayload, UpdateUserResult> = async ({ email }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { checkoutSessionId } = context.user;

  let status: Stripe.Checkout.Session.Status | null = null;
  if (checkoutSessionId) {
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    status = session?.status;
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      email: email ? email : undefined,
      hasPaid: status === 'complete' ? true : false,
    },
    select: {
      id: true,
      email: true,
      hasPaid: true,
    },
  });
};

type StripePaymentResult = {
  sessionUrl: string | null;
  sessionId: string;
};

export const stripePayment: StripePayment<string, StripePaymentResult> = async (email, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let customer: Stripe.Customer;

  if (email) {
    const stripeCustomer = await stripe.customers.list({
      email,
    });

    if (!stripeCustomer.data.length) {
      customer = await stripe.customers.create({
        email,
      });
    } else {
      customer = stripeCustomer.data[0];
    }
  } else {
    console.error('User does not have an email in their profile');
    throw new HttpError(400);
  }

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.PRODUCT_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${DOMAIN}/checkout?success=true`,
    cancel_url: `${DOMAIN}/checkout?canceled=true`,
    automatic_tax: { enabled: true },
    customer_update: {
      address: 'auto',
    },
    customer: customer.id,
  });

  if (session?.id) {
    await context.entities.User.update({
      where: {
        id: context.user.id,
      },
      data: {
        checkoutSessionId: session.id,
      },
    });
  }

  return new Promise((resolve, reject) => {
    if (!session) {
      reject(new Error('Could not create a Stripe session'));
    } else {
      resolve({
        sessionUrl: session.url,
        sessionId: session.id,
      });
    }
  });
};
