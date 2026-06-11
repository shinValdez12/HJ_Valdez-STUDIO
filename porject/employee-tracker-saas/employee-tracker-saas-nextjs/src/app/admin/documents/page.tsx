"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setDocs(mockDataStore.documents);
  }, []);

  const filteredDocs = useMemo(
    () =>
      docs.filter((doc) =>
        doc.fileName.toLowerCase().includes(filter.toLowerCase()) ||
        doc.documentType.toLowerCase().includes(filter.toLowerCase()) ||
        doc.employeeId.toLowerCase().includes(filter.toLowerCase())
      ),
    [docs, filter]
  );

  return (
    <DashboardLayout title="Document Vault" subtitle="Central repository for employee records and certifications">
      <div className="space-y-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Document Library</h2>
            <p className="text-sm text-slate-600">Search documents by employee, file name, or type.</p>
          </div>
          <Input placeholder="Filter documents..." value={filter} onChange={(event) => setFilter(event.target.value)} className="max-w-sm" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredDocs.length === 0 ? (
            <div className="p-6 border rounded bg-slate-50 text-slate-600">No documents match your search.</div>
          ) : (
            filteredDocs.map((d) => (
              <div key={d.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{d.fileName}</p>
                  <p className="text-sm text-slate-500">{d.employeeId} • {d.documentType}</p>
                  <p className="text-xs text-slate-400">Uploaded {new Date(d.uploadedAt).toLocaleDateString()}</p>
                  {d.expiryDate && (
                    <p className={`text-xs mt-1 ${new Date(d.expiryDate) < new Date() ? "text-red-600" : "text-slate-500"}`}>
                      Expires {new Date(d.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {d.url ? (
                    <Button onClick={() => window.open(d.url, "_blank")}>Preview</Button>
                  ) : (
                    <span className="text-sm text-slate-500">No preview</span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${d.status === "expired" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
