"use client";

import React, { useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import { mockDataStore } from "@/mock/store";
import { useAuth } from "@/hooks/useAuth";
import { addDays } from "date-fns";

export default function EmployeeCalendarPage() {
  const { user } = useAuth();
  const [month, setMonth] = useState<Date>(new Date());

  const events = useMemo(() => {
    const ev: any[] = [];
    for (const h of mockDataStore.holidays) {
      ev.push({ id: h.id, date: new Date(h.date), title: `Holiday: ${h.name}`, color: "#fde68a" });
    }

    if (user) {
      const myLeaves = mockDataStore.leaveRequests.filter((r) => r.employeeId === user.id);
      for (const r of myLeaves) {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
          ev.push({ id: `${r.id}-${d.toISOString()}`, date: new Date(d), title: `My Leave: ${r.status}`, color: "#bfdbfe" });
        }
      }
    }

    return ev;
  }, [month, user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Calendar</h1>
      <Calendar month={month} events={events} onPrev={() => setMonth((m) => addDays(m, -30))} onNext={() => setMonth((m) => addDays(m, 30))} />
    </div>
  );
}
