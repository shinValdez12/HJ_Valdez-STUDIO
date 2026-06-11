"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { LeaveRequest } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  function refresh() {
    setRequests(mockDataStore.getPendingLeaveRequests());
  }

  function approve(id: string) {
    mockDataStore.approveLeaveRequest(id, "admin-super");
    refresh();
  }

  function reject(id: string) {
    mockDataStore.rejectLeaveRequest(id, "admin-super", "Not approved in demo");
    refresh();
  }

  const filteredRequests = requests.filter((r) => {
    const employee = mockDataStore.getEmployeeById(r.employeeId);
    return (
      r.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      employee?.name.toLowerCase().includes(search.toLowerCase()) ||
      employee?.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DashboardLayout title="Leave Requests" subtitle="Review and manage pending leave approvals">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Input
            placeholder="Search leave requests by employee or type"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="max-w-xl"
          />
          <Button variant="outline" onClick={refresh}>Refresh</Button>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="p-6 border rounded bg-slate-50 text-slate-600">No pending leave requests match your search.</div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((r) => {
              const employee = mockDataStore.getEmployeeById(r.employeeId);
              return (
                <div key={r.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {employee?.name || r.employeeId}
                      </p>
                      <p className="text-sm text-slate-500">
                        {employee?.email || ""}
                      </p>
                      <p className="text-sm text-slate-600 mt-2">
                        {r.leaveType.replace(/_/g, " ")} • {new Date(r.startDate).toLocaleDateString()} to {new Date(r.endDate).toLocaleDateString()} ({r.numberOfDays} days)
                      </p>
                      {r.reason && <p className="text-sm text-slate-600 mt-2">Reason: {r.reason}</p>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => approve(r.id)}>Approve</Button>
                      <Button variant="secondary" onClick={() => reject(r.id)}>Reject</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
