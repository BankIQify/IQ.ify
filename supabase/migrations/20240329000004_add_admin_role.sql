-- First, get the user ID for bankiqify@gmail.com and store it in a variable
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO admin_user_id
    FROM auth.users
    WHERE email = 'bankiqify@gmail.com';

    -- If we found the user, insert the admin role if it doesn't exist
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Added admin role for user ID: %', admin_user_id;
    ELSE
        RAISE EXCEPTION 'User with email bankiqify@gmail.com not found';
    END IF;
END;
$$; 