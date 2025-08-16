-- Create test users with different IDs
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'teacher@test.com',
    '$2a$10$U8CQ2cPrm7qGAzKRJVvkiOdxLHMbC.M4mE1rIqHhQGHChXJ8rNm3G', -- password: 111111
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"teacher","display_name":"测试老师"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'student@test.com',
    '$2a$10$U8CQ2cPrm7qGAzKRJVvkiOdxLHMbC.M4mE1rIqHhQGHChXJ8rNm3G', -- password: 111111
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"student","display_name":"测试学生"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);