import { emailSender } from "wasp/server/email";
import { type StripeWebhook } from "wasp/server/api";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2023-08-16',
});

export const stripeWebhook: StripeWebhook = async (request, response, context) => {
  console.log('\n\n <<<< custome webhook route >>>> \n\n');
  let event: Stripe.Event = request.body;
  let userStripeId: string | null = null;
  const session = event.data.object as Stripe.Checkout.Session;
  userStripeId = session.customer as string;

  try {
    if (event.type === 'payment_intent.succeeded') {
      console.log('payment succeeded', '\n\n', event);
    }

    if (event.type === 'checkout.session.completed') {
      console.log('checkout.session.completed', event.type, '\n\n', event);

      // retrieve session
      const { line_items } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price'],
      });

      console.log('line_items: ', line_items);

      if (line_items?.data[0]?.price?.id === process.env.GPT4_PRICE_ID) {
        console.log('GPT4o Subscription purchased');
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            hasPaid: true,
            gptModel: 'gpt-4o',
            datePaid: new Date(),
          },
        });
      } else if (line_items?.data[0]?.price?.id === process.env.PRODUCT_PRICE_ID) {
        console.log('gpt-4o-mini Subscription purchased');
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            hasPaid: true,
            datePaid: new Date(),
            gptModel: 'gpt-4o-mini',
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
            gptModel: 'gpt-4o-mini',
          },
        });
      }
    } else if (event.type === 'invoice.paid') {
      console.log('>>>> invoice.paid');
      const invoice = event.data.object as Stripe.Invoice;
      const periodStart = new Date(invoice.period_start * 1000);
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          hasPaid: true,
          datePaid: periodStart,
        },
      });
    } else if (event.type === 'invoice.payment_failed') {
      console.log('>>>> invoice.payment_failed for user: ', userStripeId);
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      userStripeId = subscription.customer as string;

      console.log('SUBSCRIPTION UPDATED: ', subscription);

      if (subscription.status === 'active') {
        console.log('Subscription active ', userStripeId);
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: 'active',
          },
        });
      }
      if (subscription.status === 'past_due') {
        console.log('Subscription past due: ', userStripeId);
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: 'past_due',
          },
        });
      }
      if (subscription.cancel_at_period_end) {
        /**
         * Stripe will send a subscription.updated event when a subscription is canceled
         * but the subscription is still active until the end of the period.
         * So we check if cancel_at_period_end is true and send an email to the customer.
         * https://stripe.com/docs/billing/subscriptions/cancel#events
         */
        console.log('Subscription canceled at period end: ', userStripeId);

        const customer = await context.entities.User.findFirst({
          where: {
            stripeId: userStripeId,
          },
          select: {
            email: true,
          },
        });

        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: 'canceled',
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
      console.log('Subscription deleted/ended: ', userStripeId);
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          hasPaid: false,
          subscriptionStatus: 'ended',
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
