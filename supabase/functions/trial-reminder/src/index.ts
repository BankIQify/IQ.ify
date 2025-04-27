import { createClient } from '@supabase/supabase-js';
import { cors } from 'cors/edge';

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
      // Get users who have trials ending in 3 days
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email, trial_end_date, subscription_tier')
        .eq('subscription_status', 'trialing')
        .eq('trial_reminder_sent', false)
        .gte('trial_end_date', new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()) // 2 days from now
        .lte('trial_end_date', new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()); // 4 days from now

      if (users?.length) {
        for (const user of users) {
          try {
            // Send email reminder
            await supabase.functions.invoke('send-trial-reminder-email', {
              body: {
                email: user.email,
                trial_end_date: user.trial_end_date,
                subscription_tier: user.subscription_tier,
              },
            });

            // Mark reminder as sent
            await supabase
              .from('profiles')
              .update({ trial_reminder_sent: true })
              .eq('id', user.id);
          } catch (error) {
            console.error(`Failed to send reminder to user ${user.id}:`, error);
          }
        }
      }

      return new Response(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error in trial reminder function:', error);
      return new Response(JSON.stringify({ error: 'Failed to process trial reminders' }), {
        status: 500,
      });
    }
  },
};
