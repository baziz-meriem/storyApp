import Stripe from 'stripe';
import { User } from '../models/User.js';

let stripe;

function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export async function createCheckoutSession(userId, { successUrl, cancelUrl }) {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    const err = new Error('STRIPE_PRICE_ID is not configured');
    err.status = 503;
    throw err;
  }

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { userId: user._id.toString() },
    });
    customerId = customer.id;
    user.stripeCustomerId = customerId;
    await user.save();
  }

  const session = await getStripe().checkout.sessions.create({
    mode: 'payment',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.FRONTEND_URL}/app?checkout=success`,
    cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/app?checkout=cancel`,
    metadata: { userId: user._id.toString() },
  });

  return { url: session.url, sessionId: session.id };
}

export async function handleStripeWebhook(rawBody, signature) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  const event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { premiumUnlocked: true });
    }
  }

  return { received: true };
}
