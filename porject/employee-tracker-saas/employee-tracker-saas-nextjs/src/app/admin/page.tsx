"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  UserCheck,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import { DashboardLayout, MetricCard } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Card } from "@/components/ui/card";

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<ChartData[]>([]);
  const [departmentData, setDepartmentData] = useState<ChartData[]>([]);

  useEffect(() => {
    const dashboardMetrics = mockDataStore.getDashboardMetrics();
    setMetrics(dashboardMetrics);

    // Generate attendance trend data
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const attData = days.map((day) => ({
      name: day,
      value: Math.floor(Math.random() * 40) + 60,
    }));
    setAttendanceData(attData);

    // Generate department data
    const deptData = mockDataStore.departments.map((dept: any) => ({
      name: dept.name,
      value: dept.employeeCount,
      fill: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"][
        Math.floor(Math.random() * 6)
      ],
    }));
    setDepartmentData(deptData);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of your workforce">
      <div className="space-y-6">
        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <MetricCard
              icon={<Users className="w-8 h-8" />}
              label="Total Employees"
              value={metrics.totalEmployees}
              trend="up"
              change={2}
            />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <MetricCard
              icon={<UserCheck className="w-8 h-8 text-green-500" />}
              label="Present Today"
              value={metrics.presentToday}
              change={5}
              trend="up"
            />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <MetricCard
              icon={<Clock className="w-8 h-8 text-yellow-500" />}
              label="On Leave"
              value={metrics.onLeave}
              change={-3}
              trend="down"
            />
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <MetricCard
              icon={<AlertCircle className="w-8 h-8 text-red-500" />}
              label="Late Today"
              value={metrics.lateEmployees}
              change={-10}
              trend="down"
            />
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Weekly Attendance Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Department Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Activity & Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Pending Leave Requests
              </h3>
              <div className="space-y-3">
                {mockDataStore.getPendingLeaveRequests().slice(0, 5).map((req) => {
                  const employee = mockDataStore.getEmployeeById(req.employeeId);
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                    >
                      <div>
                        <p className="font-medium text-slate-900">
                          {employee?.name}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">
                          {req.leaveType.replace(/_/g, " ")} •{" "}
                          {req.numberOfDays} days
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition">
                          Approve
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 transition">
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          {/* Recent Announcements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Recent Announcements
              </h3>
              <div className="space-y-3">
                {mockDataStore.announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="border-b border-slate-200 pb-3 last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 text-sm">
                          {ann.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {ann.content}
                        </p>
                      </div>
                      {ann.priority === "urgent" && (
                        <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded whitespace-nowrap">
                          Urgent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* KPI Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Monthly KPIs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg. Attendance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {(metrics.avgAttendanceRate * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Active Depts</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics.activeDepartments}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {metrics.pendingLeaveRequests}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
