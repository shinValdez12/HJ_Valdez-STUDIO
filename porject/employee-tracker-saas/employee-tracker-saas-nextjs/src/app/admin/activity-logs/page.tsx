"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { ActivityLog } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ENTITY_TYPES = ["attendance", "leave", "user", "announcement", "schedule", "document"] as const;

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("");

  useEffect(() => {
    setLogs(mockDataStore.getAllActivityLogs());
  }, []);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        const matchesSearch =
          log.action.toLowerCase().includes(search.toLowerCase()) ||
          log.entityType.toLowerCase().includes(search.toLowerCase()) ||
          log.entityId.toLowerCase().includes(search.toLowerCase());
        const matchesEntity = entityFilter ? log.entityType === entityFilter : true;
        return matchesSearch && matchesEntity;
      }),
    [logs, search, entityFilter]
  );

  return (
    <DashboardLayout title="Activity Logs" subtitle="Review tracked user and admin actions">
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Activity Audit Trail</h2>
              <p className="text-sm text-slate-600">Search and filter recorded platform actions for compliance and review.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search actions or entities..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="min-w-[240px]"
              />
              <select
                className="rounded border border-slate-300 px-3 py-2"
                value={entityFilter}
                onChange={(event) => setEntityFilter(event.target.value)}
              >
                <option value="">All types</option>
                {ENTITY_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-3">
            {filteredLogs.length === 0 ? (
              <p className="text-sm text-slate-500">No activity logs match your criteria.</p>
            ) : (
              filteredLogs.slice(0, 30).map((log) => (
                <div key={log.id} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{log.action}</p>
                      <p className="text-sm text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">{log.entityType}</span>
                      <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">{log.entityId}</span>
                      {log.ipAddress && <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs">{log.ipAddress}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
