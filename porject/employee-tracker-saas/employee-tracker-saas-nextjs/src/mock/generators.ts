import {
  User,
  Department,
  Position,
  AttendanceLog,
  LeaveRequest,
  LeaveBalance,
  Holiday,
  Announcement,
  ActivityLog,
  EmployeeDocument,
} from "@/types";

// Realistic names for demo data
const FIRST_NAMES = [
  "Aisha",
  "Amit",
  "Beatrice",
  "Carlos",
  "Diana",
  "Ethan",
  "Fiona",
  "Ganesh",
  "Hannah",
  "Ivan",
  "Julia",
  "Karan",
  "Lucia",
  "Mehul",
  "Nisha",
  "Oscar",
  "Priya",
  "Qasim",
  "Rachel",
  "Samir",
  "Tina",
  "Usman",
  "Vanessa",
  "William",
  "Xenia",
  "Yara",
  "Zainab",
  "Aaron",
  "Bella",
  "Chen",
];

const LAST_NAMES = [
  "Ahmed",
  "Brown",
  "Chen",
  "Davis",
  "Espinosa",
  "Fernandez",
  "Garcia",
  "Hassan",
  "Ibrahim",
  "Jackson",
  "Khan",
  "Lopez",
  "Martinez",
  "Nelson",
  "O'Neill",
  "Patel",
  "Quinn",
  "Rodriguez",
  "Smith",
  "Thompson",
  "Umar",
  "Valdez",
  "Williams",
  "Xavier",
  "Young",
  "Zimmerman",
];

const DEPARTMENTS: Department[] = [
  {
    id: "dept-hr",
    name: "Human Resources",
    description: "HR and recruitment",
    employeeCount: 10,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "dept-it",
    name: "Information Technology",
    description: "Software development and infrastructure",
    employeeCount: 30,
    createdAt: new Date("2023-01-10"),
  },
  {
    id: "dept-finance",
    name: "Finance & Accounting",
    description: "Financial management and payroll",
    employeeCount: 14,
    createdAt: new Date("2023-01-12"),
  },
  {
    id: "dept-ops",
    name: "Operations",
    description: "Operations and logistics",
    employeeCount: 18,
    createdAt: new Date("2023-01-11"),
  },
  {
    id: "dept-sales",
    name: "Sales & Business Development",
    description: "Sales and customer relations",
    employeeCount: 18,
    createdAt: new Date("2023-01-13"),
  },
  {
    id: "dept-marketing",
    name: "Marketing",
    description: "Marketing and brand management",
    employeeCount: 12,
    createdAt: new Date("2023-01-14"),
  },
  {
    id: "dept-customer",
    name: "Customer Success",
    description: "Client success and account management",
    employeeCount: 11,
    createdAt: new Date("2023-01-16"),
  },
  {
    id: "dept-qa",
    name: "Quality Assurance",
    description: "Testing and quality monitoring",
    employeeCount: 9,
    createdAt: new Date("2023-01-17"),
  },
  {
    id: "dept-support",
    name: "Support",
    description: "Technical support and customer care",
    employeeCount: 13,
    createdAt: new Date("2023-01-18"),
  },
  {
    id: "dept-product",
    name: "Product",
    description: "Product strategy and roadmap",
    employeeCount: 8,
    createdAt: new Date("2023-01-19"),
  },
];

