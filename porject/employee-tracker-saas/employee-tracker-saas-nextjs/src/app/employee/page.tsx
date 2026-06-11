"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { DashboardLayout, MetricCard } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState<any[]>([]);
  const [todayStatus, setTodayStatus] = useState<string>("Not Checked In");

  useEffect(() => {
    if (!user) return;

    // Calculate attendance rate
    const attendance = mockDataStore.getEmployeeAttendance(user.id, 30);
    const presentDays = attendance.filter(
      (log) =>
        log.status === "present" ||
        log.status === "late" ||
        log.status === "half_day"
    ).length;
    const rate = attendance.length > 0 ? (presentDays / attendance.length) * 100 : 0;
    setAttendanceRate(rate);

    // Get leave balance
    const balance = mockDataStore.getEmployeeLeaveBalance(user.id);
    setLeaveBalance(balance);

    // Check today's status
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayLog = attendance.find(
      (log) =>
        new Date(log.date).getTime() === todayStart.getTime()
    );

    if (todayLog?.timeIn) {
      setTodayStatus(todayLog.timeOut ? "Checked Out" : "Checked In");
    }
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout
      title="Welcome back!"
      subtitle={`Here's your attendance overview for today`}
    >
      <div className="space-y-6">
        {/* Quick Status Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Today's Status</p>
                  <p className="text-2xl font-bold text-slate-900">{todayStatus}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Attendance Rate</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {attendanceRate.toFixed(1)}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Leave Balance</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {leaveBalance.find((l) => l.leaveType === "vacation")?.remainingDays || 0} days
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-amber-500" />
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Work Mode</p>
                  <p className="text-2xl font-bold text-slate-900 capitalize">
                    {user.workMode}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-500" />
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Check In / Check Out Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Today's Check In/Out
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => mockDataStore.simulateCheckIn(user.id)}
                className="bg-green-500 hover:bg-green-600 text-white h-12 text-base font-semibold"
              >
                ✓ Check In
              </Button>
              <Button
                onClick={() => mockDataStore.simulateCheckOut(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white h-12 text-base font-semibold"
              >
                ✗ Check Out
              </Button>
            </div>
            <p className="text-xs text-slate-600 mt-4">
              These actions are simulated for demo purposes.
            </p>
          </Card>
        </motion.div>

        {/* Leave Balance Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Leave Balance Details
            </h3>
            <div className="space-y-4">
              {leaveBalance.map((balance) => (
                <div key={balance.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {balance.leaveType.replace(/_/g, " ")}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {balance.remainingDays} / {balance.totalDays} days
                    </span>
                  </div>
                  <Progress
                    value={(balance.remainingDays / balance.totalDays) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
              Request Leave
            </Button>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {mockDataStore
                .getActivityLogs(user.id)
                .slice(0, 6)
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {log.action}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">
                      {log.entityType}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Announcements
            </h3>
            <div className="space-y-3">
              {mockDataStore.announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 bg-slate-50 rounded-lg border-l-4 border-l-blue-500 hover:bg-slate-100 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{ann.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {ann.content}
                      </p>
                    </div>
                    {ann.isPinned && (
                      <span className="text-lg">📌</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
