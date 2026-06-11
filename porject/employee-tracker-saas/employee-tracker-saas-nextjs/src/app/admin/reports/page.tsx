"use client";

import React, { useState } from "react";
import { generateEmployeesCSV, generateAttendanceCSV, generateLeaveRequestsCSV, downloadFile, simulatePDFBlob, simulateExportProgress } from "@/lib/exports";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const [progress, setProgress] = useState<number>(0);
  const [exporting, setExporting] = useState(false);
  const totalEmployees = mockDataStore.employees.length;
  const totalAttendance = mockDataStore.attendanceLogs.length;
  const pendingLeaveRequests = mockDataStore.getPendingLeaveRequests().length;

  function downloadCSV(name: string, csv: string) {
    downloadFile(`${name}.csv`, csv, "text/csv;charset=utf-8;");
  }

  function downloadExcel(name: string, csv: string) {
    downloadFile(`${name}.xlsx`, csv, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  }

  async function exportPDF(name: string, content: string) {
    setExporting(true);
    setProgress(0);
    await simulateExportProgress((p) => setProgress(p));
    const blob = simulatePDFBlob(content);
    downloadFile(`${name}.pdf`, blob, "application/pdf");
    setExporting(false);
    setProgress(0);
  }

  return (
    <DashboardLayout title="Reports & Exports" subtitle="Download attendance, payroll, and leave reports for analysis">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Employee Summary</h3>
            <p className="text-4xl font-bold text-slate-900">{totalEmployees}</p>
            <p className="text-sm text-slate-500 mt-2">Total employee records available.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Attendance Logs</h3>
            <p className="text-4xl font-bold text-slate-900">{totalAttendance}</p>
            <p className="text-sm text-slate-500 mt-2">Total attendance entries generated.</p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Pending Leaves</h3>
            <p className="text-4xl font-bold text-slate-900">{pendingLeaveRequests}</p>
            <p className="text-sm text-slate-500 mt-2">Leave requests awaiting action.</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="font-medium mb-2">Employee Export</h3>
            <p className="text-sm text-slate-600 mb-4">Export the full employee directory for HR reporting.</p>
            <Button className="mr-2" onClick={() => downloadCSV("employees", generateEmployeesCSV())}>CSV</Button>
            <Button variant="outline" onClick={() => downloadExcel("employees", generateEmployeesCSV())}>Excel</Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-medium mb-2">Attendance Export</h3>
            <p className="text-sm text-slate-600 mb-4">Download raw attendance logs for payroll and audit review.</p>
            <Button className="mr-2" onClick={() => downloadCSV("attendance", generateAttendanceCSV())}>CSV</Button>
            <Button variant="outline" onClick={() => downloadExcel("attendance", generateAttendanceCSV())}>Excel</Button>
          </Card>
          <Card className="p-6">
            <h3 className="font-medium mb-2">Leave Export</h3>
            <p className="text-sm text-slate-600 mb-4">Export leave request history for compliance tracking.</p>
            <Button className="mr-2" onClick={() => downloadCSV("leave-requests", generateLeaveRequestsCSV())}>CSV</Button>
            <Button variant="outline" onClick={() => downloadExcel("leave-requests", generateLeaveRequestsCSV())}>Excel</Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">On-Demand PDF Reports</h3>
                <p className="text-sm text-slate-600">Create a PDF-style export for executive review.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => exportPDF("employees-report", "Employees report (simulated PDF)")}>Employee PDF</Button>
                <Button variant="outline" onClick={() => exportPDF("attendance-report", "Attendance report (simulated PDF)")}>Attendance PDF</Button>
                <Button variant="outline" onClick={() => exportPDF("leaves-report", "Leaves report (simulated PDF)")}>Leave PDF</Button>
              </div>
            </div>
            {exporting && (
              <div className="mt-4">
                <div className="text-sm mb-2">Preparing export...</div>
                <div className="w-full bg-slate-200 rounded h-3 overflow-hidden">
                  <div className="bg-blue-600 h-3 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
