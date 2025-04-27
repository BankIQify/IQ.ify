-- Verify environment variables were saved correctly
SELECT 
    id,
    key,
    -- Don't show actual values for security
    CASE 
        WHEN key IN ('STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SUPABASE_SERVICE_ROLE_KEY') 
        THEN '***' || SUBSTRING(value FROM LENGTH(value) - 3)  -- Show last 3 chars
        ELSE value
    END as value,
    created_at,
    updated_at
FROM env_vars
ORDER BY key;
