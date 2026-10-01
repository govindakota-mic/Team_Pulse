export type Level = 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Manager' | 'Director';
export type LeaveType = 'Casual' | 'Sick' | 'Earned';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Employee {
  id: number; name: string; email: string; department: string; role: string;
  level: Level; dob: string; joinDate: string; active: boolean; monthlySalary: number;
}
export interface LeaveRequest {
  id: number; empId: number; type: LeaveType; from: string; to: string;
  days: number; reason: string; status: LeaveStatus; appliedOn: string;
}
export interface Holiday { name: string; date: string; type: 'Public' | 'Optional'; }

export const LEVELS: Level[] = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director'];

// name, department, role, level, dob, joinDate, active
const ROWS: [string, string, string, Level, string, string, boolean][] = [
  ['Priya Sharma', 'Engineering', 'VP Engineering', 'Director', '1984-10-02', '2021-03-15', true],
  ['Arjun Mehta', 'Engineering', 'Engineering Manager', 'Manager', '1988-09-30', '2021-08-02', true],
  ['Sneha Reddy', 'Engineering', 'Tech Lead', 'Lead', '1990-11-12', '2022-01-10', true],
  ['Rahul Verma', 'Engineering', 'Senior Developer', 'Senior', '1992-04-21', '2022-06-20', true],
  ['Ananya Iyer', 'Engineering', 'Software Engineer', 'Mid', '1996-10-05', '2023-02-13', true],
  ['Karthik Rao', 'Product', 'Product Manager', 'Lead', '1991-09-28', '2022-04-04', true],
  ['Meera Nair', 'Product', 'Associate PM', 'Mid', '1997-12-01', '2024-01-08', true],
  ['Vikram Singh', 'Marketing', 'Growth Marketer', 'Senior', '1993-07-19', '2022-09-12', true],
  ['Divya Kapoor', 'Marketing', 'Content Specialist', 'Junior', '1999-10-14', '2024-05-20', true],
  ['Rohan Das', 'Finance', 'Financial Analyst', 'Senior', '1990-02-27', '2021-10-04', true],
  ['Neha Joshi', 'Finance', 'Accountant', 'Junior', '1998-09-29', '2024-09-30', true],
  ['Aditya Kumar', 'Design', 'UI Designer', 'Mid', '1995-03-08', '2023-09-29', true],
  ['Ishita Bose', 'Design', 'Design Intern', 'Intern', '2003-10-18', '2025-07-01', true],
  ['Sana Khan', 'HR', 'HR Manager', 'Manager', '1987-05-16', '2021-05-17', true],
  ['Tanvi Menon', 'HR', 'Recruiter', 'Mid', '1996-08-23', '2023-11-06', true],
  ['Manish Gupta', 'Sales', 'Sales Executive', 'Junior', '1999-12-09', '2025-03-17', false],
];

// Sample monthly gross salary (INR) by level, for pay slips
const SALARY: Record<Level, number> = { Intern: 25000, Junior: 45000, Mid: 75000, Senior: 120000, Lead: 165000, Manager: 200000, Director: 320000 };

export const EMPLOYEES: Employee[] = ROWS.map(([name, department, role, level, dob, joinDate, active], i) => ({
  id: i + 1, name, department, role, level, dob, joinDate, active, monthlySalary: SALARY[level],
  email: name.toLowerCase().replace(' ', '.') + '@teampulse.com',
}));

export const HOLIDAYS: Holiday[] = [
  { name: 'Republic Day', date: '2026-01-26', type: 'Public' },
  { name: 'Holi', date: '2026-03-04', type: 'Public' },
  { name: 'Good Friday', date: '2026-04-03', type: 'Public' },
  { name: 'May Day', date: '2026-05-01', type: 'Public' },
  { name: 'Independence Day', date: '2026-08-15', type: 'Public' },
  { name: 'Gandhi Jayanti', date: '2026-10-02', type: 'Public' },
  { name: 'Dussehra', date: '2026-10-20', type: 'Public' },
  { name: 'Diwali', date: '2026-11-08', type: 'Public' },
  { name: 'Guru Nanak Jayanti', date: '2026-11-24', type: 'Optional' },
  { name: 'Christmas', date: '2026-12-25', type: 'Public' },
];

export const LEAVES: LeaveRequest[] = [
  { id: 1, empId: 4, type: 'Casual', from: '2026-10-05', to: '2026-10-06', days: 2, reason: 'Family function', status: 'Pending', appliedOn: '2026-09-25' },
  { id: 2, empId: 9, type: 'Sick', from: '2026-09-29', to: '2026-09-30', days: 2, reason: 'Fever and rest', status: 'Pending', appliedOn: '2026-09-28' },
  { id: 3, empId: 5, type: 'Earned', from: '2026-10-12', to: '2026-10-16', days: 5, reason: 'Vacation', status: 'Pending', appliedOn: '2026-09-22' },
  { id: 4, empId: 1, type: 'Casual', from: '2026-08-14', to: '2026-08-14', days: 1, reason: 'Personal work', status: 'Approved', appliedOn: '2026-08-10' },
  { id: 5, empId: 3, type: 'Sick', from: '2026-09-10', to: '2026-09-11', days: 2, reason: 'Medical appointment', status: 'Approved', appliedOn: '2026-09-09' },
  { id: 6, empId: 7, type: 'Casual', from: '2026-09-21', to: '2026-09-21', days: 1, reason: 'Errand', status: 'Rejected', appliedOn: '2026-09-20' },
];
