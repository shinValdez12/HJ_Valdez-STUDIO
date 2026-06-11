# Features & API Reference

Complete documentation of features and simulated API endpoints. This file summarizes functionality available in the demo and the shape of mock data returned by the `MockDataStore`.

**Last updated:** June 2026

## 📋 Feature Modules

### 1. Authentication & Sessions

**Endpoints (Simulated)**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/register (not implemented in demo)
GET /api/auth/session
```

**Features**
- Session-based authentication
- Demo credentials pre-configured
- LocalStorage persistence
- Auto-redirect to appropriate dashboard
- Logout with session clear

**Demo Accounts**
```
Super Admin:      admin@workforce.demo / demo123
Manager:          manager@workface.demo / demo123
Employee:         employee@workface.demo / demo123
```

### 2. Attendance Management

**Endpoints (Simulated)**
```
POST /api/attendance/check-in
POST /api/attendance/check-out
GET /api/attendance/today
GET /api/attendance/employee/:id?days=30
GET /api/attendance/report?startDate=&endDate=&departmentId=
```

**Features**
- Check-in/check-out tracking
- Time tracking with timestamps
- Status badges (present, late, absent, half-day, on-leave)
- Desktop interface for admins
- Tablet kiosk mode for office
- Real-time dashboard updates
- 30-day attendance history

**Data Structure**
```typescript
{
  id: "log-123",
  employeeId: "emp-1",
  date: "2024-05-15",
  timeIn: "09:15:00",
  timeOut: "17:45:00",
  totalHours: 8.5,
  status: "present",
  deviceInfo: "Badge Reader",
  locationInfo: "Main Gate"
}
```

### 3. Leave Management

**Endpoints (Simulated)**
```
GET /api/leave/balance/:employeeId
GET /api/leave/history/:employeeId?days=90
POST /api/leave/request
PUT /api/leave/request/:id/approve
PUT /api/leave/request/:id/reject
GET /api/leave/pending-requests
```

**Features**
- Multiple leave types (sick, vacation, emergency, maternity, personal)
- Leave balance tracking per type
- Leave request form with date picker
- Approval workflow (simulated)
- Leave calendar integration
- History and tracking

**Leave Types**
```
- Sick Leave: 10 days/year
- Vacation Leave: 20 days/year
- Emergency Leave: 5 days/year
- Maternity Leave: 90 days
- Personal Leave: 3 days/year
```

**Data Structure**
```typescript
{
  id: "leave-123",
  employeeId: "emp-1",
  leaveType: "vacation",
  startDate: "2024-06-01",
  endDate: "2024-06-05",
  numberOfDays: 5,
  reason: "Family vacation",
  status: "approved",
  approvedBy: "admin-dept",
  approvedAt: "2024-05-20"
}
```

### 4. Employee Management

**Endpoints (Simulated)**
```
GET /api/employees
GET /api/employees/:id
GET /api/employees/search?q=name
GET /api/employees?departmentId=dept-1
GET /api/employees?workMode=hybrid
POST /api/employees (admin only)
PUT /api/employees/:id (admin only)
DELETE /api/employees/:id (admin only)
```

**Features**
- Employee directory
- Search and filtering
- Department assignment
- Position tracking
- Work mode specification (onsite/WFH/hybrid)
- Contact information
- Reporting manager assignment
- Status tracking (active/on-leave/inactive)

**Data Structure**
```typescript
{
  id: "emp-1",
  email: "john@company.com",
  name: "John Doe",
  departmentId: "dept-it",
  positionId: "pos-senior",
  role: "employee",
  workMode: "hybrid",
  joinDate: "2022-05-20",
  phone: "+1-555-1234",
  reportingManagerId: "emp-manager",
  status: "active"
}
```

### 5. Departments & Positions

**Endpoints (Simulated)**
```
GET /api/departments
GET /api/departments/:id
GET /api/departments/:id/employees
POST /api/departments (admin only)
PUT /api/departments/:id (admin only)

GET /api/positions
GET /api/positions/:id
GET /api/positions?departmentId=dept-1
POST /api/positions (admin only)
PUT /api/positions/:id (admin only)
```

**Departments (Pre-configured)**
- HR (Human Resources)
- IT (Information Technology)
- Finance & Accounting
- Operations
- Sales & Business Development
- Marketing

**Position Levels**
- Entry: Junior positions
- Mid: Mid-level professionals
- Senior: Senior professionals
- Lead: Team leads
- Manager: Department managers
- Director: Executives

### 6. Announcements & Communications

**Endpoints (Simulated)**
```
GET /api/announcements
GET /api/announcements?priority=urgent
POST /api/announcements (admin only)
PUT /api/announcements/:id/read
PUT /api/announcements/:id (admin only)
DELETE /api/announcements/:id (admin only)
```

**Features**
- Company-wide announcements
- Priority levels (low, medium, high, urgent)
- Department-specific targeting
- Pinned announcements
- Read/unread tracking
- Rich content support

**Data Structure**
```typescript
{
  id: "ann-1",
  title: "New Office Policy",
  content: "Effective immediately...",
  authorId: "admin-super",
  priority: "high",
  departmentIds: ["dept-it", "dept-ops"],
  isPinned: true,
  createdAt: "2024-05-15",
  readBy: ["emp-1", "emp-2"]
}
```

### 7. Reports & Analytics

**Available Reports**

#### Attendance Report
```
GET /api/reports/attendance?startDate=&endDate=&departmentId=&format=csv
```
- Employee-wise attendance
- Department performance
- Late trends
- Absent patterns
- Export as CSV (simulated)

#### Leave Report
```
GET /api/reports/leave?year=2024&departmentId=
```
- Approved leaves
- Leave type breakdown
- Employee list
- Date ranges
- Export format

#### Payroll Report
```
GET /api/reports/payroll?month=5&year=2024&departmentId=
```
- Based on attendance
- Salary calculations
- Overtime included
- Deductions applied
- Export as PDF (simulated)

#### Department Report
```
GET /api/reports/department/:id
```
- Performance metrics
- Attendance rates
- Leave trends
- Team size
- Headcount changes

### 8. Activity & Audit Logs

**Endpoints (Simulated)**
```
GET /api/activity-logs/:userId?days=30
GET /api/activity-logs/search?action=login&date=2024-05-15
```

**Tracked Actions**
- User login/logout
- Check-in/check-out
- Leave request submission/approval
- Profile updates
- Document uploads
- Announcement views
- Report generation
- Permission changes

**Data Structure**
```typescript
{
  id: "log-123",
  userId: "emp-1",
  action: "Checked in",
  entityType: "attendance",
  entityId: "log-att-456",
  timestamp: "2024-05-15T09:15:00Z",
  ipAddress: "192.168.1.1",
  deviceInfo: "Chrome on Windows"
}
```

### 9. Holiday & Calendar Management

**Endpoints (Simulated)**
```
GET /api/holidays?year=2024
GET /api/holidays/:id
POST /api/holidays (admin only)
PUT /api/holidays/:id (admin only)
DELETE /api/holidays/:id (admin only)

