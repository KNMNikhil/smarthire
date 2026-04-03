-- SmartHire Admin Account Setup
-- Run this SQL script in your Render PostgreSQL database

-- Create default admin account
-- Username: admin
-- Password: admin123 (CHANGE THIS AFTER FIRST LOGIN!)

INSERT INTO "Admins" (
    username, 
    email, 
    password, 
    name, 
    "createdAt", 
    "updatedAt"
) 
VALUES (
    'admin', 
    'admin@rajalakshmi.edu.in', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7dO', 
    'System Administrator', 
    NOW(), 
    NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Verify admin account was created
SELECT id, username, email, name, "createdAt" 
FROM "Admins" 
WHERE username = 'admin';

-- Optional: Create additional admin accounts
-- Uncomment and modify as needed

/*
INSERT INTO "Admins" (
    username, 
    email, 
    password, 
    name, 
    "createdAt", 
    "updatedAt"
) 
VALUES (
    'placement_officer', 
    'placement@rajalakshmi.edu.in', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEg7dO', 
    'Placement Officer', 
    NOW(), 
    NOW()
)
ON CONFLICT (username) DO NOTHING;
*/

-- Check total number of admins
SELECT COUNT(*) as total_admins FROM "Admins";

-- List all admin accounts (without passwords)
SELECT id, username, email, name, "createdAt" 
FROM "Admins" 
ORDER BY "createdAt" DESC;
