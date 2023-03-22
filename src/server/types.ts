import { User, Prisma } from '@prisma/client';

export type Context = {
  user: User;
  entities: {
    User: Prisma.UserDelegate<{}>;
  };
};
