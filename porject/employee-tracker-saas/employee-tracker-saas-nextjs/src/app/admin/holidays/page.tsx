"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Holiday } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminHolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Holiday["type"]>("company");
  const [date, setDate] = useState("");
  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setHolidays(mockDataStore.getHolidays());
  }, []);

  function saveHoliday() {
    if (!name || !date) return;

    const holidayData = {
      name,
      date: new Date(date),
      type,
      description,
      departmentIds: departmentIds.length ? departmentIds : undefined,
    };

    if (editingId) {
      mockDataStore.updateHoliday(editingId, holidayData);
    } else {
      mockDataStore.createHoliday(holidayData);
    }

    setHolidays(mockDataStore.getHolidays());
    clearForm();
  }

  function clearForm() {
    setName("");
    setDescription("");
    setType("company");
    setDate("");
    setDepartmentIds([]);
    setEditingId(null);
  }

  function editHoliday(item: Holiday) {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || "");
    setType(item.type);
    setDate(new Date(item.date).toISOString().split("T")[0]);
    setDepartmentIds(item.departmentIds || []);
  }

  function deleteHoliday(id: string) {
    mockDataStore.deleteHoliday(id);
    setHolidays(mockDataStore.getHolidays());
  }

  const upcoming = useMemo(
    () => holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [holidays]
  );

  return (
    <DashboardLayout title="Holiday Calendar" subtitle="Manage company and departmental time-off schedules">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Upcoming Holidays</h2>
                  <p className="text-sm text-slate-600">Review and maintain holiday schedules across your organization.</p>
                </div>
              </div>

              <div className="space-y-3">
                {upcoming.map((holiday) => (
                  <div key={holiday.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{holiday.name}</p>
                        <p className="text-sm text-slate-500">{new Date(holiday.date).toLocaleDateString()} • {holiday.type}</p>
                        {holiday.description && <p className="text-sm text-slate-600 mt-2">{holiday.description}</p>}
                        {holiday.departmentIds?.length ? (
                          <p className="text-xs text-slate-500 mt-2">Departments: {holiday.departmentIds.join(", ")}</p>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={() => editHoliday(holiday)}>
                          Edit
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => deleteHoliday(holiday.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{editingId ? "Update Holiday" : "Add New Holiday"}</h2>
              <p className="text-sm text-slate-600">Plan company-wide and department-specific holiday schedules.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Holiday Name</label>
                <Input value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Date</label>
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select
                  className="w-full rounded border border-slate-300 px-3 py-2"
                  value={type}
                  onChange={(event) => setType(event.target.value as Holiday["type"])}
                >
                  <option value="national">National</option>
                  <option value="company">Company</option>
                  <option value="department_specific">Department-specific</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Textarea rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Department IDs</label>
                <Input
                  value={departmentIds.join(", ")}
                  onChange={(event) => setDepartmentIds(event.target.value.split(",").map((value) => value.trim()).filter(Boolean))}
                  placeholder="e.g. dept-it, dept-hr"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={saveHoliday}>{editingId ? "Save Changes" : "Add Holiday"}</Button>
                <Button variant="outline" onClick={clearForm}>Clear</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
