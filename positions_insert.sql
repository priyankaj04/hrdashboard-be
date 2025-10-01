-- INSERT POSITIONS (Job titles for all departments)
-- This query creates positions for all departments referenced in employees table
-- IDs are auto-generated using uuid_generate_v4()

INSERT INTO positions (
    title, department_id, description, min_salary, max_salary, requirements, is_active
) VALUES
-- Administration Department Positions (ID: 7f99f4a4-f9bc-4565-841c-1c55399c8b03)
('Administrative Manager', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', 'Oversee daily administrative operations, manage office resources, coordinate with other departments', 65000.00, 85000.00, 
    ARRAY['Bachelor''s degree in Business Administration or related field', '3+ years management experience', 'Strong organizational skills', 'Proficiency in MS Office Suite'], true),

('Administrative Assistant', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', 'Provide administrative support, handle correspondence, maintain records and schedules', 40000.00, 55000.00, 
    ARRAY['High school diploma or equivalent', '2+ years administrative experience', 'Excellent communication skills', 'Proficiency in office software'], true),

('Office Coordinator', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', 'Coordinate office activities, manage supplies, support various departments', 45000.00, 60000.00, 
    ARRAY['Associate degree preferred', '1+ years office experience', 'Multi-tasking abilities', 'Customer service skills'], true),

-- Human Resources Department Positions (ID: 4f1c1616-12e5-42e2-af88-a92c9258d28a)
('HR Director', '4f1c1616-12e5-42e2-af88-a92c9258d28a', 'Lead HR strategy, oversee recruitment, employee relations, and policy development', 90000.00, 120000.00, 
    ARRAY['Master''s degree in HR or related field', '7+ years HR leadership experience', 'SHRM or HRCI certification preferred', 'Strategic thinking skills'], true),

('HR Manager', '4f1c1616-12e5-42e2-af88-a92c9258d28a', 'Manage HR operations, recruitment processes, employee development programs', 70000.00, 90000.00, 
    ARRAY['Bachelor''s degree in HR or related field', '5+ years HR experience', 'Knowledge of employment law', 'Leadership skills'], true),

('HR Specialist', '4f1c1616-12e5-42e2-af88-a92c9258d28a', 'Handle recruitment, onboarding, employee relations, and HR administrative tasks', 45000.00, 65000.00, 
    ARRAY['Bachelor''s degree in HR or related field', '2+ years HR experience', 'Strong interpersonal skills', 'Attention to detail'], true),

('Recruiter', '4f1c1616-12e5-42e2-af88-a92c9258d28a', 'Source, screen, and recruit qualified candidates for open positions', 50000.00, 70000.00, 
    ARRAY['Bachelor''s degree preferred', '2+ years recruiting experience', 'Strong networking skills', 'ATS proficiency'], true),

-- Engineering Department Positions (ID: f13e9674-2288-4a26-82ee-16b769f445d4)
('Engineering Director', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Lead engineering strategy, oversee technical teams, drive innovation and product development', 130000.00, 170000.00, 
    ARRAY['Bachelor''s/Master''s in Engineering or Computer Science', '10+ years technical leadership', 'System architecture experience', 'Team management skills'], true),

('Senior Software Engineer', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Design and develop complex software systems, mentor junior developers, lead technical initiatives', 100000.00, 140000.00, 
    ARRAY['Bachelor''s degree in Computer Science or related field', '5+ years software development', 'Full-stack development skills', 'Leadership experience'], true),

('Software Engineer', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Develop software applications, write clean code, participate in code reviews', 80000.00, 110000.00, 
    ARRAY['Bachelor''s degree in Computer Science or related field', '2+ years programming experience', 'Knowledge of modern frameworks', 'Problem-solving skills'], true),

('DevOps Engineer', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Manage CI/CD pipelines, cloud infrastructure, and deployment processes', 90000.00, 120000.00, 
    ARRAY['Bachelor''s degree in Computer Science or related field', '3+ years DevOps experience', 'Cloud platform expertise (AWS/Azure)', 'Infrastructure automation skills'], true),

('Frontend Developer', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Develop user interfaces, implement responsive designs, optimize user experience', 75000.00, 105000.00, 
    ARRAY['Bachelor''s degree in Computer Science or related field', '2+ years frontend development', 'React/Vue/Angular expertise', 'UI/UX design understanding'], true),

('Backend Developer', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'Develop server-side applications, APIs, and database systems', 80000.00, 110000.00, 
    ARRAY['Bachelor''s degree in Computer Science or related field', '2+ years backend development', 'API design experience', 'Database management skills'], true),

-- Marketing Department Positions (ID: 9a21b16a-e1c4-4546-901a-e25dfe5b1150)
('Marketing Director', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'Lead marketing strategy, brand management, and customer acquisition initiatives', 85000.00, 115000.00, 
    ARRAY['Bachelor''s degree in Marketing or related field', '7+ years marketing leadership', 'Digital marketing expertise', 'Brand management experience'], true),

