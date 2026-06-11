import {
  User,
  Company,
  SubscriptionPlan,
  PlatformSettings,
  Department,
  Position,
  AttendanceLog,
  LeaveRequest,
  LeaveBalance,
  Holiday,
  Announcement,
  ActivityLog,
  EmployeeDocument,
  SyncQueue,
} from "@/types";
import {
  generateMockEmployees,
  generateMockAttendanceLogs,
  generateMockLeaveRequests,
  generateMockHolidays,
  generateMockAnnouncements,
  generateMockActivityLogs,
  generateMockLeaveBalances,
  generateMockDocuments,
  MOCK_DEPARTMENTS,
  MOCK_POSITIONS,
} from "./generators";

export class MockDataStore {
  private static instance: MockDataStore;

  employees: User[] = [];
  companies: Company[] = [];
  subscriptionPlans: SubscriptionPlan[] = [];
  platformSettings: PlatformSettings = {
    companyName: "",
    defaultTimezone: "UTC",
    defaultLanguage: "English",
    supportEmail: "support@example.com",
    enableSelfService: false,
    enableNotifications: false,
    allowExternalLogins: false,
  };
  departments: Department[] = [];
  positions: Position[] = [];
  attendanceLogs: AttendanceLog[] = [];
  leaveRequests: LeaveRequest[] = [];
  leaveBalances: LeaveBalance[] = [];
  holidays: Holiday[] = [];
  announcements: Announcement[] = [];
  activityLogs: Map<string, ActivityLog[]> = new Map();
  documents: EmployeeDocument[] = [];
  devices: Array<any> = [];
  userSettings: Map<string, { twoFA: boolean }> = new Map();
  syncQueue: SyncQueue[] = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): MockDataStore {
    if (!MockDataStore.instance) {
      MockDataStore.instance = new MockDataStore();
    }
    return MockDataStore.instance;
  }

  private initializeMockData(): void {
    this.departments = MOCK_DEPARTMENTS;
    this.positions = MOCK_POSITIONS;
    this.employees = generateMockEmployees(120);
    const employeeIds = this.employees.map((e) => e.id);
    this.attendanceLogs = generateMockAttendanceLogs(employeeIds, 45);
    this.leaveRequests = generateMockLeaveRequests(employeeIds);
    this.leaveBalances = generateMockLeaveBalances(employeeIds);
    this.holidays = generateMockHolidays();
    this.announcements = generateMockAnnouncements();
    this.documents = generateMockDocuments(employeeIds);

    this.subscriptionPlans = [
      {
        id: "plan-basic",
        name: "Basic",
        monthlyPrice: 29,
        annualPrice: 290,
        maxUsers: 50,
        features: [
          "Attendance tracking",
          "Leave management",
          "Basic reporting",
          "Document vault",
        ],
      },
      {
        id: "plan-pro",
        name: "Pro",
        monthlyPrice: 79,
        annualPrice: 790,
        maxUsers: 200,
        features: [
          "Advanced analytics",
          "Multi-location support",
          "Workflow automation",
          "Priority support",
        ],
      },
      {
        id: "plan-enterprise",
        name: "Enterprise",
        monthlyPrice: 159,
        annualPrice: 1590,
        maxUsers: 1000,
        features: [
          "Custom integrations",
          "Dedicated success manager",
          "Single sign-on",
          "Compliance tools",
        ],
      },
    ];

    this.companies = [
      {
        id: "company-1",
        name: "Atlas Workforce",
        industry: "Technology",
        headquarters: "Austin, TX",
        employeeCount: 125,
        subscriptionPlan: "Pro",
        status: "active",
        createdAt: new Date("2022-03-01"),
        updatedAt: new Date("2024-03-01"),
      },
      {
        id: "company-2",
        name: "Summit Logistics",
        industry: "Logistics",
        headquarters: "Chicago, IL",
        employeeCount: 210,
        subscriptionPlan: "Enterprise",
        status: "trial",
        createdAt: new Date("2023-09-10"),
        updatedAt: new Date("2024-05-15"),
      },
    ];

    this.platformSettings = {
      companyName: "Workforce SaaS Demo",
      defaultTimezone: "America/Chicago",
      defaultLanguage: "English",
      supportEmail: "support@workforce.demo",
      enableSelfService: true,
      enableNotifications: true,
      allowExternalLogins: true,
    };

    // sample devices
    this.devices = [
      { id: "dev-1", userId: "emp-demo", name: "Work Laptop", os: "Windows 11", ip: "192.168.1.10", lastSeen: new Date() },
      { id: "dev-2", userId: "emp-demo", name: "Phone", os: "Android", ip: "192.168.1.55", lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      { id: "dev-3", userId: "admin-super", name: "Admin Laptop", os: "macOS", ip: "10.0.0.5", lastSeen: new Date() },
    ];

    // user settings (2FA off by default for demo users)
    for (const e of this.employees) {
      this.userSettings.set(e.id, { twoFA: false });
    }

    // Generate activity logs for demo users
    ["admin-super", "admin-dept", "emp-demo"].forEach((userId) => {
      this.activityLogs.set(userId, generateMockActivityLogs(userId));
    });
  }

  // Employee queries
  getEmployeeById(id: string): User | undefined {
    return this.employees.find((e) => e.id === id);
  }

  getEmployeesByDepartment(departmentId: string): User[] {
    return this.employees.filter((e) => e.departmentId === departmentId);
  }

  getEmployeesByRole(role: string): User[] {
    return this.employees.filter((e) => e.role === role);
  }

  // User management
  getAllUsers(): User[] {
    return [...this.employees];
  }

  createUser(data: Partial<User>): User {
    const user: User = {
      id: `emp-${Date.now()}`,
      email: data.email || `user${Date.now()}@workforce.demo`,
      name: data.name || "New User",
      avatar: data.avatar,
      departmentId: data.departmentId || this.departments[0]?.id || "dept-it",
      positionId: data.positionId || this.positions[0]?.id || "pos-mid",
      role: data.role || "employee",
      workMode: data.workMode || "onsite",
      joinDate: data.joinDate || new Date(),
      phone: data.phone,
      reportingManagerId: data.reportingManagerId,
      status: data.status || "active",
    };
    this.employees.unshift(user);
    this.userSettings.set(user.id, { twoFA: false });
    return user;
  }

  updateUser(userId: string, data: Partial<User>): boolean {
    const idx = this.employees.findIndex((e) => e.id === userId);
    if (idx === -1) return false;
    this.employees[idx] = { ...this.employees[idx], ...data };
    return true;
  }

  deleteUser(userId: string): boolean {
    const before = this.employees.length;
    this.employees = this.employees.filter((e) => e.id !== userId);
    this.userSettings.delete(userId);
    return this.employees.length < before;
  }

  // Announcement queries
  getAnnouncements(): Announcement[] {
    return [...this.announcements];
  }

  createAnnouncement(data: Partial<Announcement>): Announcement {
    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title || "New Announcement",
      content: data.content || "Details coming soon.",
      authorId: data.authorId || "admin-super",
      priority: data.priority || "medium",
      departmentIds: data.departmentIds,
      isPinned: data.isPinned ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
    };
    this.announcements.unshift(announcement);
    return announcement;
  }

  updateAnnouncement(id: string, data: Partial<Announcement>): boolean {
    const idx = this.announcements.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    this.announcements[idx] = {
      ...this.announcements[idx],
      ...data,
      updatedAt: new Date(),
    };
    return true;
  }

  deleteAnnouncement(id: string): boolean {
    const before = this.announcements.length;
    this.announcements = this.announcements.filter((a) => a.id !== id);
    return this.announcements.length < before;
  }

  // Holiday queries
  getHolidays(): Holiday[] {
    return [...this.holidays];
  }

  createHoliday(data: Partial<Holiday>): Holiday {
    const holiday: Holiday = {
      id: `hol-${Date.now()}`,
      name: data.name || "New Holiday",
      date: data.date || new Date(),
      type: data.type || "company",
      departmentIds: data.departmentIds,
      description: data.description,
    };
    this.holidays.unshift(holiday);
    return holiday;
  }

  updateHoliday(id: string, data: Partial<Holiday>): boolean {
    const idx = this.holidays.findIndex((h) => h.id === id);
    if (idx === -1) return false;
    this.holidays[idx] = { ...this.holidays[idx], ...data };
    return true;
  }

  deleteHoliday(id: string): boolean {
    const before = this.holidays.length;
    this.holidays = this.holidays.filter((h) => h.id !== id);
    return this.holidays.length < before;
  }

  // Company & plan management
  getCompanies(): Company[] {
    return [...this.companies];
  }

  createCompany(data: Partial<Company>): Company {
    const company: Company = {
      id: `company-${Date.now()}`,
      name: data.name || "New Company",
      industry: data.industry || "Unknown",
      headquarters: data.headquarters || "Remote",
      employeeCount: data.employeeCount || 0,
      subscriptionPlan: data.subscriptionPlan || this.subscriptionPlans[0]?.name || "Basic",
      status: data.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.companies.unshift(company);
    return company;
  }

  updateCompany(id: string, data: Partial<Company>): boolean {
    const idx = this.companies.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.companies[idx] = { ...this.companies[idx], ...data, updatedAt: new Date() };
    return true;
  }

  deleteCompany(id: string): boolean {
    const before = this.companies.length;
    this.companies = this.companies.filter((c) => c.id !== id);
    return this.companies.length < before;
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    return [...this.subscriptionPlans];
  }

  getPlatformSettings(): PlatformSettings {
    return { ...this.platformSettings };
  }

  updatePlatformSettings(data: Partial<PlatformSettings>): PlatformSettings {
    this.platformSettings = { ...this.platformSettings, ...data };
    return this.platformSettings;
  }

  getSyncQueue(): SyncQueue[] {
    return [...this.syncQueue];
  }

  queueSyncAction(action: SyncQueue): void {
    this.syncQueue.push(action);
  }

  syncPendingActions(): SyncQueue[] {
    const completed = this.syncQueue.map((item) => ({ ...item, synced: true, syncedAt: new Date() }));
    this.syncQueue = completed;
    return completed;
  }

  // Activity logs
  logActivity(log: Omit<ActivityLog, "id" | "timestamp">) {
    const entry: ActivityLog = {
      ...log,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date(),
    };
    const logs = this.activityLogs.get(log.userId) || [];
    logs.unshift(entry);
    this.activityLogs.set(log.userId, logs);
    return entry;
  }

  // Attendance queries
  getTodayAttendance(): AttendanceLog[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.attendanceLogs.filter((log) => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });
  }

  getEmployeeAttendance(employeeId: string, days: number = 30): AttendanceLog[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return this.attendanceLogs.filter(
      (log) =>
        log.employeeId === employeeId && new Date(log.date) >= cutoffDate
    );
  }

  // Leave queries
  getPendingLeaveRequests(): LeaveRequest[] {
    return this.leaveRequests.filter((r) => r.status === "pending");
  }

  getEmployeeLeaveBalance(employeeId: string): LeaveBalance[] {
    return this.leaveBalances.filter((b) => b.employeeId === employeeId);
  }

  // Department queries
  getDepartmentById(id: string): Department | undefined {
    return this.departments.find((d) => d.id === id);
  }

  // Activity logs
  getActivityLogs(userId: string): ActivityLog[] {
    return this.activityLogs.get(userId) || [];
  }

  getAllActivityLogs(): ActivityLog[] {
    return Array.from(this.activityLogs.values()).flat().sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Dashboard metrics
  getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = this.getTodayAttendance();
    const presentToday = todayAttendance.filter(
      (log) => log.status === "present" || log.status === "late"
    ).length;

    const onLeave = todayAttendance.filter(
      (log) => log.status === "on_leave"
    ).length;

    const lateEmployees = todayAttendance.filter(
      (log) => log.status === "late"
    ).length;

    const attendanceRates = this.employees.map((emp) => {
      const empLogs = this.getEmployeeAttendance(emp.id, 30);
      const present = empLogs.filter(
        (log) =>
          log.status === "present" ||
          log.status === "late" ||
          log.status === "half_day"
      ).length;
      return present / Math.max(empLogs.length, 1);
    });

    return {
      totalEmployees: this.employees.length,
      presentToday,
      onLeave,
      lateEmployees,
      activeDepartments: this.departments.length,
      avgAttendanceRate:
        attendanceRates.reduce((a, b) => a + b, 0) / attendanceRates.length,
      pendingLeaveRequests: this.getPendingLeaveRequests().length,
    };
  }

  // Simulate attendance check-in
  simulateCheckIn(employeeId: string): boolean {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let log = this.attendanceLogs.find(
      (l) =>
        l.employeeId === employeeId &&
        new Date(l.date).getTime() === todayStart.getTime()
    );

    if (!log) {
      log = {
        id: `log-${employeeId}-${Date.now()}`,
        employeeId,
        date: todayStart,
        timeIn: new Date(),
        status: "present",
        deviceInfo: "Kiosk Reader",
        locationInfo: "Main Entrance",
      };
      this.attendanceLogs.push(log);
    } else if (!log.timeIn) {
      log.timeIn = new Date();
      log.status = "present";
    }

    return true;
  }

  // Simulate attendance check-out
  simulateCheckOut(employeeId: string): boolean {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const log = this.attendanceLogs.find(
      (l) =>
        l.employeeId === employeeId &&
        new Date(l.date).getTime() === todayStart.getTime()
    );

    if (log && log.timeIn && !log.timeOut) {
      log.timeOut = new Date();
      if (log.timeIn && log.timeOut) {
        log.totalHours =
          (log.timeOut.getTime() - log.timeIn.getTime()) / (1000 * 60 * 60);
      }
      return true;
    }

    return false;
  }

  // Simulate leave request
  submitLeaveRequest(
    employeeId: string,
    leaveType: string,
    startDate: Date,
    endDate: Date,
    reason?: string
  ): LeaveRequest {
    const request: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId,
      leaveType: leaveType as any,
      startDate,
      endDate,
      numberOfDays:
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1,
      reason,
      status: "pending",
      createdAt: new Date(),
    };

    this.leaveRequests.push(request);
    return request;
  }

  // Approve a leave request
  approveLeaveRequest(requestId: string, approverId?: string): boolean {
    const req = this.leaveRequests.find((r) => r.id === requestId);
    if (!req) return false;
    req.status = "approved";
    req.approvedBy = approverId || "system";
    req.updatedAt = new Date();
    // log activity
    const logs = this.activityLogs.get(req.employeeId) || [];
    logs.unshift({
      id: `act-${Date.now()}`,
      userId: approverId || "system",
      action: `Approved leave ${requestId}`,
      entityType: "leave",
      entityId: requestId,
      timestamp: new Date(),
    });
    this.activityLogs.set(req.employeeId, logs);
    return true;
  }

  // Reject a leave request
  rejectLeaveRequest(requestId: string, approverId?: string, reason?: string): boolean {
    const req = this.leaveRequests.find((r) => r.id === requestId);
    if (!req) return false;
    req.status = "rejected";
    req.rejectionReason = reason;
    req.updatedAt = new Date();
    const logs = this.activityLogs.get(req.employeeId) || [];
    logs.unshift({
      id: `act-${Date.now()}`,
      userId: approverId || "system",
      action: `Rejected leave ${requestId}` + (reason ? `: ${reason}` : ""),
      entityType: "leave",
      entityId: requestId,
      timestamp: new Date(),
    });
    this.activityLogs.set(req.employeeId, logs);
    return true;
  }

  // Simulate document upload for an employee
  uploadDocument(employeeId: string, fileName: string, fileType?: string, url?: string) {
    const doc = {
      id: `doc-${employeeId}-${Date.now()}`,
      employeeId,
      documentType: (fileType && fileType.includes("pdf")) ? "contract" : "other",
      fileName,
      uploadedAt: new Date(),
      expiryDate: undefined,
      status: "active",
      url: url || undefined,
    } as any;

    this.documents.unshift(doc);
    return doc;
  }

  // Devices & Settings
  getDevices(userId?: string) {
    if (userId) return this.devices.filter((d) => d.userId === userId);
    return this.devices;
  }

  addDevice(userId: string, name: string, os: string, ip?: string) {
    const d = { id: `dev-${Date.now()}`, userId, name, os, ip: ip || "0.0.0.0", lastSeen: new Date() };
    this.devices.unshift(d);
    return d;
  }

  removeDevice(deviceId: string) {
    const before = this.devices.length;
    this.devices = this.devices.filter((d) => d.id !== deviceId);
    return this.devices.length < before;
  }

  getUserSettings(userId: string) {
    return this.userSettings.get(userId) || { twoFA: false };
  }

  toggleTwoFA(userId: string) {
    const cur = this.userSettings.get(userId) || { twoFA: false };
    cur.twoFA = !cur.twoFA;
    this.userSettings.set(userId, cur);
    return cur.twoFA;
  }

  // Departments CRUD
  createDepartment(name: string, description?: string, headId?: string): Department {
    const d: Department = {
      id: `dept-${Date.now()}`,
      name,
      description: description || "",
      headId,
      budget: 0,
      employeeCount: 0,
      createdAt: new Date(),
    };
    this.departments.push(d);
    return d;
  }

  updateDepartment(id: string, data: Partial<Department>): boolean {
    const idx = this.departments.findIndex((d) => d.id === id);
    if (idx === -1) return false;
    this.departments[idx] = { ...this.departments[idx], ...data };
    return true;
  }

  deleteDepartment(id: string): boolean {
    const before = this.departments.length;
    this.departments = this.departments.filter((d) => d.id !== id);
    return this.departments.length < before;
  }

  // Positions CRUD
  createPosition(title: string, departmentId: string, level: Position["level"], baseSalary?: number, description?: string): Position {
    const p: Position = {
      id: `pos-${Date.now()}`,
      title,
      description: description || "",
      departmentId,
      level,
      baseSalary,
      createdAt: new Date(),
    };
    this.positions.push(p);
    return p;
  }

  updatePosition(id: string, data: Partial<Position>): boolean {
    const idx = this.positions.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.positions[idx] = { ...this.positions[idx], ...data };
    return true;
  }

  deletePosition(id: string): boolean {
    const before = this.positions.length;
    this.positions = this.positions.filter((p) => p.id !== id);
    return this.positions.length < before;
  }
}

export const mockDataStore = MockDataStore.getInstance();
