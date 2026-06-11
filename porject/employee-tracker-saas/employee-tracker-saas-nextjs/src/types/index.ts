// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  departmentId: string;
  positionId: string;
  role: "super_admin" | "department_admin" | "employee";
  workMode: "onsite" | "wfh" | "hybrid";
  joinDate: Date;
  phone?: string;
  reportingManagerId?: string;
  status: "active" | "on_leave" | "inactive";
}

// Department & Position Types
export interface Department {
  id: string;
  name: string;
  description: string;
  headId?: string;
  budget?: number;
  employeeCount: number;
  createdAt: Date;
}

export interface Position {
  id: string;
  title: string;
  description: string;
  departmentId: string;
  baseSalary?: number;
  level: "entry" | "mid" | "senior" | "lead" | "manager" | "director";
  createdAt: Date;
}

// Attendance & Schedule Types
export interface AttendanceLog {
  id: string;
  employeeId: string;
  date: Date;
  timeIn?: Date;
  timeOut?: Date;
  breakStartTime?: Date;
  breakEndTime?: Date;
  totalHours?: number;
  status: "present" | "absent" | "late" | "half_day" | "on_leave";
  deviceInfo?: string;
  locationInfo?: string;
  notes?: string;
}

export interface Schedule {
  id: string;
  employeeId: string;
  date: Date;
  startTime: string;
  endTime: string;
  shift: "morning" | "afternoon" | "evening" | "night";
  workMode: "onsite" | "wfh" | "hybrid";
  recurrence?: "daily" | "weekly" | "monthly";
  status: "scheduled" | "completed" | "cancelled";
}

// Leave & Time Off Types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: "sick" | "vacation" | "emergency" | "maternity" | "personal";
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  rejectionReason?: string;
}

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveType: "sick" | "vacation" | "emergency" | "maternity" | "personal";
  totalDays: number;
  usedDays: number;
  remainingDays: number;
  year: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
  type: "national" | "company" | "department_specific";
  departmentIds?: string[];
  description?: string;
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  priority: "low" | "medium" | "high" | "urgent";
  departmentIds?: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  readBy: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  employeeCount: number;
  subscriptionPlan: string;
  status: "active" | "suspended" | "trial";
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  maxUsers: number;
  features: string[];
}

export interface PlatformSettings {
  companyName: string;
  defaultTimezone: string;
  defaultLanguage: string;
  supportEmail: string;
  enableSelfService: boolean;
  enableNotifications: boolean;
  allowExternalLogins: boolean;
}

// Document Types
export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentType:
    | "contract"
    | "id_proof"
    | "certificate"
    | "license"
    | "insurance"
    | "other";
  fileName: string;
  uploadedAt: Date;
  expiryDate?: Date;
  status: "active" | "expired" | "pending_renewal";
  url?: string;
}

// Activity & Logs Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType:
    | "attendance"
    | "leave"
    | "user"
    | "announcement"
    | "schedule"
    | "document";
  entityId: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  deviceInfo?: string;
  timestamp: Date;
}

// Dashboard Types
export interface DashboardMetrics {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  lateEmployees: number;
  activeDepartments: number;
  avgAttendanceRate: number;
  pendingLeaveRequests: number;
}

// Payroll Types (Simulated)
export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  daysPresent: number;
  daysAbsent: number;
  overtimeHours: number;
  status: "draft" | "pending_approval" | "approved" | "processed";
}

// Offline Sync Types
export interface SyncQueue {
  id: string;
  action: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  synced: boolean;
  syncedAt?: Date;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSyncedAt: Date;
  pendingChanges: number;
  failedSyncs: SyncQueue[];
}

// Session Types
export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
  lastActivityAt: Date;
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