GET /api/calendar/:employeeId?month=5&year=2024
```

**Holiday Types**
- National Holidays
- Company Holidays
- Department-Specific Holidays

**Calendar Features**
- Employee schedule display
- Leave overlay
- Holiday markers
- Shift display
- WFH indicators

### 10. Documents Vault

**Endpoints (Simulated)**
```
GET /api/documents/:employeeId
POST /api/documents/:employeeId/upload
GET /api/documents/:id/download
DELETE /api/documents/:id

GET /api/documents/expiring?days=30
```

**Document Types**
- Employment Contract
- ID Proof
- Certificates
- Licenses
- Insurance
- Other Documents

**Features**
- Upload simulation
- Expiration tracking
- Renewal reminders
- Access control (employee own docs)

### 11. Dashboard Metrics

**Endpoints (Simulated)**
```
GET /api/dashboard/metrics (admin dashboard)
GET /api/dashboard/personal (employee dashboard)
GET /api/dashboard/department/:id (manager dashboard)
```

**Admin Dashboard Metrics**
```typescript
{
  totalEmployees: 100,
  presentToday: 85,
  onLeave: 8,
  lateEmployees: 3,
  activeDepartments: 6,
  avgAttendanceRate: 92.5,
  pendingLeaveRequests: 5
}
```

**Employee Dashboard Metrics**
```typescript
{
  todayStatus: "checked-in",
  attendanceRate: 95.2,
  leaveBalance: {
    vacation: 12,
    sick: 8,
    emergency: 2
  },
  workMode: "hybrid"
}
```

## 🔐 Security Implementation (Simulated)

### Authentication
- Session storage in context + localStorage
- Session expiration check
- Automatic redirect to login if expired
- Demo-only credentials (hardcoded)

### Authorization
- Role-based access (super_admin, department_admin, employee)
- Protected routes
- Component-level visibility
- Feature flags per role

### Audit Trail
- All actions logged to activity logs
- Timestamp on every record
- Device and IP tracking (simulated)
- User attribution
- Change tracking

## 🔄 Data Flow

### Check-In Process
```
1. Employee clicks "Check In"
   ↓
2. System records current time
   ↓
3. Status updated to "present" or "late"
   ↓
4. Attendance log created
   ↓
5. Dashboard metrics updated
   ↓
6. Activity log recorded
```

### Leave Request Process
```
1. Employee clicks "Request Leave"
   ↓
2. Opens leave request modal
   ↓
3. Employee selects leave type, dates, reason
   ↓
4. Submits request
   ↓
5. Status: "pending"
   ↓
6. Admin sees in queue
   ↓
7. Admin approves/rejects
   ↓
8. Leave balance updated
   ↓
9. Calendar updated
   ↓
10. Activity log recorded
```

## 📊 Export Formats (Simulated)

### CSV Export
```csv
Employee Name,Department,Date,Status,Check In,Check Out,Hours
John Doe,IT,2024-05-15,Present,09:15,17:45,8.5
Jane Smith,HR,2024-05-15,Present,09:00,17:00,8.0
```

### PDF Export
```
ATTENDANCE REPORT
Date Range: May 1-31, 2024
Department: IT

Total Employees: 15
Present Days: 420
Absent Days: 12
Late Days: 8
Average Attendance: 94.2%
```

## 🔌 Offline Support (Simulated)

**Offline Capabilities**
- Queue attendance actions locally
- Display "offline" indicator
- Sync when reconnected
- Show pending sync count
- Handle sync failures

**Queue Example**
```typescript
{
  id: "queue-1",
  action: "create",
  entityType: "attendance",
  payload: { timeIn: "2024-05-15T09:15:00Z" },
  timestamp: "2024-05-15T09:15:00Z",
  synced: false
}
```

## 🚀 Performance Metrics

### Bundle Size
- Main: ~150KB (gzipped)
- Components: ~80KB
- Styles: ~30KB
- Total: ~260KB

### Load Times
- Initial page load: <2s
- Dashboard load: <1s
- Search results: <500ms

### Mock Data Generation
- 100 employees: <100ms
- 30 days attendance: <150ms
- All mock data: <500ms total

---

**Last Updated**: May 2024
**Documentation Version**: 1.0
