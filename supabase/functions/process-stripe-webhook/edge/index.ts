import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default {
  async POST(request: Request) {
    try {
      const signature = request.headers.get('stripe-signature');
      const payload = await request.text();
      
      const event = stripe.webhooks.constructEvent(
        payload,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      const { data: { user_id } } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('stripe_customer_id', event.data.object.customer)
        .single();

      if (!user_id) {
        console.error('No user found for customer ID:', event.data.object.customer);
        return new Response('No user found', { status: 404 });
      }

      switch (event.type) {
        case 'checkout.session.async_payment_succeeded':
          await supabase
            .from('profiles')
            .update({
              last_payment_intent_id: event.data.object.payment_intent,
              last_payment_intent_status: event.data.object.payment_intent_status,
              payment_source_type: event.data.object.payment_method_types[0],
              payment_source_country: event.data.object.country,
              payment_source_fingerprint: event.data.object.payment_method_details.card.fingerprint
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.created':
          await supabase
            .from('profiles')
            .update({
              stripe_subscription_id: event.data.object.id,
              subscription_status: event.data.object.status,
              subscription_plan_id: event.data.object.items.data[0].plan.id,
              subscription_start_date: new Date(event.data.object.start_date * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.updated':
          await supabase
            .from('profiles')
            .update({
              subscription_status: event.data.object.status,
              subscription_plan_id: event.data.object.items.data[0].plan.id,
              subscription_next_billing_date: new Date(event.data.object.current_period_end * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.deleted':
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'canceled',
              subscription_end_date: new Date(event.data.object.current_period_end * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.trial_will_end':
          await supabase
            .from('profiles')
            .update({
              subscription_trial_end_date: new Date(event.data.object.trial_end * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.paused':
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'paused',
              subscription_paused_at: new Date(event.data.object.paused_at * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'customer.subscription.resumed':
          await supabase
            .from('profiles')
            .update({
              subscription_status: event.data.object.status,
              subscription_resumed_at: new Date(event.data.object.resumed_at * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'invoice.payment_succeeded':
          await supabase
            .from('profiles')
            .update({
              last_payment_date: new Date(event.data.object.created * 1000),
              next_payment_date: new Date(event.data.object.next_payment_attempt * 1000)
            })
            .eq('user_id', user_id);
          break;

        case 'invoice.payment_failed':
          await supabase
            .from('profiles')
            .update({
              last_payment_failure_code: event.data.object.charge?.failure_code,
              last_payment_failure_message: event.data.object.charge?.failure_message,
              last_payment_failure_type: event.data.object.charge?.failure_type
            })
            .eq('user_id', user_id);
          break;

        case 'invoice.payment_action_required':
          await supabase
            .from('profiles')
            .update({
              last_payment_action_required: true,
              last_payment_action_url: event.data.object.hosted_invoice_url
            })
            .eq('user_id', user_id);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response(null, { status: 200 });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return new Response('Webhook Error', { status: 400 });
    }
  }
}
