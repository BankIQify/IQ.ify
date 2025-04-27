import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { cors } from 'cors/edge';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  runtime: 'edge',
};

export default {
  async POST(request: Request) {
    try {
      const { priceId, userId, trialPeriodDays, trialPlan } = await request.json();
      
      if (!priceId || !userId) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
          status: 400,
        });
      }

      // Get the price details to determine the product
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product);

      // Create checkout session with trial period
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        customer_creation: 'always',
        trial_period_days: trialPeriodDays,
        metadata: {
          userId,
          trialPlan,
          productType: product.id,
          subscription_tier: trialPlan,
          subscription_status: 'trialing',
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + trialPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
      });

      // Update user's trial status in Supabase
      await supabase
        .from('profiles')
        .update({
          subscription_tier: trialPlan,
          subscription_status: 'trialing',
          trial_started_at: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + trialPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
          trial_reminder_sent: false,
        })
        .eq('id', userId);

      // Update user's trial status in Supabase
      await supabase
        .from('profiles')
        .update({
          subscription_tier: trialPlan,
          subscription_status: 'trialing',
          trial_started_at: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + trialPeriodDays * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('id', userId);

      return new Response(JSON.stringify({ url: session.url }));
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), {
        status: 500,
      });
    }
  },
};