const POSITIONS: Position[] = [
  {
    id: "pos-exec",
    title: "Executive Director",
    description: "Executive leadership role",
    departmentId: "dept-hr",
    level: "director",
    baseSalary: 150000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-manager",
    title: "Department Manager",
    description: "Department management",
    departmentId: "dept-it",
    level: "manager",
    baseSalary: 95000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-lead",
    title: "Team Lead",
    description: "Team leadership",
    departmentId: "dept-it",
    level: "lead",
    baseSalary: 75000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-senior",
    title: "Senior Developer",
    description: "Senior technical role",
    departmentId: "dept-it",
    level: "senior",
    baseSalary: 85000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-mid",
    title: "Software Developer",
    description: "Mid-level developer",
    departmentId: "dept-it",
    level: "mid",
    baseSalary: 65000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-entry",
    title: "Junior Developer",
    description: "Entry-level developer",
    departmentId: "dept-it",
    level: "entry",
    baseSalary: 45000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-analyst",
    title: "Business Analyst",
    description: "Business analysis role",
    departmentId: "dept-ops",
    level: "mid",
    baseSalary: 60000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-hr-specialist",
    title: "HR Specialist",
    description: "HR department specialist",
    departmentId: "dept-hr",
    level: "mid",
    baseSalary: 55000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-accountant",
    title: "Accountant",
    description: "Finance and accounting",
    departmentId: "dept-finance",
    level: "mid",
    baseSalary: 62000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-marketer",
    title: "Marketing Specialist",
    description: "Campaign and project execution",
    departmentId: "dept-marketing",
    level: "mid",
    baseSalary: 58000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-sales",
    title: "Sales Executive",
    description: "Client acquisition and pipeline management",
    departmentId: "dept-sales",
    level: "mid",
    baseSalary: 62000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-support",
    title: "Support Specialist",
    description: "Customer support and ticket resolution",
    departmentId: "dept-support",
    level: "entry",
    baseSalary: 48000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-qa",
    title: "QA Engineer",
    description: "Quality testing and automation",
    departmentId: "dept-qa",
    level: "mid",
    baseSalary: 65000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-product",
    title: "Product Manager",
    description: "Product strategy and roadmaps",
    departmentId: "dept-product",
    level: "manager",
    baseSalary: 90000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-creative",
    title: "Creative Director",
    description: "Creative direction and content oversight",
    departmentId: "dept-marketing",
    level: "lead",
    baseSalary: 85000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-operation-lead",
    title: "Operations Lead",
    description: "Operations coordination and execution",
    departmentId: "dept-ops",
    level: "lead",
    baseSalary: 78000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-customer-success",
    title: "Customer Success Manager",
    description: "Client retention and relationship management",
    departmentId: "dept-customer",
    level: "senior",
    baseSalary: 72000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-hr-manager",
    title: "HR Manager",
    description: "HR team leadership and strategy",
    departmentId: "dept-hr",
    level: "manager",
    baseSalary: 90000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-finance-analyst",
    title: "Financial Analyst",
    description: "Financial planning and analysis",
    departmentId: "dept-finance",
    level: "senior",
    baseSalary: 82000,
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "pos-ux-designer",
    title: "UX Designer",
    description: "Experience design and usability research",
    departmentId: "dept-product",
    level: "mid",
    baseSalary: 67000,
    createdAt: new Date("2023-01-01"),
  },
];

