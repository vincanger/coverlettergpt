import type { User } from '@wasp/entities';

export async function updateUserSubscription(_args: unknown, context: any) {
  console.log('Starting CRON JOB: \n\nUpdating user subscriptions...')

  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
  
  const expiredUserSubscriptions = await context.entities.User.findMany({
    where: {
      datePaid: {
        lt: threeMonthsAgo,
      }
    },
  });

  const updatedSubscriptions = await Promise.allSettled(
    expiredUserSubscriptions.map(async (user: User) => {
      try {
        const updatedSubscription = await context.entities.User.update({
          where: {
            id: user.id,
          },
          data: {
            hasPaid: false,
            datePaid: null,
          },
        });
        return updatedSubscription;
      } catch (error) {
        console.error('Error updating User payment fields for user: ', user.id, error);
      }
    })
  );
  console.log('Updated user subscriptions: ', updatedSubscriptions)
}
