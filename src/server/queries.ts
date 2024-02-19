import { type CoverLetter, type Job, type User } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type GetCoverLetter,
  type GetJobs,
  type GetJob,
  type GetUserInfo,
  type GetCoverLetterCount,
} from "wasp/server/operations";

export const getCoverLetter: GetCoverLetter<Pick<CoverLetter, 'id'> , CoverLetter> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.findFirstOrThrow({
    where: {
      id,
      user: { id: context.user.id },
    },
  });
};

type GetCoverLetterArgs = {
  id: string;
};

export const getCoverLetters: GetCoverLetter<GetCoverLetterArgs, CoverLetter[]> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.CoverLetter.findMany({
    where: {
      job: { id },
      user: { id: context.user.id },
    },
  });
};

export const getJobs: GetJobs<void, Job[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.Job.findMany({
    where: {
      user: { id: context.user.id },
    },
    include: {
      coverLetter: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

type GetJobArgs = { id: string };
type GetJobResult = (Job & { coverLetter: CoverLetter[] });

export const getJob: GetJob<GetJobArgs, GetJobResult> = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  
  return context.entities.Job.findFirstOrThrow({
    where: {
      id,
      user: { id: context.user.id },
    },
    include: {
      coverLetter: true,
    },
  });
};

export const getUserInfo: GetUserInfo<Pick<User, 'id'> | null, Pick<User, 'id' | 'email' | 'hasPaid' | 'notifyPaymentExpires' | 'credits' | 'gptModel' | 'isUsingLn' | 'subscriptionStatus'> & { letters: CoverLetter[] }> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.findUniqueOrThrow({
    where: {
      id: context.user.id,
    },
    select: {
      letters: true,
      id: true,
      email: true,
      hasPaid: true,
      notifyPaymentExpires: true,
      credits: true,
      gptModel: true,
      isUsingLn: true,
      subscriptionStatus: true,
    },
  });
};


export const getCoverLetterCount: GetCoverLetterCount<void, number> = async (_args, context) => {
  return context.entities.CoverLetter.count();
}