function generateRandomName(): string {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

function getRandomDepartment(): Department {
  return DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
}

function getRandomPosition(): Position {
  return POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

export function generateMockEmployees(count: number = 100): User[] {
  const employees: User[] = [];

  // Add demo admin users
  const demoUsers: User[] = [
    {
      id: "admin-super",
      email: "admin@workforce.demo",
      name: "Super Admin",
      avatar: "👨‍💼",
      departmentId: "dept-hr",
      positionId: "pos-exec",
      role: "super_admin",
      workMode: "onsite",
      joinDate: new Date("2022-01-01"),
      phone: "+1 (555) 123-4567",
      status: "active",
    },
    {
      id: "admin-dept",
      email: "manager@workface.demo",
      name: "Department Manager",
      avatar: "👩‍💼",
      departmentId: "dept-it",
      positionId: "pos-manager",
      role: "department_admin",
      workMode: "hybrid",
      joinDate: new Date("2022-06-15"),
      phone: "+1 (555) 234-5678",
      status: "active",
    },
    {
      id: "emp-demo",
      email: "employee@workface.demo",
      name: "Demo Employee",
      avatar: "👨‍💻",
      departmentId: "dept-it",
      positionId: "pos-mid",
      role: "employee",
      workMode: "hybrid",
      joinDate: new Date("2023-03-20"),
      phone: "+1 (555) 345-6789",
      reportingManagerId: "admin-dept",
      status: "active",
    },
  ];

  employees.push(...demoUsers);

  // Generate additional employees
  for (let i = 0; i < count - demoUsers.length; i++) {
    const dept = getRandomDepartment();
    const pos = getRandomPosition();
    const workModes: Array<"onsite" | "wfh" | "hybrid"> = [
      "onsite",
      "wfh",
      "hybrid",
    ];

    employees.push({
      id: `emp-${i + 4}`,
      email: `employee${i + 4}@workface.demo`,
      name: generateRandomName(),
      avatar: ["👨‍💼", "👩‍💼", "👨‍💻", "👩‍💻", "👨‍⚕️", "👩‍⚕️"][
        Math.floor(Math.random() * 6)
      ],
      departmentId: dept.id,
      positionId: pos.id,
      role: "employee",
      workMode: workModes[Math.floor(Math.random() * workModes.length)],
      joinDate: getRandomDate(
        new Date("2022-01-01"),
        new Date("2024-01-01")
      ),
      phone: `+1 (555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      reportingManagerId: i % 3 === 0 ? "admin-dept" : undefined,
      status: Math.random() > 0.85 ? "on_leave" : "active",
    });
  }

  return employees;
}

export function generateMockAttendanceLogs(
  employeeIds: string[],
  days: number = 30
): AttendanceLog[] {
  const logs: AttendanceLog[] = [];
  const today = new Date();

  for (let d = 0; d < days; d++) {
    const logDate = new Date(today);
    logDate.setDate(logDate.getDate() - d);

    // Skip weekends
    if (logDate.getDay() === 0 || logDate.getDay() === 6) continue;

    for (const empId of employeeIds) {
      const randomStatus = Math.random();
      let status: "present" | "absent" | "late" | "half_day" | "on_leave" =
        "present";
      let timeIn: Date | undefined;
      let timeOut: Date | undefined;

      if (randomStatus < 0.05) {
        status = "absent";
      } else if (randomStatus < 0.12) {
        status = "late";
      } else if (randomStatus < 0.15) {
        status = "half_day";
      } else if (randomStatus < 0.08) {
        status = "on_leave";
      } else {
        // Present - generate times
        timeIn = new Date(logDate);
        const inHour = 8 + Math.floor(Math.random() * 2);
        const inMin = Math.floor(Math.random() * 60);
        timeIn.setHours(inHour, inMin, 0);

        timeOut = new Date(timeIn);
        const outHour = 17 + Math.floor(Math.random() * 2);
        timeOut.setHours(outHour, Math.floor(Math.random() * 60), 0);
      }

      logs.push({
        id: `log-${empId}-${d}`,
        employeeId: empId,
        date: logDate,
        timeIn,
        timeOut,
        status,
        deviceInfo: "Badge Reader",
        locationInfo: "Main Gate",
      });
    }
  }

  return logs;
}

export function generateMockLeaveRequests(
  employeeIds: string[]
): LeaveRequest[] {
  const requests: LeaveRequest[] = [];
  const leaveTypes: Array<"sick" | "vacation" | "emergency" | "maternity" | "personal"> = [
    "sick",
    "vacation",
    "emergency",
    "personal",
  ];

  for (let i = 0; i < 50; i++) {
    const empId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
    const leaveType = leaveTypes[Math.floor(Math.random() * leaveTypes.length)];
    const startDate = getRandomDate(
      new Date("2024-01-01"),
      new Date("2024-06-30")
    );
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

    const statuses: Array<"pending" | "approved" | "rejected"> = [
      "pending",
      "approved",
      "rejected",
    ];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    requests.push({
      id: `leave-${i}`,
      employeeId: empId,
      leaveType,
      startDate,
      endDate,
      numberOfDays:
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1,
      reason: `Taking ${leaveType} leave`,
      status,
      approvedBy: status !== "pending" ? "admin-dept" : undefined,
      approvedAt: status !== "pending" ? new Date() : undefined,
      createdAt: new Date(),
    });
  }

  return requests;
}

export function generateMockHolidays(): Holiday[] {
  return [
    { id: "hol-1", name: "New Year", date: new Date("2024-01-01"), type: "national", description: "National holiday" },
    { id: "hol-2", name: "Lunar New Year", date: new Date("2024-02-10"), type: "national", description: "Observed across the region" },
    { id: "hol-3", name: "Foundation Day", date: new Date("2024-03-15"), type: "company", description: "Company anniversary" },
    { id: "hol-4", name: "Spring Break", date: new Date("2024-04-12"), type: "company", description: "Company-wide day off" },
    { id: "hol-5", name: "Labor Day", date: new Date("2024-05-01"), type: "national", description: "Public holiday" },
    { id: "hol-6", name: "Medical Leave Day", date: new Date("2024-05-20"), type: "department_specific", departmentIds: ["dept-hr", "dept-support"], description: "Wellness awareness" },
    { id: "hol-7", name: "Independence Day", date: new Date("2024-07-04"), type: "national", description: "National holiday" },
    { id: "hol-8", name: "Summer Shutdown", date: new Date("2024-08-15"), type: "company", description: "Mid-year company closure" },
    { id: "hol-9", name: "Customer Appreciation Day", date: new Date("2024-09-10"), type: "department_specific", departmentIds: ["dept-sales", "dept-customer"], description: "Sales and success teams offsite" },
    { id: "hol-10", name: "Halloween", date: new Date("2024-10-31"), type: "company", description: "Fun company event" },
    { id: "hol-11", name: "Diwali", date: new Date("2024-11-01"), type: "national", description: "Festival holiday" },
    { id: "hol-12", name: "Veterans Day", date: new Date("2024-11-11"), type: "national", description: "Public holiday" },
    { id: "hol-13", name: "Thanksgiving", date: new Date("2024-11-28"), type: "national", description: "Company holiday" },
    { id: "hol-14", name: "Black Friday", date: new Date("2024-11-29"), type: "company", description: "Reduced staff schedule" },
    { id: "hol-15", name: "Winter Preparation Day", date: new Date("2024-12-10"), type: "company", description: "Company planning day" },
    { id: "hol-16", name: "Christmas Eve", date: new Date("2024-12-24"), type: "company", description: "Early closure" },
    { id: "hol-17", name: "Christmas", date: new Date("2024-12-25"), type: "national", description: "Public holiday" },
    { id: "hol-18", name: "Year End Inventory", date: new Date("2024-12-30"), type: "company", description: "Operations and counts" },
    { id: "hol-19", name: "New Year’s Eve", date: new Date("2024-12-31"), type: "company", description: "Holiday closure" },
    { id: "hol-20", name: "Wellness Day", date: new Date("2024-06-20"), type: "department_specific", departmentIds: ["dept-hr", "dept-qa"], description: "Health and wellbeing" },
  ];
}

export function generateMockAnnouncements(): Announcement[] {
  const announcementTemplates: Array<
    Omit<Announcement, "id" | "createdAt" | "updatedAt" | "readBy">
  > = [
    {
      title: "Welcome to the New Workforce Management System",
      content:
        "We are excited to introduce our new unified workforce management platform. This system will help us streamline attendance tracking, leave management, and scheduling across all departments.",
      authorId: "admin-super",
      priority: "high",
      isPinned: true,
    },
    {
      title: "New Office Policies Effective Immediately",
      content:
        "Please review the updated office policies document attached. Key changes include updated work-from-home guidelines and new parking arrangements.",
      authorId: "admin-dept",
      priority: "medium",
      isPinned: true,
    },
    {
      title: "Upcoming Holiday Schedule",
      content:
        "Please note the company will be closed for the upcoming holiday period. All leave requests should be submitted before the deadline.",
      authorId: "admin-super",
      priority: "medium",
      isPinned: false,
    },
    {
      title: "IT System Maintenance Alert",
      content:
        "Scheduled maintenance on Friday evening from 6 PM to 10 PM. Some services may be unavailable during this time.",
      authorId: "admin-dept",
      priority: "high",
      isPinned: false,
      departmentIds: ["dept-it"],
    },
    {
      title: "Q2 Performance Review Launch",
      content:
        "The performance review cycle is open for all employees. Please complete your self-assessments by the end of the month.",
      authorId: "admin-super",
      priority: "medium",
      isPinned: false,
    },
    {
      title: "Security Awareness Training",
      content:
        "All teams are required to complete the mandatory security awareness course by next Friday.",
      authorId: "admin-dept",
      priority: "high",
      isPinned: false,
    },
    {
      title: "Benefit Enrollment Reminder",
      content:
        "Open enrollment is closing soon. Review your benefit options and submit your selections.",
      authorId: "admin-super",
      priority: "medium",
      isPinned: false,
    },
    {
      title: "Company Town Hall",
      content:
        "Join the all-hands town hall on Tuesday to hear updates from leadership and ask questions.",
      authorId: "admin-dept",
      priority: "high",
      isPinned: true,
    },
    {
      title: "New Resource Library",
      content:
        "The employee resources library has been updated with new onboarding guides and policy documents.",
      authorId: "admin-super",
      priority: "low",
      isPinned: false,
    },
    {
      title: "Performance Bonus Announcement",
      content:
        "Managers will be sharing bonus details with eligible employees by the end of the quarter.",
      authorId: "admin-super",
      priority: "medium",
      isPinned: false,
    },
  ];

  const announcements: Announcement[] = announcementTemplates.map((template, index) => ({
    id: `ann-${index + 1}`,
    ...template,
    createdAt: new Date(Date.now() - (index + 1) * 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - (index + 1) * 4 * 60 * 60 * 1000),
    readBy: [],
  }));

  const extras: Array<
    Omit<Announcement, "id" | "createdAt" | "updatedAt" | "readBy" | "isPinned">
  > = [
    {
      title: "Data Privacy Awareness",
      content:
        "New guidelines for secure data handling are now available in the compliance portal.",
      authorId: "admin-dept",
      priority: "medium",
    },
    {
      title: "Remote Work Toolkit",
      content:
        "Check out the remote work toolkit for productivity tips, best practices, and collaboration tools.",
      authorId: "admin-super",
      priority: "low",
    },
    {
      title: "Office Renovation Update",
      content:
        "Renovations will begin next week. Departments will receive temporary workspace updates.",
      authorId: "admin-dept",
      priority: "medium",
    },
    {
      title: "Volunteer Day",
      content:
        "Join our volunteer day event to support local communities and earn a wellness credit.",
      authorId: "admin-super",
      priority: "low",
    },
    {
      title: "New Device Security Policy",
      content:
        "Please review the updated policy for secure access from personal devices.",
      authorId: "admin-dept",
      priority: "high",
    },
    {
      title: "Sales Kickoff Event",
      content:
        "Sales teams are invited to the kickoff event to align on quarterly goals.",
      authorId: "admin-super",
      priority: "medium",
      departmentIds: ["dept-sales"],
    },
    {
      title: "Customer Service Hours",
      content:
        "Support will now maintain extended business hours for holiday coverage.",
      authorId: "admin-dept",
      priority: "medium",
      departmentIds: ["dept-support"],
    },
    {
      title: "Wellness Month Preview",
      content:
        "A series of wellness sessions will launch next month for the entire company.",
      authorId: "admin-super",
      priority: "low",
    },
    {
      title: "Contract Renewal Reminder",
      content:
        "The contract renewal window is approaching. Review vendor agreements with legal.",
      authorId: "admin-dept",
      priority: "high",
    },
    {
      title: "Holiday Schedule Changes",
      content:
        "Several teams will follow adjusted schedules over the upcoming holiday period.",
      authorId: "admin-super",
      priority: "medium",
    },
  ];

  extras.forEach((extra, index) => {
    announcements.push({
      id: `ann-${announcementTemplates.length + index + 1}`,
      ...extra,
      isPinned: extra.priority === "high",
      createdAt: new Date(Date.now() - (announcementTemplates.length + index + 2) * 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - (announcementTemplates.length + index + 2) * 6 * 60 * 60 * 1000),
      readBy: [],
    });
  });

  return announcements;
}

export function generateMockActivityLogs(
  userId: string,
  count: number = 70
): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const actions = [
    "Checked in",
    "Checked out",
    "Applied for leave",
    "Viewed schedule",
    "Updated profile",
    "Downloaded report",
    "Viewed announcement",
    "Submitted feedback",
    "Updated settings",
    "Approved leave request",
    "Generated payroll report",
  ];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    logs.push({
      id: `log-${i}`,
      userId,
      action: actions[Math.floor(Math.random() * actions.length)],
      entityType: ["attendance", "leave", "schedule"][
        Math.floor(Math.random() * 3)
      ] as any,
      entityId: `entity-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: date,
      deviceInfo: "Web Browser",
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    });
  }

  return logs.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

export function generateMockLeaveBalances(employeeIds: string[]): LeaveBalance[] {
  const balances: LeaveBalance[] = [];
  const leaveTypes: Array<"sick" | "vacation" | "emergency" | "maternity" | "personal"> = [
    "sick",
    "vacation",
    "emergency",
    "personal",
  ];

  for (const empId of employeeIds) {
    for (const leaveType of leaveTypes) {
      const used = Math.floor(Math.random() * 5);
      balances.push({
        id: `balance-${empId}-${leaveType}`,
        employeeId: empId,
        leaveType,
        totalDays: leaveType === "vacation" ? 20 : 10,
        usedDays: used,
        remainingDays:
          (leaveType === "vacation" ? 20 : 10) - used,
        year: 2024,
      });
    }
  }

  return balances;
}

export function generateMockDocuments(employeeIds: string[]): EmployeeDocument[] {
  const documents: EmployeeDocument[] = [];
  const documentTypes: Array<"contract" | "id_proof" | "certificate" | "license" | "insurance" | "other"> = [
    "contract",
    "id_proof",
    "certificate",
    "license",
    "insurance",
  ];

  for (const empId of employeeIds.slice(0, Math.floor(employeeIds.length / 2))) {
    for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
      const docType =
        documentTypes[Math.floor(Math.random() * documentTypes.length)];
      documents.push({
        id: `doc-${empId}-${i}`,
        employeeId: empId,
        documentType: docType,
        fileName: `${docType}_${new Date().getFullYear()}.pdf`,
        uploadedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
        status:
          Math.random() > 0.8 ? "expired" : "active",
      });
    }
  }

  return documents;
}

export const MOCK_DEPARTMENTS = DEPARTMENTS;
export const MOCK_POSITIONS = POSITIONS;
