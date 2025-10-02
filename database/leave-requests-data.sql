-- Leave Requests Data for September and October 2025
-- Using actual user IDs and leave type IDs provided
-- Updated to match the new schema structure

INSERT INTO leave_requests (
    id, 
    employee_id, 
    leave_type_id, 
    start_date, 
    end_date, 
    total_days, 
    reason, 
    status, 
    applied_date, 
    approved_date, 
    approver_id, 
    rejection_reason, 
    is_half_day,
    half_day_period,
    contact_info,
    created_at, 
    updated_at
) VALUES

-- September 2025 Leave Requests

-- Annual Leave Requests (Approved)
(gen_random_uuid(), '05f06964-cbaa-4a31-9d2f-09f61d33d294', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-09-02', '2025-09-06', 5.0, 'Family vacation to mountains', 'approved', '2025-08-15 09:30:00', '2025-08-16 14:20:00', '3b1b2317-a794-402d-9a9d-8dd1efa36475', NULL, false, NULL, 'Emergency contact: +1-555-0123. Handover notes sent to Sarah', '2025-08-15 09:30:00', '2025-08-16 14:20:00'),

(gen_random_uuid(), '296cd94f-3502-423c-ac57-f40bf8227068', '7456cfa6-c634-4a29-925b-ceed51c32f58', '2025-09-09', '2025-09-13', 5.0, 'Wedding anniversary celebration', 'approved', '2025-08-20 11:45:00', '2025-08-21 10:15:00', '4c241ac6-f173-48b1-92d5-c6d96b07cd63', NULL, false, NULL, 'Emergency contact: +1-555-0234. Tasks delegated to Jennifer', '2025-08-20 11:45:00', '2025-08-21 10:15:00'),

(gen_random_uuid(), '2f2db330-4052-41b5-a459-30554658ff06', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-09-16', '2025-09-20', 5.0, 'Annual leave for rest', 'approved', '2025-08-25 16:00:00', '2025-08-26 09:30:00', '9fc428d8-27cf-4f72-b49d-1603c36b3723', NULL, false, NULL, 'Emergency contact: +1-555-0345. Project status updated in shared drive', '2025-08-25 16:00:00', '2025-08-26 09:30:00'),

-- Sick Leave Requests
(gen_random_uuid(), '3a67086f-712f-4acd-b24a-cc2e5b43a72c', 'f4661f2a-12ab-48eb-93e7-5d6e49897403', '2025-09-03', '2025-09-04', 2.0, 'Flu symptoms and fever', 'approved', '2025-09-03 08:00:00', '2025-09-03 08:30:00', '04a993aa-08a6-4447-907c-a2d4e4fe26bc', NULL, false, NULL, 'Emergency contact: +1-555-0456. Will catch up on emails when back', '2025-09-03 08:00:00', '2025-09-03 08:30:00'),

(gen_random_uuid(), '56b6086e-bd45-401f-bfcc-1ca7d390b9e0', 'f4661f2a-12ab-48eb-93e7-5d6e49897403', '2025-09-12', '2025-09-12', 0.5, 'Doctor appointment for annual checkup', 'approved', '2025-09-10 14:30:00', '2025-09-10 15:00:00', '70358dd6-03bb-41f3-9787-20655e292e75', NULL, true, 'afternoon', 'Emergency contact: +1-555-0567. Meeting rescheduled to next day', '2025-09-10 14:30:00', '2025-09-10 15:00:00'),

(gen_random_uuid(), '631a0aac-3465-4343-9201-98102d933831', 'c202d494-6104-4633-abf9-f3028ef9e7ac', '2025-09-18', '2025-09-25', 6.0, 'Surgery recovery period', 'approved', '2025-09-01 10:00:00', '2025-09-01 11:30:00', '7518baf7-a873-4edc-ad64-85697847fbf2', NULL, false, NULL, 'Emergency contact: +1-555-0678. All pending tasks delegated to team', '2025-09-01 10:00:00', '2025-09-01 11:30:00'),

-- Personal Leave Requests
(gen_random_uuid(), '70e1edb9-63f3-4a64-80fa-ac6d88debaa0', '9786da1d-8c89-40d1-b658-e96e061cad35', '2025-09-23', '2025-09-24', 2.0, 'Personal family matters', 'approved', '2025-09-18 13:45:00', '2025-09-19 09:00:00', '9098cd16-8ac0-434e-ba21-06c257bd03cc', NULL, false, NULL, 'Emergency contact: +1-555-0789. Coverage arranged with colleague', '2025-09-18 13:45:00', '2025-09-19 09:00:00'),

(gen_random_uuid(), '742ed146-4a4a-4f63-b9a1-4f7795658e4f', '9786da1d-8c89-40d1-b658-e96e061cad35', '2025-09-30', '2025-09-30', 0.5, 'Personal appointment', 'pending', '2025-09-26 16:20:00', NULL, NULL, NULL, true, 'afternoon', 'Emergency contact: +1-555-0890. Half day coverage requested', '2025-09-26 16:20:00', '2025-09-26 16:20:00'),

-- Emergency Leave
(gen_random_uuid(), '825e145c-905f-4cf2-9ad7-bc1d0520f0f7', '7c38f901-41a9-4601-98c3-cc421d0afa32', '2025-09-11', '2025-09-11', 1.0, 'Family emergency - hospitalization', 'approved', '2025-09-11 07:30:00', '2025-09-11 08:00:00', 'b9ebdb96-63c7-4c13-b0b6-530e4ac70b10', NULL, false, NULL, 'Emergency contact: +1-555-0901. Will update team via email', '2025-09-11 07:30:00', '2025-09-11 08:00:00'),

-- Bereavement Leave
(gen_random_uuid(), '91511036-6d91-4ace-bad9-38b7c75da3e9', '6de286e1-67ad-49ad-9788-2e7f7ffcf695', '2025-09-26', '2025-09-30', 3.0, 'Funeral and bereavement for grandmother', 'approved', '2025-09-25 20:15:00', '2025-09-25 21:00:00', 'bed423bc-22d1-4d86-97fb-8a803d2fa26c', NULL, false, NULL, 'Emergency contact: +1-555-1012. Team notified, will catch up on return', '2025-09-25 20:15:00', '2025-09-25 21:00:00'),

-- Marriage Leave
(gen_random_uuid(), '93db051f-bbed-44be-a05c-e92088baa69e', '432672c0-caba-4346-86d3-60591b3c8f57', '2025-09-07', '2025-09-13', 5.0, 'Wedding ceremony and honeymoon', 'approved', '2025-07-15 12:00:00', '2025-07-16 10:30:00', 'f513ffe0-5e43-4cca-987a-843aece22647', NULL, false, NULL, 'Emergency contact: +1-555-1123. All projects handed over to senior staff', '2025-07-15 12:00:00', '2025-07-16 10:30:00'),

-- Study Leave
(gen_random_uuid(), 'aae55b8a-aa64-424d-b163-ee1f95cd7932', '450bca7b-2057-490b-9ab3-e9b6c17bb6bc', '2025-09-21', '2025-09-22', 2.0, 'Attending professional certification exam', 'approved', '2025-09-05 11:30:00', '2025-09-06 14:45:00', '075f8801-9ca0-4e2c-9ac1-cef8ba39243c', NULL, false, NULL, 'Emergency contact: +1-555-1234. Study materials organized, exam prep complete', '2025-09-05 11:30:00', '2025-09-06 14:45:00'),

-- Mental Health Leave
(gen_random_uuid(), 'c06704f9-50d9-482a-a082-5aa4d9e3c609', 'eee145f9-cd22-449f-8742-e5983b46994b', '2025-09-14', '2025-09-15', 2.0, 'Mental health and wellness break', 'approved', '2025-09-12 09:15:00', '2025-09-12 11:00:00', '63b9bc5c-9f5c-4ec8-8ee9-049279b06758', NULL, false, NULL, 'Emergency contact: +1-555-1345. Self-care time, will return refreshed', '2025-09-12 09:15:00', '2025-09-12 11:00:00'),

-- Rejected Leave Request
(gen_random_uuid(), 'c56db5ac-7ed7-4882-947c-98f982d65f8e', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-09-28', '2025-10-04', 5.0, 'Extended weekend vacation', 'rejected', '2025-09-20 15:30:00', '2025-09-21 09:45:00', '4c241ac6-f173-48b1-92d5-c6d96b07cd63', 'Critical project deadline conflicts with requested dates', false, NULL, 'Emergency contact: +1-555-1456. Can reschedule for next month', '2025-09-20 15:30:00', '2025-09-21 09:45:00'),

-- October 2025 Leave Requests

-- Annual Leave Requests
(gen_random_uuid(), 'c660b7ad-4c64-4f72-b03f-064abc650869', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-10-01', '2025-10-03', 3.0, 'Long weekend getaway', 'approved', '2025-09-15 14:20:00', '2025-09-16 10:15:00', '9fc428d8-27cf-4f72-b49d-1603c36b3723', NULL, false, NULL, 'Emergency contact: +1-555-1567. Quarterly reports completed early', '2025-09-15 14:20:00', '2025-09-16 10:15:00'),

(gen_random_uuid(), 'ca8775f4-abe1-437a-93a7-cad75a43d986', '7456cfa6-c634-4a29-925b-ceed51c32f58', '2025-10-07', '2025-10-11', 5.0, 'Fall vacation with family', 'approved', '2025-09-20 16:45:00', '2025-09-21 11:30:00', 'b9ebdb96-63c7-4c13-b0b6-530e4ac70b10', NULL, false, NULL, 'Emergency contact: +1-555-1678. All deliverables on track', '2025-09-20 16:45:00', '2025-09-21 11:30:00'),

(gen_random_uuid(), 'd6dfe6a0-7e5c-4b6c-bb84-b22df5a9a390', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-10-21', '2025-10-25', 5.0, 'Annual leave before winter season', 'approved', '2025-10-01 10:00:00', '2025-10-01 15:30:00', '9098cd16-8ac0-434e-ba21-06c257bd03cc', NULL, false, NULL, 'Emergency contact: +1-555-1789. Project handover completed', '2025-10-01 10:00:00', '2025-10-01 15:30:00'),

-- Maternity Leave (Extended)
(gen_random_uuid(), 'f68abfe9-b9ff-40e6-9b72-633802246573', '9d9edb9d-9ceb-4b7c-8b27-7133ae909557', '2025-10-15', '2026-02-15', 89.0, 'Maternity leave for childbirth and recovery', 'approved', '2025-08-15 13:00:00', '2025-08-16 09:45:00', '04a993aa-08a6-4447-907c-a2d4e4fe26bc', NULL, false, NULL, 'Emergency contact: +1-555-1890. Comprehensive handover document prepared', '2025-08-15 13:00:00', '2025-08-16 09:45:00'),

-- Paternity Leave
(gen_random_uuid(), 'fb5d25c4-1252-4b28-a56a-714ff4b770a7', 'fdf1863f-5769-4046-8cce-db0f919cf2ad', '2025-10-20', '2025-11-03', 10.0, 'Paternity leave for newborn care', 'approved', '2025-10-10 11:30:00', '2025-10-10 14:20:00', '70358dd6-03bb-41f3-9787-20655e292e75', NULL, false, NULL, 'Emergency contact: +1-555-1901. Team coverage arranged for 2 weeks', '2025-10-10 11:30:00', '2025-10-10 14:20:00'),

-- Sick Leave Requests
(gen_random_uuid(), '094a328b-fd92-4ef7-bc5b-3c251c699aab', 'f4661f2a-12ab-48eb-93e7-5d6e49897403', '2025-10-02', '2025-10-03', 2.0, 'Stomach flu recovery', 'approved', '2025-10-02 07:45:00', '2025-10-02 08:15:00', '7518baf7-a873-4edc-ad64-85697847fbf2', NULL, false, NULL, 'Emergency contact: +1-555-2012. Working from home not possible due to illness', '2025-10-02 07:45:00', '2025-10-02 08:15:00'),

(gen_random_uuid(), '0ddfd5a3-4911-41e2-81c3-f8cf450d1d24', 'c202d494-6104-4633-abf9-f3028ef9e7ac', '2025-10-14', '2025-10-18', 5, 'Medical procedure and recovery', 'approved', '2025-09-25 15:20:00', '2025-09-26 10:00:00', '63b9bc5c-9f5c-4ec8-8ee9-049279b06758', NULL, '+1-555-2123', 'Medical documentation provided to HR', '2025-09-25 15:20:00', '2025-09-26 10:00:00'),

-- Personal Leave
(gen_random_uuid(), '1784e37c-123e-4c17-89c0-cb4bcd1e76e0', '9786da1d-8c89-40d1-b658-e96e061cad35', '2025-10-08', '2025-10-09', 2.0, 'Moving to new apartment', 'approved', '2025-09-28 12:30:00', '2025-09-29 08:45:00', 'bed423bc-22d1-4d86-97fb-8a803d2fa26c', NULL, false, NULL, 'Emergency contact: +1-555-2234. Utilities transfer and moving logistics', '2025-09-28 12:30:00', '2025-09-29 08:45:00'),

-- Religious Leave
(gen_random_uuid(), 'f1f82d15-8164-4fc5-96f1-8968b9994479', '9fc837c4-0d0d-4d7a-8802-0b1205e80bd8', '2025-10-12', '2025-10-12', 1.0, 'Religious holiday observance', 'approved', '2025-10-05 09:00:00', '2025-10-05 10:30:00', 'f513ffe0-5e43-4cca-987a-843aece22647', NULL, false, NULL, 'Emergency contact: +1-555-2345. Will make up hours during the week', '2025-10-05 09:00:00', '2025-10-05 10:30:00'),

-- Compensatory Leave
(gen_random_uuid(), '05f06964-cbaa-4a31-9d2f-09f61d33d294', '1794c625-7f9a-4a5d-a899-73a3daaca03a', '2025-10-28', '2025-10-29', 2.0, 'Comp time for weekend project work', 'approved', '2025-10-22 16:15:00', '2025-10-23 09:30:00', '3b1b2317-a794-402d-9a9d-8dd1efa36475', NULL, false, NULL, 'Emergency contact: +1-555-2456. Weekend overtime documented and approved', '2025-10-22 16:15:00', '2025-10-23 09:30:00'),

-- Volunteer Leave
(gen_random_uuid(), '2f2db330-4052-41b5-a459-30554658ff06', '5f3744cc-dbdb-4d73-834d-e2e545111ede', '2025-10-17', '2025-10-17', 1.0, 'Community volunteer work at local shelter', 'approved', '2025-10-10 13:45:00', '2025-10-11 08:20:00', '9fc428d8-27cf-4f72-b49d-1603c36b3723', NULL, false, NULL, 'Emergency contact: +1-555-2567. Part of company community service initiative', '2025-10-10 13:45:00', '2025-10-11 08:20:00'),

-- Pending Leave Requests (Current)
(gen_random_uuid(), '296cd94f-3502-423c-ac57-f40bf8227068', 'ffaa48e6-ac37-444b-b8d8-d84d766322ab', '2025-10-31', '2025-11-01', 2.0, 'Halloween weekend break', 'pending', '2025-10-15 14:30:00', NULL, NULL, NULL, false, NULL, 'Emergency contact: +1-555-2678. Short break before busy November', '2025-10-15 14:30:00', '2025-10-15 14:30:00'),

(gen_random_uuid(), '3a67086f-712f-4acd-b24a-cc2e5b43a72c', '450bca7b-2057-490b-9ab3-e9b6c17bb6bc', '2025-10-26', '2025-10-27', 2.0, 'Professional development workshop', 'pending', '2025-10-18 11:00:00', NULL, NULL, NULL, false, NULL, 'Emergency contact: +1-555-2789. Workshop registration confirmed', '2025-10-18 11:00:00', '2025-10-18 11:00:00'),

(gen_random_uuid(), '56b6086e-bd45-401f-bfcc-1ca7d390b9e0', '9786da1d-8c89-40d1-b658-e96e061cad35', '2025-11-04', '2025-11-05', 2.0, 'Personal family commitment', 'pending', '2025-10-25 09:45:00', NULL, NULL, NULL, false, NULL, 'Emergency contact: +1-555-2890. Early November family event', '2025-10-25 09:45:00', '2025-10-25 09:45:00'),

-- Unpaid Leave Request
(gen_random_uuid(), '631a0aac-3465-4343-9201-98102d933831', 'f7c8df88-f13f-47d2-9235-c2aba2cd78fa', '2025-10-30', '2025-11-13', 11.0, 'Extended personal leave without pay', 'pending', '2025-10-20 16:00:00', NULL, NULL, NULL, false, NULL, 'Emergency contact: +1-555-2901. Personal circumstances require extended time off', '2025-10-20 16:00:00', '2025-10-20 16:00:00'),

-- Mental Health Leave
(gen_random_uuid(), '70e1edb9-63f3-4a64-80fa-ac6d88debaa0', 'eee145f9-cd22-449f-8742-e5983b46994b', '2025-10-22', '2025-10-24', 3.0, 'Mental health wellness days', 'approved', '2025-10-18 10:30:00', '2025-10-18 15:45:00', '63b9bc5c-9f5c-4ec8-8ee9-049279b06758', NULL, false, NULL, 'Emergency contact: +1-555-3012. Self-care and stress management focus', '2025-10-18 10:30:00', '2025-10-18 15:45:00'),

-- Emergency Leave
(gen_random_uuid(), '742ed146-4a4a-4f63-b9a1-4f7795658e4f', '7c38f901-41a9-4601-98c3-cc421d0afa32', '2025-10-16', '2025-10-16', 1.0, 'Child care emergency - school closure', 'approved', '2025-10-16 07:00:00', '2025-10-16 07:30:00', '9098cd16-8ac0-434e-ba21-06c257bd03cc', NULL, false, NULL, 'Emergency contact: +1-555-3123. Unexpected school closure due to maintenance', '2025-10-16 07:00:00', '2025-10-16 07:30:00');

-- Performance and analytics friendly indexes
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_date ON leave_requests(employee_id, start_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status_date ON leave_requests(status, applied_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_leave_type ON leave_requests(leave_type_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_date_range ON leave_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_approver ON leave_requests(approver_id);

-- Summary view for quick statistics
CREATE OR REPLACE VIEW leave_requests_summary AS
SELECT 
    lr.status,
    lt.name as leave_type_name,
    lt.type as leave_type_code,
    COUNT(*) as request_count,
    SUM(lr.total_days) as total_days,
    AVG(lr.total_days) as avg_days_per_request,
    DATE_TRUNC('month', lr.start_date) as leave_month
FROM leave_requests lr
JOIN leave_types lt ON lr.leave_type_id = lt.id
WHERE lr.start_date >= '2025-09-01' AND lr.start_date <= '2025-10-31'
GROUP BY lr.status, lt.name, lt.type, DATE_TRUNC('month', lr.start_date)
ORDER BY leave_month, lr.status, request_count DESC;