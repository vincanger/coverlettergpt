import { defineUserSignupFields } from 'wasp/server/auth';
import { z } from 'zod';

const googleDataSchema = z.object({
  profile: z.object({
    emails: z.array(
      z.object({
        value: z.string(),
      })
    ),
  }),
});

export const getUserFields = defineUserSignupFields({
  email: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.emails[0].value;
  },
  username: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.emails[0].value.split('@')[0];
  },
});

export function config() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    clientID, // look up from env or elsewhere,
    clientSecret, // look up from env or elsewhere,
    scope: ['profile', 'email'], // must include at least 'profile' for Google
  };
}
