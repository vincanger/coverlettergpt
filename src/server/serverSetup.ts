import { emailSender } from '@wasp/jobs/emailSender.js';
import type { ServerSetupFnContext } from '@wasp/types';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
  apiVersion: '2022-11-15',
});

export default async function ({ app, server }: ServerSetupFnContext) {
  // this just tests that the sendgrid worker is working correctly
  // it can be removed here and within the `main.wasp` file after sendgrid is properly configured

  // await emailSender.submit({
  //   to: 'vincanger@gmail.com',
  //   subject: 'Test',
  //   text: 'Test',
  //   html: 'Test',
  // });

  app.post('/stripe-webhook', async (request, response) => {
    console.log('\n\n <<<< custome webhook route >>>> \n\n');
    let event: Stripe.Event = request.body;
    let userStripeId: string | null = null;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!', paymentIntent.customer);
      userStripeId = paymentIntent.customer as string;
      if (paymentIntent.amount === 295) {
        console.log('paymentIntent.amount', paymentIntent.amount);
        await prisma.user.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            credits: {
              increment: 10,
            }
          },
        });
      }
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
  });
}
