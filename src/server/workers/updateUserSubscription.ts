import { type User } from "wasp/entities";

export async function updateUserSubscription(_args: unknown, context: any) {
  console.log('Starting CRON JOB: \n\nUpdating user subscriptions...')

  const currentDate = new Date();
  const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));

  // new subscriptions were introduced on the 17th of August, 2023
  // so all payments before that date are considered legacy subscriptions and should be updated
  // but we don't want to update subscriptions that were created after that date
  // const dateSubscriptionsWereIntroduced = new Date('2023-08-17');
  
  let expiredUserSubscriptions = await context.entities.User.findMany({
    where: {
      datePaid: {
        lt: threeMonthsAgo,
      }
    },
  });

  // expiredUserSubscriptions = expiredUserSubscriptions.filter((user: User) => {
  //   if (user.hasPaid === false || user.datePaid === null) {
  //     return false;
  //   }
  //   return user.datePaid < dateSubscriptionsWereIntroduced;
  // }); 

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
