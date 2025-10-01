-- INSERT USERS (35 records for all employees)
-- This query creates user accounts for all employees
-- All users have the same password hash: $2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q
-- IDs are auto-generated using uuid_generate_v4()

INSERT INTO users (
    email, password_hash, role, is_active
) VALUES
-- Administration Department Users
('john.anderson@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('maria.garcia@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('robert.chen@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),

-- Human Resources Department Users
('sarah.johnson@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'hr', true),
('jennifer.williams@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'hr', true),
('michael.brown@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'hr', true),
('lisa.davis@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'hr', true),

-- Engineering Department Users
('david.wilson@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('emily.rodriguez@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('james.taylor@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('ashley.lee@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('kevin.martinez@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('rachel.thompson@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('daniel.white@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),

-- Marketing Department Users
('amanda.harris@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('christopher.clark@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('nicole.lewis@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('brian.walker@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('stephanie.hall@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),

-- Finance Department Users
('matthew.young@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('jessica.king@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('andrew.wright@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('melissa.lopez@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('ryan.hill@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),

-- Sales Department Users
('tyler.green@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'manager', true),
('samantha.adams@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('justin.baker@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('kimberly.gonzalez@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('brandon.nelson@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('natalie.carter@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),

-- Additional Department Users
('jordan.mitchell@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('victoria.perez@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('alexander.roberts@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true),
('grace.turner@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'hr', true),
('nathan.phillips@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'employee', true);

-- Add one admin user for system administration
INSERT INTO users (email, password_hash, role, is_active) VALUES
('admin@company.com', '$2a$12$hao2IxbJ/iD8oPMZj6j0Hem.HoLlJMrodBpSA8TUHLbM45Ws/S.5q', 'admin', true);