('Marketing Manager', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'Manage marketing campaigns, analyze market trends, coordinate marketing activities', 65000.00, 85000.00, 
    ARRAY['Bachelor''s degree in Marketing or related field', '4+ years marketing experience', 'Campaign management skills', 'Analytics proficiency'], true),

('Digital Marketing Specialist', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'Execute digital marketing campaigns, manage social media, SEO/SEM optimization', 50000.00, 70000.00, 
    ARRAY['Bachelor''s degree in Marketing or related field', '2+ years digital marketing', 'Google Ads/Analytics certification', 'Social media expertise'], true),

('Content Marketing Specialist', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'Create marketing content, manage content calendar, develop brand messaging', 45000.00, 65000.00, 
    ARRAY['Bachelor''s degree in Marketing/Communications', '2+ years content creation', 'Excellent writing skills', 'Content management systems'], true),

('Marketing Coordinator', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'Support marketing initiatives, coordinate events, maintain marketing materials', 40000.00, 55000.00, 
    ARRAY['Bachelor''s degree preferred', '1+ years marketing experience', 'Project coordination skills', 'Creative software proficiency'], true),

-- Finance Department Positions (ID: 07da3151-96be-4e94-ac41-e0bde08d479f)
('Finance Director', '07da3151-96be-4e94-ac41-e0bde08d479f', 'Lead financial strategy, oversee accounting operations, manage budgets and forecasting', 100000.00, 130000.00, 
    ARRAY['Master''s degree in Finance/Accounting or CPA', '8+ years finance leadership', 'Financial analysis expertise', 'Regulatory compliance knowledge'], true),

('Financial Analyst', '07da3151-96be-4e94-ac41-e0bde08d479f', 'Analyze financial data, prepare reports, support budgeting and forecasting activities', 60000.00, 80000.00, 
    ARRAY['Bachelor''s degree in Finance/Accounting', '3+ years financial analysis', 'Advanced Excel skills', 'Financial modeling experience'], true),

('Accountant', '07da3151-96be-4e94-ac41-e0bde08d479f', 'Manage accounts payable/receivable, prepare financial statements, ensure compliance', 50000.00, 70000.00, 
    ARRAY['Bachelor''s degree in Accounting', '2+ years accounting experience', 'Knowledge of GAAP', 'ERP system experience'], true),

('Payroll Specialist', '07da3151-96be-4e94-ac41-e0bde08d479f', 'Process payroll, manage employee benefits, ensure payroll compliance', 45000.00, 60000.00, 
    ARRAY['Associate degree in Accounting/Business', '2+ years payroll experience', 'Payroll software proficiency', 'Attention to detail'], true),

('Accounts Payable Specialist', '07da3151-96be-4e94-ac41-e0bde08d479f', 'Process vendor invoices, manage payment schedules, maintain vendor relationships', 40000.00, 55000.00, 
    ARRAY['High school diploma or equivalent', '2+ years AP experience', 'ERP system knowledge', 'Strong organizational skills'], true),

-- Sales Department Positions (ID: 2dce43ee-86f1-453a-909c-e7650d70c5fc)
('Sales Director', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Lead sales strategy, manage sales team, drive revenue growth and market expansion', 90000.00, 120000.00, 
    ARRAY['Bachelor''s degree in Business/Marketing', '8+ years sales leadership', 'Proven track record of revenue growth', 'CRM expertise'], true),

('Sales Manager', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Manage sales team, develop sales strategies, maintain key client relationships', 70000.00, 90000.00, 
    ARRAY['Bachelor''s degree in Business/Marketing', '5+ years sales management', 'Team leadership skills', 'Sales forecasting experience'], true),

('Senior Sales Representative', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Manage key accounts, develop new business opportunities, mentor junior sales staff', 60000.00, 80000.00, 
    ARRAY['Bachelor''s degree preferred', '4+ years sales experience', 'Relationship building skills', 'Negotiation expertise'], true),

('Sales Representative', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Generate new leads, manage customer relationships, achieve sales targets', 45000.00, 65000.00, 
    ARRAY['Bachelor''s degree preferred', '2+ years sales experience', 'Communication skills', 'Goal-oriented mindset'], true),

('Business Development Representative', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Identify new business opportunities, qualify leads, support sales process', 40000.00, 60000.00, 
    ARRAY['Bachelor''s degree preferred', '1+ years business development', 'Prospecting skills', 'CRM proficiency'], true),

('Inside Sales Representative', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'Handle inbound sales inquiries, manage phone/email sales process', 35000.00, 50000.00, 
    ARRAY['High school diploma or equivalent', '1+ years sales experience', 'Phone sales skills', 'Customer service orientation'], true),

