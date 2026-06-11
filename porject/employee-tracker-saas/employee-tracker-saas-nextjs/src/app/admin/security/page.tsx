"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminSecurityPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDevices(mockDataStore.getDevices());
    setActivity(mockDataStore.getAllActivityLogs().slice(0, 20));
  }, []);

  function revoke(id: string) {
    mockDataStore.removeDevice(id);
    setDevices(mockDataStore.getDevices());
  }

  const filteredActivity = activity.filter((log) =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Security" subtitle="Manage device access and monitor login activity">
      <div className="space-y-6 max-w-6xl">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Connected Devices</h2>
              <p className="text-sm text-slate-600">Revoke access for any stale or unmanaged devices.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {devices.map((d) => (
              <div key={d.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-900">{d.name}</p>
                  <p className="text-sm text-slate-500">{d.os} • {d.ip}</p>
                  <p className="text-xs text-slate-400">Last seen {new Date(d.lastSeen).toLocaleString()}</p>
                </div>
                <Button variant="secondary" onClick={() => revoke(d.id)}>Revoke</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Security Activity</h2>
              <p className="text-sm text-slate-600">Track recent authentication and access events.</p>
            </div>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter activity..."
              className="max-w-sm"
            />
          </div>
          <div className="mt-4 space-y-3">
            {filteredActivity.length === 0 ? (
              <p className="text-sm text-slate-500">No matching security events.</p>
            ) : (
              filteredActivity.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg bg-slate-50">
                  <p className="font-medium text-slate-900">{event.action}</p>
                  <p className="text-sm text-slate-500">{event.userId} • {event.entityType} • {new Date(event.timestamp).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
