
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";

// Create Supabase admin client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!signature || !stripeWebhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Stripe secret key is not configured");
      return new Response(JSON.stringify({ error: "Stripe configuration error" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    // Get the raw request body
    const body = await req.text();
    
    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    console.log(`Received webhook event: ${event.type}`);

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id || session.client_reference_id;
        const subscriptionId = session.subscription;
        
        if (userId && subscriptionId) {
          // Retrieve the subscription to get details like the plan and status
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Get the plan ID
          const planId = subscription.items.data[0].plan.id;
          
          // Determine the subscription tier based on the price ID
          let subscriptionTier = 'standard';
          if (planId.includes('annual')) {
            subscriptionTier = 'annual';
          } else if (planId.includes('monthly')) {
            subscriptionTier = 'monthly';
          }
          
          // Update the user's profile with subscription information
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_id: subscriptionId,
              subscription_status: subscription.status,
              subscription_tier: subscriptionTier,
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', userId);
          
          if (error) {
            console.error(`Error updating user profile: ${error.message}`);
            return new Response(JSON.stringify({ error: "Error updating user profile" }), { 
              status: 500,
              headers: { 'Content-Type': 'application/json' } 
            });
          }
          
          console.log(`Successfully updated subscription for user ${userId}`);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: subscription.status,
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', userId);
          
          if (error) {
            console.error(`Error updating subscription status: ${error.message}`);
          } else {
            console.log(`Successfully updated subscription status for user ${userId}`);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.user_id;
        
        if (userId) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              subscription_status: 'canceled',
              subscription_expires_at: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', userId);
          
          if (error) {
            console.error(`Error marking subscription as canceled: ${error.message}`);
          } else {
            console.log(`Successfully marked subscription as canceled for user ${userId}`);
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error(`Webhook error: ${error.message}`);
    return new Response(JSON.stringify({ error: "Webhook processing error" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
});
