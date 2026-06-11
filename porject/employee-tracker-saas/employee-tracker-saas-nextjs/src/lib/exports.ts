import { mockDataStore } from "@/mock/store";

function arrayToCSV(headers: string[], rows: Array<string[]>) {
  const esc = (v: any) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
}

export function downloadFile(filename: string, content: string | Blob, mime = "text/csv") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function generateEmployeesCSV() {
  const emps = mockDataStore.employees;
  const headers = ["id", "name", "email", "role", "departmentId", "positionId", "status"];
  const rows = emps.map((e) => [e.id, e.name, e.email, e.role, e.departmentId || "", e.positionId || "", e.status || "active"]);
  return arrayToCSV(headers, rows);
}

export function generateAttendanceCSV() {
  const logs = mockDataStore.attendanceLogs;
  const headers = ["id", "employeeId", "date", "timeIn", "timeOut", "status", "totalHours", "deviceInfo", "locationInfo"];
  const rows = logs.map((l: any) => [l.id, l.employeeId, new Date(l.date).toISOString(), l.timeIn ? new Date(l.timeIn).toISOString() : "", l.timeOut ? new Date(l.timeOut).toISOString() : "", l.status, l.totalHours || "", l.deviceInfo || "", l.locationInfo || ""]);
  return arrayToCSV(headers, rows);
}

export function generateLeaveRequestsCSV() {
  const reqs = mockDataStore.leaveRequests;
  const headers = ["id", "employeeId", "leaveType", "startDate", "endDate", "numberOfDays", "status", "createdAt", "updatedAt", "reason"];
  const rows = reqs.map((r: any) => [r.id, r.employeeId, r.leaveType, new Date(r.startDate).toISOString(), new Date(r.endDate).toISOString(), String(r.numberOfDays || ""), r.status, r.createdAt ? new Date(r.createdAt).toISOString() : "", r.updatedAt ? new Date(r.updatedAt).toISOString() : "", r.reason || ""]);
  return arrayToCSV(headers, rows);
}

export function simulatePDFBlob(text: string) {
  // For demo purposes create a plain text blob but mark as PDF mime-type so it downloads as .pdf
  const blob = new Blob([text], { type: "application/pdf" });
  return blob;
}

export function simulateExportProgress(onProgress: (p: number) => void, duration = 1500) {
  return new Promise<void>((resolve) => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      onProgress(p);
      if (p >= 1) {
        clearInterval(id);
        resolve();
      }
    }, 80);
  });
}