-- Operations Department Positions (ID: 2b2411d6-b743-44a7-9e16-09a6a5287858)
('Operations Director', '2b2411d6-b743-44a7-9e16-09a6a5287858', 'Lead operational strategy, process optimization, and cross-functional coordination', 95000.00, 125000.00, 
    ARRAY['Bachelor''s degree in Operations/Business', '8+ years operations leadership', 'Process improvement expertise', 'Project management skills'], true),

('Operations Manager', '2b2411d6-b743-44a7-9e16-09a6a5287858', 'Manage daily operations, optimize processes, ensure operational efficiency', 70000.00, 90000.00, 
    ARRAY['Bachelor''s degree in Operations/Business', '5+ years operations experience', 'Lean/Six Sigma knowledge', 'Team management skills'], true),

-- Quality Assurance Department Positions (ID: 4b5c9f83-9aa5-4f73-98a5-dedc15a4f37b)
('QA Director', '4b5c9f83-9aa5-4f73-98a5-dedc15a4f37b', 'Lead quality assurance strategy, oversee testing processes, ensure product quality', 90000.00, 120000.00, 
    ARRAY['Bachelor''s degree in Computer Science/Engineering', '7+ years QA leadership', 'Test automation expertise', 'Quality management systems'], true),

('Senior QA Engineer', '4b5c9f83-9aa5-4f73-98a5-dedc15a4f37b', 'Design test strategies, lead testing initiatives, mentor QA team members', 75000.00, 100000.00, 
    ARRAY['Bachelor''s degree in Computer Science/Engineering', '5+ years QA experience', 'Test automation tools', 'Agile/Scrum experience'], true),

-- Customer Support Department Positions (ID: 3679ed5d-3744-45e0-a30d-463c60ee8313)
('Customer Support Director', '3679ed5d-3744-45e0-a30d-463c60ee8313', 'Lead customer support strategy, manage support team, ensure customer satisfaction', 80000.00, 110000.00, 
    ARRAY['Bachelor''s degree in Business/Communications', '7+ years customer support leadership', 'Customer service excellence', 'Team management skills'], true),

('Customer Support Manager', '3679ed5d-3744-45e0-a30d-463c60ee8313', 'Manage support team, handle escalations, improve support processes', 60000.00, 80000.00, 
    ARRAY['Bachelor''s degree preferred', '4+ years support management', 'Customer service skills', 'Help desk software experience'], true),

-- Research & Development Department Positions (ID: 97f60ae6-0114-4928-95b7-4d65ae023123)
('R&D Director', '97f60ae6-0114-4928-95b7-4d65ae023123', 'Lead research and development initiatives, drive innovation, manage R&D projects', 110000.00, 150000.00, 
    ARRAY['PhD/Master''s in relevant field', '10+ years R&D leadership', 'Innovation management', 'Project management expertise'], true),

('Research Scientist', '97f60ae6-0114-4928-95b7-4d65ae023123', 'Conduct research projects, analyze data, develop new technologies and solutions', 80000.00, 110000.00, 
    ARRAY['Master''s/PhD in relevant field', '3+ years research experience', 'Data analysis skills', 'Scientific writing abilities'], true),

-- Legal Department Positions (ID: f1fab54a-fca2-451e-998c-f37e04bb18ff)
('Legal Counsel', 'f1fab54a-fca2-451e-998c-f37e04bb18ff', 'Provide legal advice, manage contracts, ensure regulatory compliance', 90000.00, 130000.00, 
    ARRAY['Juris Doctor (JD) degree', '5+ years legal experience', 'Corporate law expertise', 'Contract negotiation skills'], true),

('Paralegal', 'f1fab54a-fca2-451e-998c-f37e04bb18ff', 'Support legal counsel, prepare legal documents, conduct legal research', 45000.00, 65000.00, 
    ARRAY['Paralegal certificate or Bachelor''s degree', '2+ years paralegal experience', 'Legal research skills', 'Document preparation abilities'], true),

-- Procurement Department Positions (ID: 11c211bb-8466-4276-ad8d-cc80e04adb84)
('Procurement Manager', '11c211bb-8466-4276-ad8d-cc80e04adb84', 'Manage procurement processes, vendor relationships, and supply chain operations', 70000.00, 90000.00, 
    ARRAY['Bachelor''s degree in Supply Chain/Business', '5+ years procurement experience', 'Vendor management skills', 'Negotiation expertise'], true),

('Procurement Specialist', '11c211bb-8466-4276-ad8d-cc80e04adb84', 'Source suppliers, negotiate contracts, manage purchase orders', 50000.00, 70000.00, 
    ARRAY['Bachelor''s degree preferred', '3+ years procurement experience', 'Supplier evaluation skills', 'ERP system knowledge'], true);