"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockDataStore } from "@/mock/store";

export default function EmployeeLeavesPage() {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [leaveType, setLeaveType] = useState<string>("annual");
  const [reason, setReason] = useState<string>("");
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      const all = mockDataStore.leaveRequests.filter((r) => r.employeeId === user.id);
      setRequests(all);
    }
  }, [user]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    mockDataStore.submitLeaveRequest(user.id, leaveType, new Date(startDate), new Date(endDate), reason);
    const all = mockDataStore.leaveRequests.filter((r) => r.employeeId === user.id);
    setRequests(all);
    setStartDate("");
    setEndDate("");
    setReason("");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Leave Requests</h1>

      <form onSubmit={submit} className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm mb-1">Leave Type</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full p-2 border rounded">
            <option value="annual">Annual</option>
            <option value="sick">Sick</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Reason (optional)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Request</button>
        </div>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Your Requests</h2>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{r.leaveType} — {new Date(r.startDate).toLocaleDateString()} to {new Date(r.endDate).toLocaleDateString()}</div>
                    <div className="text-sm text-muted-foreground">Status: {r.status}</div>
                    {r.rejectionReason && <div className="text-sm text-red-600">Rejected: {r.rejectionReason}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
