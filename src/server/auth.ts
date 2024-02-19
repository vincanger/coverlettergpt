import { defineUserSignupFields } from 'wasp/auth/providers/types';

export const getGoogleUserFields = defineUserSignupFields({
  email: (data: any) => data.profile.emails[0].value,
  username: (data: any) => data.profile.displayName,
});

export function getGoogleAuthConfig() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return {
    clientID, // look up from env or elsewhere,
    clientSecret, // look up from env or elsewhere,
    scope: ['profile', 'email'], // must include at least 'profile' for Google
  };
}
