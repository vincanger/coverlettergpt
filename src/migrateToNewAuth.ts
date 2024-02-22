// import { PrismaClient } from '@prisma/client';
// import { ProviderName } from 'wasp/server/auth';

// export async function migrateGoogleAuth(prismaClient: PrismaClient) {
//   return createSocialLoginMigration(prismaClient, 'google');
// }

// export async function migrateGitHubAuth(prismaClient: PrismaClient) {
//   return createSocialLoginMigration(prismaClient, 'github');
// }

// async function createSocialLoginMigration(prismaClient: PrismaClient, providerName: 'google' | 'github') {
//   const users = await prismaClient.user.findMany({
//     include: {
//       auth: true,
//       externalAuthAssociations: true,
//     },
//   });

//   for (const user of users) {
//     if (user.auth) {
//       console.log('User was already migrated, skipping', user);
//       continue;
//     }

//     const provider = user.externalAuthAssociations.find((provider) => provider.provider === providerName);

//     if (!provider) {
//       console.log(`Missing ${providerName} provider, skipping user`, user);
//       continue;
//     }

//     await prismaClient.auth.create({
//       data: {
//         identities: {
//           create: {
//             providerName,
//             providerUserId: provider.providerId,
//             providerData: JSON.stringify({}),
//           },
//         },
//         user: {
//           connect: {
//             id: user.id,
//           },
//         },
//       },
//     });
//   }
// }
