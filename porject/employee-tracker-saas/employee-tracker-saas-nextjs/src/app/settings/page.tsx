"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { mockDataStore } from "@/mock/store";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { user } = useAuth();
  const [twoFA, setTwoFA] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [timezone, setTimezone] = useState("America/Chicago");
  const [language, setLanguage] = useState("English");
  const [platformName, setPlatformName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");

  useEffect(() => {
    if (!user) return;
    const s = mockDataStore.getUserSettings(user.id);
    setTwoFA(!!s.twoFA);
    setDevices(mockDataStore.getDevices(user.id));
    setTimezone(mockDataStore.getPlatformSettings().defaultTimezone);
    setLanguage(mockDataStore.getPlatformSettings().defaultLanguage);
    setPlatformName(mockDataStore.getPlatformSettings().companyName);
    setSupportEmail(mockDataStore.getPlatformSettings().supportEmail);
  }, [user]);

  function toggle2FA() {
    if (!user) return;
    const newVal = mockDataStore.toggleTwoFA(user.id);
    setTwoFA(newVal);
  }

  function revokeDevice(id: string) {
    mockDataStore.removeDevice(id);
    setDevices(mockDataStore.getDevices(user?.id));
  }

  function savePreferences() {
    mockDataStore.updatePlatformSettings({
      defaultTimezone: timezone,
      defaultLanguage: language,
      companyName: platformName,
      supportEmail,
    });
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage security, preferences, and connected devices">
      <div className="space-y-6">
        <Card className="p-6 max-w-3xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-900">Account Security</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">Two-factor authentication</p>
                <p className="text-sm text-slate-600">Secure your login with an additional verification step.</p>
              </div>
              <Button onClick={toggle2FA} className={twoFA ? "bg-green-600 hover:bg-green-700" : "bg-slate-300 text-slate-900"}>
                {twoFA ? "Enabled" : "Enable"}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 max-w-3xl">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Devices</h2>
            {devices.length === 0 ? (
              <p className="text-sm text-slate-500">No devices registered for your account.</p>
            ) : (
              <div className="space-y-3">
                {devices.map((d) => (
                  <div key={d.id} className="p-4 border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{d.name}</p>
                      <p className="text-sm text-slate-500">{d.os} • {d.ip}</p>
                      <p className="text-xs text-slate-400">Last seen {new Date(d.lastSeen).toLocaleString()}</p>
                    </div>
                    <Button variant="secondary" onClick={() => revokeDevice(d.id)}>
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 max-w-3xl">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">User Preferences</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Default Timezone</label>
                <Input value={timezone} onChange={(event) => setTimezone(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Language</label>
                <Input value={language} onChange={(event) => setLanguage(event.target.value)} />
              </div>
            </div>
            <Button onClick={savePreferences}>Save Preferences</Button>
          </div>
        </Card>

        {user?.role !== "employee" && (
          <Card className="p-6 max-w-3xl">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Platform Settings</h2>
              <div className="grid grid-cols-1 gap-4">
                <Input value={platformName} onChange={(event) => setPlatformName(event.target.value)} placeholder="Platform name" />
                <Input value={supportEmail} onChange={(event) => setSupportEmail(event.target.value)} placeholder="Support email" />
              </div>
              <Button onClick={savePreferences}>Save Platform Settings</Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
