-- INSERT EMPLOYEES (30+ records)
-- This query creates a diverse set of employees across all departments
-- IDs are auto-generated using uuid_generate_v4()

INSERT INTO employees (
    user_id, employee_id, first_name, last_name, date_of_birth, gender, phone, personal_email,
    address, city, state, postal_code, country, department_id, position_id, manager_id,
    hire_date, employment_status, employment_type, salary, salary_type, currency
) VALUES
-- Administration Department (ID: 7f99f4a4-f9bc-4565-841c-1c55399c8b03)
('3b1b2317-a794-402d-9a9d-8dd1efa36475', 'EMP001', 'John', 'Anderson', '1985-03-15', 'male', '+1 (555) 123-4567', 'john.anderson@personal.com', '123 Main St', 'New York', 'NY', '10001', 'United States', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', '94da3d82-a534-4fa8-9261-ee1a11256fe6', NULL, '2022-01-15', 'active', 'full-time', 75000.00, 'annual', 'USD'),

('296cd94f-3502-423c-ac57-f40bf8227068', 'EMP002', 'Maria', 'Garcia', '1990-07-22', 'female', '+1 (555) 123-4568', 'maria.garcia@personal.com', '456 Oak Ave', 'New York', 'NY', '10002', 'United States', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', '478dfded-57d9-489f-8769-0479edb71f22', 'EMP001', '2023-03-10', 'active', 'full-time', 72000.00, 'annual', 'USD'),

('aae55b8a-aa64-424d-b163-ee1f95cd7932', 'EMP003', 'Robert', 'Chen', '1988-11-08', 'male', '+1 (555) 123-4569', 'robert.chen@personal.com', '789 Pine St', 'New York', 'NY', '10003', 'United States', '7f99f4a4-f9bc-4565-841c-1c55399c8b03', '8199ada5-7bef-470b-92e9-5665c9bc0b74', 'EMP001', '2023-08-15', 'active', 'full-time', 68000.00, 'annual', 'USD'),

-- Human Resources Department (ID: 4f1c1616-12e5-42e2-af88-a92c9258d28a)
('f513ffe0-5e43-4cca-987a-843aece22647', 'EMP004', 'Sarah', 'Johnson', '1987-05-12', 'female', '+1 (555) 234-5678', 'sarah.johnson@personal.com', '321 Elm St', 'New York', 'NY', '10004', 'United States', '4f1c1616-12e5-42e2-af88-a92c9258d28a', 'bb3020cc-ec40-4f3d-ab84-6b626f202d0b', NULL, '2021-03-20', 'active', 'full-time', 78000.00, 'annual', 'USD'),

('04a993aa-08a6-4447-907c-a2d4e4fe26bc', 'EMP005', 'Jennifer', 'Williams', '1992-09-18', 'female', '+1 (555) 234-5679', 'jennifer.williams@personal.com', '654 Maple Ave', 'New York', 'NY', '10005', 'United States', '4f1c1616-12e5-42e2-af88-a92c9258d28a', '0df93b2c-7c77-40d2-8617-cd67bfd480d1', 'EMP004', '2022-08-30', 'active', 'full-time', 48000.00, 'annual', 'USD'),

('7518baf7-a873-4edc-ad64-85697847fbf2', 'EMP006', 'Michael', 'Brown', '1986-12-05', 'male', '+1 (555) 234-5680', 'michael.brown@personal.com', '987 Cedar St', 'New York', 'NY', '10006', 'United States', '4f1c1616-12e5-42e2-af88-a92c9258d28a', '06b9aad0-daf9-4e2e-9969-47d98b62102d', 'EMP004', '2023-01-15', 'active', 'full-time', 46000.00, 'annual', 'USD'),

('70358dd6-03bb-41f3-9787-20655e292e75', 'EMP007', 'Lisa', 'Davis', '1989-04-28', 'female', '+1 (555) 234-5681', 'lisa.davis@personal.com', '147 Birch St', 'New York', 'NY', '10007', 'United States', '4f1c1616-12e5-42e2-af88-a92c9258d28a', '8413e0ca-1350-4667-ad26-df9c2d316102', NULL, '2020-11-12', 'active', 'full-time', 74000.00, 'annual', 'USD'),

-- Engineering Department (ID: f13e9674-2288-4a26-82ee-16b769f445d4)
('9fc428d8-27cf-4f72-b49d-1603c36b3723', 'EMP008', 'David', 'Wilson', '1984-08-14', 'male', '+1 (555) 345-6789', 'david.wilson@personal.com', '258 Spruce Ave', 'New York', 'NY', '10008', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '4d6c6641-76df-4adb-95a6-c4fcb2c71980', NULL, '2020-11-25', 'active', 'full-time', 105000.00, 'annual', 'USD'),

('56b6086e-bd45-401f-bfcc-1ca7d390b9e0', 'EMP009', 'Emily', 'Rodriguez', '1991-06-20', 'female', '+1 (555) 345-6790', 'emily.rodriguez@personal.com', '369 Walnut St', 'New York', 'NY', '10009', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '143f680c-f050-45d0-b1e6-00cdaa45480e', 'EMP008', '2022-06-10', 'active', 'full-time', 89000.00, 'annual', 'USD'),

('05f06964-cbaa-4a31-9d2f-09f61d33d294', 'EMP010', 'James', 'Taylor', '1988-10-30', 'male', '+1 (555) 345-6791', 'james.taylor@personal.com', '741 Chestnut Dr', 'New York', 'NY', '10010', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '5b4fd650-c2ba-480e-990b-3d3ccda5367f', 'EMP008', '2023-02-15', 'active', 'full-time', 92000.00, 'annual', 'USD'),

('0ddfd5a3-4911-41e2-81c3-f8cf450d1d24', 'EMP011', 'Ashley', 'Lee', '1993-01-12', 'female', '+1 (555) 345-6792', 'ashley.lee@personal.com', '852 Poplar Ln', 'New York', 'NY', '10011', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '7a2ce216-d998-4831-98b5-573ac3c025f8', 'EMP008', '2023-07-20', 'active', 'full-time', 87000.00, 'annual', 'USD'),

('075f8801-9ca0-4e2c-9ac1-cef8ba39243c', 'EMP012', 'Kevin', 'Martinez', '1990-03-25', 'male', '+1 (555) 345-6793', 'kevin.martinez@personal.com', '963 Hickory Ave', 'New York', 'NY', '10012', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '2c6c4b68-5dcc-47c0-abf0-92359869da1b', NULL, '2021-09-08', 'active', 'full-time', 98000.00, 'annual', 'USD'),

('1784e37c-123e-4c17-89c0-cb4bcd1e76e0', 'EMP013', 'Rachel', 'Thompson', '1987-12-18', 'female', '+1 (555) 345-6794', 'rachel.thompson@personal.com', '174 Sycamore St', 'New York', 'NY', '10013', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', 'f5c78b60-122b-492c-9946-29c50bd535bb', 'EMP008', '2022-04-12', 'active', 'full-time', 85000.00, 'annual', 'USD'),

('bed423bc-22d1-4d86-97fb-8a803d2fa26c', 'EMP014', 'Daniel', 'White', '1985-09-07', 'male', '+1 (555) 345-6795', 'daniel.white@personal.com', '285 Magnolia Rd', 'New York', 'NY', '10014', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '143f680c-f050-45d0-b1e6-00cdaa45480e', NULL, '2019-12-15', 'active', 'full-time', 110000.00, 'annual', 'USD'),

-- Marketing Department (ID: 9a21b16a-e1c4-4546-901a-e25dfe5b1150)
-- Marketing Department (ID: c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f)
('b6e29f16-0d85-4b66-a1b8-f2c4503ba0b2', 'EMP015', 'Brian', 'Jackson', '1986-04-22', 'male', '+1 (555) 345-6796', 'brian.jackson@personal.com', '396 Elm Ct', 'New York', 'NY', '10015', 'United States', 'c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f', '8f3b60f7-78cf-4d7e-967a-9b5c4f1d8e2a', NULL, '2021-03-10', 'active', 'full-time', 88000.00, 'annual', 'USD'),

('a2bb4b5e-9669-437a-8c2c-75bbec1cdd2b', 'EMP016', 'Jessica', 'Harris', '1992-11-08', 'female', '+1 (555) 345-6797', 'jessica.harris@personal.com', '507 Pine Way', 'New York', 'NY', '10016', 'United States', 'c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f', 'e5f8a3b2-1c9d-4e6f-8a7b-2c3d4e5f6a7b', 'EMP015', '2022-08-20', 'active', 'full-time', 72000.00, 'annual', 'USD'),

('5c4bbcf6-46c7-45d9-a9c8-f06b35d3baf1', 'EMP017', 'Christopher', 'Clark', '1989-07-16', 'male', '+1 (555) 345-6798', 'christopher.clark@personal.com', '618 Cedar Blvd', 'New York', 'NY', '10017', 'United States', 'c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f', 'e5f8a3b2-1c9d-4e6f-8a7b-2c3d4e5f6a7b', 'EMP015', '2023-01-14', 'active', 'full-time', 70000.00, 'annual', 'USD'),

('f5e1bc3f-0b4c-4e57-ae73-e20c4bd01deb', 'EMP018', 'Michelle', 'Lewis', '1990-02-28', 'female', '+1 (555) 345-6799', 'michelle.lewis@personal.com', '729 Birch St', 'New York', 'NY', '10018', 'United States', 'c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f', 'f9b6d4e8-3a2c-4f1e-9b8a-5c6d7e8f9a0b', 'EMP015', '2023-05-25', 'active', 'full-time', 68000.00, 'annual', 'USD'),

('54976b3b-6af3-46cd-80cc-b11b8a46cd49', 'EMP019', 'Andrew', 'Walker', '1985-12-05', 'male', '+1 (555) 345-6800', 'andrew.walker@personal.com', '830 Ash Ave', 'New York', 'NY', '10019', 'United States', 'c0a80da0-7a2c-4651-b95b-4a5c8e8b1a4f', 'e5f8a3b2-1c9d-4e6f-8a7b-2c3d4e5f6a7b', NULL, '2020-10-18', 'active', 'full-time', 75000.00, 'annual', 'USD'),

('ca8775f4-abe1-437a-93a7-cad75a43d986', 'EMP016', 'Christopher', 'Clark', '1986-07-03', 'male', '+1 (555) 456-7891', 'christopher.clark@personal.com', '507 Willow Way', 'New York', 'NY', '10016', 'United States', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', '21a746e9-aea3-4131-9e6e-7d4ec7ecb066', 'EMP015', '2022-10-25', 'active', 'full-time', 62000.00, 'annual', 'USD'),

('c660b7ad-4c64-4f72-b03f-064abc650869','EMP017', 'Nicole', 'Lewis', '1992-04-16', 'female', '+1 (555) 456-7892', 'nicole.lewis@personal.com', '618 Ash St', 'New York', 'NY', '10017', 'United States', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', '8a770556-4998-41ad-8d6a-fd000bc5d2c2', 'EMP015', '2023-03-08', 'active', 'full-time', 59000.00, 'annual', 'USD'),

('825e145c-905f-4cf2-9ad7-bc1d0520f0f7','EMP018', 'Brian', 'Walker', '1988-01-29', 'male', '+1 (555) 456-7893', 'brian.walker@personal.com', '729 Beech Blvd', 'New York', 'NY', '10018', 'United States', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', '37daf020-2d7a-4fa1-aba9-7a57e788635a', 'EMP015', '2023-09-12', 'active', 'full-time', 64000.00, 'annual', 'USD'),

('094a328b-fd92-4ef7-bc5b-3c251c699aab', 'EMP019', 'Stephanie', 'Hall', '1990-08-11', 'female', '+1 (555) 456-7894', 'stephanie.hall@personal.com', '830 Cedar Cir', 'New York', 'NY', '10019', 'United States', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', 'c23212dc-be67-44c6-9628-c6606ff98640', 'EMP015', '2022-01-30', 'active', 'full-time', 61000.00, 'annual', 'USD'),

-- Finance Department (ID: 07da3151-96be-4e94-ac41-e0bde08d479f)
('42bb2b60-ccb5-4fef-a3be-2d5b6b4fd6cc', 'EMP020', 'Matthew', 'Young', '1985-05-14', 'male', '+1 (555) 567-8901', 'matthew.young@personal.com', '941 Fir Ave', 'New York', 'NY', '10020', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', '73c64e92-4a80-4129-8bfa-3fb6fb5ed327', NULL, '2020-08-15', 'active', 'full-time', 78000.00, 'annual', 'USD'),

('a2bb4b5e-9669-437a-8c2c-75bbec1cdd2b', 'EMP021', 'Jessica', 'King', '1991-02-27', 'female', '+1 (555) 567-8902', 'jessica.king@personal.com', '152 Hemlock St', 'New York', 'NY', '10021', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', '1ca2221e-1949-4caf-8d53-60ee00c5d68a', 'EMP020', '2022-11-20', 'active', 'full-time', 74000.00, 'annual', 'USD'),

('54976b3b-6af3-46cd-80cc-b11b8a46cd49', 'EMP022', 'Andrew', 'Wright', '1987-09-05', 'male', '+1 (555) 567-8903', 'andrew.wright@personal.com', '263 Juniper Dr', 'New York', 'NY', '10022', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', '70aae2cb-ebf6-47fd-8d1e-b970ef1ba84c', 'EMP020', '2023-06-10', 'active', 'full-time', 72000.00, 'annual', 'USD'),

('f5e1bc3f-0b4c-4e57-ae73-e20c4bd01deb', 'EMP023', 'Melissa', 'Lopez', '1989-12-19', 'female', '+1 (555) 567-8904', 'melissa.lopez@personal.com', '374 Laurel Ln', 'New York', 'NY', '10023', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', 'e15d6970-4ac0-4df0-9fca-5e4eb019acb0', 'EMP020', '2021-04-25', 'active', 'full-time', 76000.00, 'annual', 'USD'),

('42c8c33f-b063-47ac-a3c5-e06e8d93af9a', 'EMP024', 'Ryan', 'Hill', '1988-06-08', 'male', '+1 (555) 567-8905', 'ryan.hill@personal.com', '485 Linden Ave', 'New York', 'NY', '10024', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', '8c823a88-895c-450c-9141-7c740fb7d923', 'EMP020', '2022-07-15', 'active', 'full-time', 75000.00, 'annual', 'USD'),

-- Sales Department (ID: 2dce43ee-86f1-453a-909c-e7650d70c5fc)
('02ff6c5e-c5da-4ffa-901a-6ad5ad9b2d66', 'EMP025', 'Tyler', 'Green', '1990-10-13', 'male', '+1 (555) 678-9012', 'tyler.green@personal.com', '596 Redwood St', 'New York', 'NY', '10025', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', '41ee8abd-bf70-48fd-912c-64b352fc9dae', NULL, '2021-12-01', 'active', 'full-time', 58000.00, 'annual', 'USD'),

('0c01bfe6-eb00-4ac6-afe1-6b06d4b73daa', 'EMP026', 'Samantha', 'Adams', '1993-03-06', 'female', '+1 (555) 678-9013', 'samantha.adams@personal.com', '607 Sequoia Dr', 'New York', 'NY', '10026', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'f67c3f5b-2679-42a3-84ac-7d04a2f7f2ad', 'EMP025', '2022-05-18', 'active', 'full-time', 55000.00, 'annual', 'USD'),

('5c4bbcf6-46c7-45d9-a9c8-f06b35d3baf1', 'EMP027', 'Justin', 'Baker', '1986-11-24', 'male', '+1 (555) 678-9014', 'justin.baker@personal.com', '718 Cottonwood Cir', 'New York', 'NY', '10027', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'e0566e0d-201b-42ab-bfec-6fb8298b6482', 'EMP025', '2023-01-22', 'active', 'full-time', 52000.00, 'annual', 'USD'),

('075f8801-9ca0-4e2c-9ac1-cef8ba39243c', 'EMP028', 'Kimberly', 'Gonzalez', '1992-07-17', 'female', '+1 (555) 678-9015', 'kimberly.gonzalez@personal.com', '829 Elm Ridge Rd', 'New York', 'NY', '10028', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'd4d8460e-5731-4545-8d0a-71dfc8d23268', 'EMP025', '2022-09-05', 'active', 'full-time', 56000.00, 'annual', 'USD'),

('b6e29f16-0d85-4b66-a1b8-f2c4503ba0b2', 'EMP029', 'Brandon', 'Nelson', '1989-04-02', 'male', '+1 (555) 678-9016', 'brandon.nelson@personal.com', '930 Pine Valley Dr', 'New York', 'NY', '10029', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', '23fc1042-7f6a-43a5-bafc-6cbcd6e6918c', 'EMP025', '2023-04-15', 'active', 'full-time', 54000.00, 'annual', 'USD'),

('4b41ed42-d8f8-4e33-9eba-1e7c44c43b6d', 'EMP030', 'Natalie', 'Carter', '1987-01-28', 'female', '+1 (555) 678-9017', 'natalie.carter@personal.com', '141 Oak Hill Ln', 'New York', 'NY', '10030', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', '250f41ee-271e-4a84-a6bd-400292bfa90f', 'EMP025', '2021-10-30', 'active', 'full-time', 59000.00, 'annual', 'USD'),

-- Additional employees across departments
('05f06964-cbaa-4a31-9d2f-09f61d33d294', 'EMP031', 'Jordan', 'Mitchell', '1991-08-15', 'male', '+1 (555) 789-0123', 'jordan.mitchell@personal.com', '252 Maple Grove St', 'New York', 'NY', '10031', 'United States', 'f13e9674-2288-4a26-82ee-16b769f445d4', '5b4fd650-c2ba-480e-990b-3d3ccda5367f', 'EMP008', '2023-05-10', 'active', 'part-time', 45000.00, 'annual', 'USD'),

('0ddfd5a3-4911-41e2-81c3-f8cf450d1d24', 'EMP032', 'Victoria', 'Perez', '1994-02-11', 'female', '+1 (555) 789-0124', 'victoria.perez@personal.com', '363 Cherry Blossom Ave', 'New York', 'NY', '10032', 'United States', '9a21b16a-e1c4-4546-901a-e25dfe5b1150', '8a770556-4998-41ad-8d6a-fd000bc5d2c2', 'EMP015', '2023-08-20', 'active', 'full-time', 60000.00, 'annual', 'USD'),

('1784e37c-123e-4c17-89c0-cb4bcd1e76e0', 'EMP033', 'Alexander', 'Roberts', '1985-12-03', 'male', '+1 (555) 789-0125', 'alexander.roberts@personal.com', '474 Willow Creek Dr', 'New York', 'NY', '10033', 'United States', '07da3151-96be-4e94-ac41-e0bde08d479f', '1ca2221e-1949-4caf-8d53-60ee00c5d68a', 'EMP020', '2020-03-15', 'active', 'full-time', 82000.00, 'annual', 'USD'),

('bed423bc-22d1-4d86-97fb-8a803d2fa26c', 'EMP034', 'Grace', 'Turner', '1990-06-26', 'female', '+1 (555) 789-0126', 'grace.turner@personal.com', '585 River Bend Rd', 'New York', 'NY', '10034', 'United States', '4f1c1616-12e5-42e2-af88-a92c9258d28a', '0df93b2c-7c77-40d2-8617-cd67bfd480d1', 'EMP004', '2023-11-05', 'active', 'full-time', 47000.00, 'annual', 'USD'),

('4b41ed42-d8f8-4e33-9eba-1e7c44c43b6d', 'EMP035', 'Nathan', 'Phillips', '1988-09-19', 'male', '+1 (555) 789-0127', 'nathan.phillips@personal.com', '696 Forest Glen Ave', 'New York', 'NY', '10035', 'United States', '2dce43ee-86f1-453a-909c-e7650d70c5fc', 'd4d8460e-5731-4545-8d0a-71dfc8d23268', 'EMP025', '2022-12-18', 'active', 'full-time', 57000.00, 'annual', 'USD');