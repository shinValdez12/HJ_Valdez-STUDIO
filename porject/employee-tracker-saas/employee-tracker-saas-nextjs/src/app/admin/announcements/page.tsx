"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Announcement } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const;

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Announcement["priority"]>("medium");
  const [isPinned, setIsPinned] = useState(false);
  const [departmentIds, setDepartmentIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setAnnouncements(mockDataStore.getAnnouncements());
  }, []);

  const filtered = useMemo(
    () =>
      announcements.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
      ),
    [announcements, search]
  );

  function resetForm() {
    setTitle("");
    setContent("");
    setPriority("medium");
    setIsPinned(false);
    setDepartmentIds([]);
    setEditingId(null);
  }

  function saveAnnouncement() {
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      mockDataStore.updateAnnouncement(editingId, {
        title,
        content,
        priority,
        isPinned,
        departmentIds: departmentIds.length ? departmentIds : undefined,
      });
    } else {
      mockDataStore.createAnnouncement({
        title,
        content,
        priority,
        isPinned,
        departmentIds: departmentIds.length ? departmentIds : undefined,
      });
    }

    setAnnouncements(mockDataStore.getAnnouncements());
    resetForm();
  }

  function editAnnouncement(item: Announcement) {
    setEditingId(item.id);
    setTitle(item.title);
    setContent(item.content);
    setPriority(item.priority);
    setIsPinned(item.isPinned);
    setDepartmentIds(item.departmentIds || []);
  }

  function removeAnnouncement(id: string) {
    mockDataStore.deleteAnnouncement(id);
    setAnnouncements(mockDataStore.getAnnouncements());
  }

  return (
    <DashboardLayout title="Announcements" subtitle="Create and manage company-wide notices">
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Search announcements</label>
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title or content..."
                />
              </div>

              <div className="space-y-4">
                {filtered.length === 0 ? (
                  <p className="text-sm text-slate-500">No announcements found.</p>
                ) : (
                  filtered.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-base font-semibold text-slate-900">{announcement.title}</p>
                            {announcement.isPinned && (
                              <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">Pinned</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{announcement.content}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            Priority: {announcement.priority} • Updated {new Date(announcement.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => editAnnouncement(announcement)}>
                            Edit
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => removeAnnouncement(announcement.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{editingId ? "Edit Announcement" : "New Announcement"}</h2>
              <p className="text-sm text-slate-600">Post new announcements to selected departments or the whole company.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Title</label>
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Content</label>
                <Textarea value={content} onChange={(event) => setContent(event.target.value)} rows={5} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select
                    className="w-full rounded border border-slate-300 px-3 py-2"
                    value={priority}
                    onChange={(event) => setPriority(event.target.value as Announcement["priority"])}
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input type="checkbox" checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} />
                    Pin announcement
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Target departments (optional)</label>
                <Input
                  value={departmentIds.join(", ")}
                  onChange={(event) => setDepartmentIds(event.target.value.split(",").map((value) => value.trim()).filter(Boolean))}
                  placeholder="e.g. dept-it, dept-hr"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={saveAnnouncement}>{editingId ? "Update Announcement" : "Publish Announcement"}</Button>
              <Button variant="outline" onClick={resetForm}>Clear</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
