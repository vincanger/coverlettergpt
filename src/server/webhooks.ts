import { StripeWebhook } from '@wasp/apis/types';
import Stripe from 'stripe';
import { emailSender } from '@wasp/email/index.js';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});

export const stripeWebhook: StripeWebhook = async (request, response, context) => {
  console.log('\n\n <<<< custome webhook route >>>> \n\n');
  let event: Stripe.Event = request.body;
  let userStripeId: string | null = null;
  const session = event.data.object as Stripe.Checkout.Session;
  userStripeId = session.customer as string;

  try {
    if (event.type === 'checkout.session.completed') {
      const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });
      console.log('line_items: ', line_items);

      if (line_items?.data[0]?.price?.id === process.env.GPT4_PRICE_ID) {
        console.log('GPT4 Subscription purchased');
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            hasPaid: true,
            gptModel: 'gpt-4',
            datePaid: new Date(),
          },
        });
      } else if (line_items?.data[0]?.price?.id === process.env.PRODUCT_PRICE_ID) {
        console.log('GPT3.5-turbo Subscription purchased');
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            hasPaid: true,
            datePaid: new Date(),
            gptModel: 'gpt-3.5-turbo',
          },
        });
      } else if (line_items?.data[0]?.price?.id === process.env.PRODUCT_CREDITS_PRICE_ID) {
        console.log('Credits purchased: ');
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            credits: {
              increment: 10,
            },
            gptModel: 'gpt-3.5-turbo',
          },
        });
      }
    } else if (event.type === 'invoice.paid') {
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          hasPaid: true,
          datePaid: new Date(),
        },
      });
    } else if (event.type === 'invoice.paymnent_failed') {
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          hasPaid: false,
        },
      });
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      userStripeId = subscription.customer as string;

      /**
       * Stripe will send a subscription.updated event when a subscription is canceled
       * but the subscription is still active until the end of the period.
       * So we check if cancel_at_period_end is true and send an email to the customer.
       * https://stripe.com/docs/billing/subscriptions/cancel#events
       */
      if (subscription.cancel_at_period_end) {
        console.log('Subscription canceled at period end');

        const customer = await context.entities.User.findFirst({
          where: {
            stripeId: userStripeId,
          },
          select: {
            email: true,
          },
        });

        if (customer?.email) {
          await emailSender.send({
            to: customer.email,
            subject: 'We hate to see you go :(',
            text: "We're sorry if you weren't satisfied with your experience. We'd love to hear your feedback. Please reply to this email with any comments or concerns. We're always looking to improve! ",
            html: "We're sorry if you weren't satisfied with your experience. We'd love to hear your feedback. Please reply to this email with any comments or concerns. We're always looking to improve! ",
          });
        }
      }
    } else if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.canceled') {
      const subscription = event.data.object as Stripe.Subscription;
      userStripeId = subscription.customer as string;

      /**
       * Stripe will send then finally send a subscription.deleted event when subscription period ends
       * https://stripe.com/docs/billing/subscriptions/cancel#events
       */
      console.log('Subscription deleted/ended');
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          hasPaid: false,
        },
      });
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.log('error', error);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
};
