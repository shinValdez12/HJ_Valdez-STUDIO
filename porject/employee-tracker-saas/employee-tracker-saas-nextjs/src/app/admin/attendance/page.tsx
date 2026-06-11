"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Smartphone, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"desktop" | "kiosk">("desktop");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [queuedActions, setQueuedActions] = useState<any[]>([]);

  const employees = mockDataStore.employees;
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((emp) =>
        departmentFilter ? emp.departmentId === departmentFilter : true
      );
  }, [employees, searchQuery, departmentFilter]);

  useEffect(() => {
    setQueuedActions(mockDataStore.getSyncQueue());
  }, []);

  const handleCheckIn = (employeeId: string) => {
    if (offlineMode) {
      const action = {
        id: `sync-${Date.now()}`,
        action: "create",
        entityType: "attendance",
        entityId: employeeId,
        payload: { type: "checkin" },
        timestamp: new Date(),
        synced: false,
      } as const;
      mockDataStore.queueSyncAction(action);
      setQueuedActions(mockDataStore.getSyncQueue());
      setCheckinSuccess(true);
      setTimeout(() => setCheckinSuccess(false), 2000);
      return;
    }

    mockDataStore.simulateCheckIn(employeeId);
    setCheckinSuccess(true);
    setTimeout(() => setCheckinSuccess(false), 2000);
  };

  const handleCheckOut = (employeeId: string) => {
    if (offlineMode) {
      const action = {
        id: `sync-${Date.now()}`,
        action: "create",
        entityType: "attendance",
        entityId: employeeId,
        payload: { type: "checkout" },
        timestamp: new Date(),
        synced: false,
      } as const;
      mockDataStore.queueSyncAction(action);
      setQueuedActions(mockDataStore.getSyncQueue());
      return;
    }

    mockDataStore.simulateCheckOut(employeeId);
  };

  const handleSyncNow = () => {
    mockDataStore.syncPendingActions();
    setQueuedActions(mockDataStore.getSyncQueue());
  };

  // Kiosk Mode
  if (mode === "kiosk") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white rounded-2xl shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">Attendance Kiosk</h1>
              <p className="text-slate-600 mt-2">Search for your name or scan to check in/out.</p>
            </div>

            {checkinSuccess && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 text-center"
              >
                ✓ Action queued for sync!
              </motion.div>
            )}

            <div className="mb-6 space-y-4">
              <Input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-lg h-14 text-center"
                autoFocus
              />
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  placeholder="Department ID filter"
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => setDepartmentFilter("")}>Clear</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 max-h-48 overflow-y-auto">
              {filteredEmployees.slice(0, 8).map((emp) => (
                <motion.button
                  key={emp.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedEmployee?.id === emp.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300 bg-slate-50"
                  }`}
                >
                  <div className="text-2xl mb-1">👤</div>
                  <p className="text-xs font-semibold text-slate-900 line-clamp-2">{emp.name}</p>
                </motion.button>
              ))}
            </div>

            {selectedEmployee && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-lg p-4 mb-6"
              >
                <p className="text-sm text-slate-600">Selected Employee:</p>
                <p className="text-lg font-semibold text-slate-900">{selectedEmployee.name}</p>
                <p className="text-sm text-slate-600">{selectedEmployee.email}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button
                onClick={() => selectedEmployee && handleCheckIn(selectedEmployee.id)}
                disabled={!selectedEmployee}
                className="bg-green-500 hover:bg-green-600 text-white h-16 text-lg font-bold"
              >
                ✓ CHECK IN
              </Button>
              <Button
                onClick={() => selectedEmployee && handleCheckOut(selectedEmployee.id)}
                disabled={!selectedEmployee}
                className="bg-red-500 hover:bg-red-600 text-white h-16 text-lg font-bold"
              >
                ✗ CHECK OUT
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Offline queue</span>
                <span>{queuedActions.length} pending</span>
              </div>
              <Button variant="secondary" onClick={handleSyncNow} className="w-full">
                Sync pending actions
              </Button>
            </div>

            <Button onClick={() => setMode("desktop")} variant="outline" className="w-full mt-4">
              Exit Kiosk Mode
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Desktop Mode
  return (
    <DashboardLayout title="Attendance Tracking" subtitle="Monitor employee check-ins and check-outs">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-slate-900">Tablet Kiosk Mode</h3>
                <p className="text-sm text-slate-600">Switch to touch-friendly kiosk interface for direct employee attendance.</p>
              </div>
              <Button onClick={() => setMode("kiosk")} className="bg-blue-500 hover:bg-blue-600">
                <Smartphone className="w-4 h-4 mr-2" />
                Enter Kiosk Mode
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
            <Input
              type="text"
              placeholder="Search employees by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10"
            />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded border border-slate-300 px-3 py-2"
            >
              <option value="">All departments</option>
              {mockDataStore.departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, staggerChildren: 0.05 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.slice(0, 15).map((emp, idx) => (
            <motion.div key={emp.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }}>
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.email}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700">{emp.workMode}</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Department</span>
                    <span className="font-medium text-slate-900">{mockDataStore.getDepartmentById(emp.departmentId)?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className="font-medium text-green-600">{emp.status === "active" ? "✓ Active" : "⊘ " + emp.status}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={() => handleCheckIn(emp.id)} size="sm" className="bg-green-500 hover:bg-green-600 text-white">Check In</Button>
                  <Button onClick={() => handleCheckOut(emp.id)} size="sm" className="bg-red-500 hover:bg-red-600 text-white">Check Out</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600">No employees found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
