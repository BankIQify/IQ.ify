-- This script will set a user's profile to PRO status
-- Replace the following values with your actual user's data

-- First, update the profiles table
UPDATE profiles
SET 
    subscription_tier = 'pro',
    subscription_status = 'active',
    subscription_expires_at = CURRENT_TIMESTAMP + interval '1 year'
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the update
SELECT * FROM profiles WHERE email = 'YOUR_EMAIL_HERE';
