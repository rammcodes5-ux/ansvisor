import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-04-30.basil',
});

export const PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || 'price_placeholder',
  },
  growth: {
    monthly: process.env.STRIPE_GROWTH_MONTHLY_PRICE_ID || 'price_placeholder',
  },
} as const;
