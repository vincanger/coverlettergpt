import { defineUserSignupFields } from 'wasp/server/auth';
import { z } from 'zod';

const googleDataSchema = z.object({
  profile: z.object({
    email: z.string(),
    name: z.string(),
  }),
});

export const getUserFields = defineUserSignupFields({
  email: (data: any) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.email;
  },
  username: (data: any) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.name;
  }
})

export function config() {
  return {
    scopes: ['profile', 'email'],
  };
}
