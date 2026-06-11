"use client";

import React from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay } from "date-fns";

type CalEvent = {
  id: string;
  date: Date;
  title: string;
  color?: string;
  allDay?: boolean;
};

export default function Calendar({
  month,
  events = [],
  onPrev,
  onNext,
}: {
  month: Date;
  events?: CalEvent[];
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows: Date[][] = [];
  let day = startDate;
  while (day <= endDate) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
  }

  function eventsFor(dayDate: Date) {
    return events.filter((e) => isSameDay(e.date, dayDate));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded" onClick={onPrev}>Prev</button>
          <button className="px-3 py-1 border rounded" onClick={onNext}>Next</button>
        </div>
        <div className="font-medium">{format(month, "MMMM yyyy")}</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {"Mon Tue Wed Thu Fri Sat Sun".split(" ").map((d) => (
          <div key={d} className="text-sm text-center font-medium py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {rows.map((week, wi) => (
          <React.Fragment key={wi}>
            {week.map((d) => (
              <div key={d.toISOString()} className={`min-h-[80px] p-2 border rounded ${isSameMonth(d, monthStart) ? "bg-white" : "bg-gray-50 text-muted-foreground"}`}>
                <div className="text-sm font-semibold">{format(d, "d")}</div>
                <div className="mt-1 space-y-1">
                  {eventsFor(d).map((ev) => (
                    <div key={ev.id} className="text-xs truncate px-1 py-0.5 rounded" style={{ background: ev.color || "#e2e8f0" }}>{ev.title}</div>
                  ))}
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
