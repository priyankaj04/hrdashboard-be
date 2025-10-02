-- Leave Types Data for HR Dashboard
-- This includes common leave types with their configurations

INSERT INTO leave_types (id, name, description, max_days, is_paid, color, requires_medical_certificate, advance_notice_days, can_carry_forward, max_carry_forward_days, created_at, updated_at) VALUES
-- Annual/Vacation Leave
('annual', 'Annual Leave', 'Yearly vacation leave for rest and recreation', 25, true, '#4CAF50', false, 7, true, 5, NOW(), NOW()),
('vacation', 'Vacation Leave', 'Extended vacation for personal time off', 20, true, '#2196F3', false, 14, true, 3, NOW(), NOW()),

-- Medical/Health Related
('sick', 'Sick Leave', 'Leave for illness or medical appointments', 12, true, '#FF5722', true, 0, false, 0, NOW(), NOW()),
('medical', 'Medical Leave', 'Extended medical leave for serious health conditions', 30, true, '#E91E63', true, 3, false, 0, NOW(), NOW()),
('emergency', 'Emergency Leave', 'Urgent leave for unforeseen circumstances', 5, true, '#FF9800', false, 0, false, 0, NOW(), NOW()),

-- Family Related
('maternity', 'Maternity Leave', 'Leave for mothers before and after childbirth', 120, true, '#9C27B0', false, 30, false, 0, NOW(), NOW()),
('paternity', 'Paternity Leave', 'Leave for fathers after childbirth', 15, true, '#673AB7', false, 30, false, 0, NOW(), NOW()),
('parental', 'Parental Leave', 'Extended leave for child care', 90, false, '#3F51B5', false, 60, false, 0, NOW(), NOW()),
('adoption', 'Adoption Leave', 'Leave for adoption process and bonding', 60, true, '#795548', false, 30, false, 0, NOW(), NOW()),
('bereavement', 'Bereavement Leave', 'Leave for death of family member or close friend', 7, true, '#607D8B', false, 0, false, 0, NOW(), NOW()),

-- Personal Development
('study', 'Study Leave', 'Leave for educational purposes and training', 10, false, '#009688', false, 21, false, 0, NOW(), NOW()),
('sabbatical', 'Sabbatical Leave', 'Extended leave for personal development or research', 365, false, '#795548', false, 90, false, 0, NOW(), NOW()),

-- Personal/Other
('personal', 'Personal Leave', 'General personal leave for individual needs', 8, true, '#FFC107', false, 3, true, 2, NOW(), NOW()),
('unpaid', 'Unpaid Leave', 'Leave without pay for personal reasons', 30, false, '#9E9E9E', false, 14, false, 0, NOW(), NOW()),
('compensatory', 'Compensatory Leave', 'Leave in lieu of overtime work', 15, true, '#00BCD4', false, 1, true, 5, NOW(), NOW()),

-- Special Occasions
('marriage', 'Marriage Leave', 'Leave for wedding ceremony and related activities', 7, true, '#E91E63', false, 30, false, 0, NOW(), NOW()),
('religious', 'Religious Leave', 'Leave for religious observances and pilgrimages', 5, true, '#FF6F00', false, 7, false, 0, NOW(), NOW()),
('jury', 'Jury Duty', 'Leave for jury service and court appearances', 10, true, '#455A64', false, 0, false, 0, NOW(), NOW()),

-- Work-Life Balance
('mental_health', 'Mental Health Leave', 'Leave for mental health and wellness', 10, true, '#8BC34A', false, 1, false, 0, NOW(), NOW()),
('volunteer', 'Volunteer Leave', 'Leave for volunteer work and community service', 3, false, '#4CAF50', false, 7, false, 0, NOW(), NOW()),

-- COVID-19 and Health Emergency
('quarantine', 'Quarantine Leave', 'Leave for quarantine due to health emergency', 14, true, '#F44336', false, 0, false, 0, NOW(), NOW()),
('covid', 'COVID-19 Leave', 'Special leave for COVID-19 related issues', 14, true, '#FF5722', false, 0, false, 0, NOW(), NOW());

-- Update sequences if using PostgreSQL with auto-increment
-- This ensures the next auto-generated ID doesn't conflict
-- SELECT setval('leave_types_id_seq', (SELECT MAX(id) FROM leave_types WHERE id ~ '^\d+$')::int);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leave_types_is_paid ON leave_types(is_paid);
CREATE INDEX IF NOT EXISTS idx_leave_types_max_days ON leave_types(max_days);
CREATE INDEX IF NOT EXISTS idx_leave_types_requires_medical ON leave_types(requires_medical_certificate);

-- Sample view for commonly used leave types
CREATE OR REPLACE VIEW common_leave_types AS
SELECT 
    id,
    name,
    description,
    max_days,
    is_paid,
    color,
    advance_notice_days
FROM leave_types 
WHERE id IN ('annual', 'sick', 'personal', 'vacation', 'maternity', 'paternity', 'bereavement')
ORDER BY 
    CASE id
        WHEN 'annual' THEN 1
        WHEN 'sick' THEN 2
        WHEN 'personal' THEN 3
        WHEN 'vacation' THEN 4
        WHEN 'maternity' THEN 5
        WHEN 'paternity' THEN 6
        WHEN 'bereavement' THEN 7
        ELSE 99
    END;