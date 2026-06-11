"use client";

import React, { useEffect, useState } from "react";
import { mockDataStore } from "@/mock/store";

export default function AdminPositionsPage() {
  const [positions, setPositions] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState<string>("");
  const [level, setLevel] = useState<any>("mid");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editLevel, setEditLevel] = useState<any>("mid");

  useEffect(() => {
    setPositions(mockDataStore.positions);
    if (mockDataStore.departments.length > 0 && !dept) setDept(mockDataStore.departments[0].id);
  }, []);

  function refresh() {
    setPositions([...mockDataStore.positions]);
  }

  function create() {
    if (!title || !dept) return;
    mockDataStore.createPosition(title, dept, level, 50000, "");
    setTitle("");
    refresh();
  }

  function startEdit(p: any) {
    setEditingId(p.id);
    setEditTitle(p.title);
    setEditDept(p.departmentId || "");
    setEditLevel(p.level || "mid");
  }

  function saveEdit() {
    if (!editingId) return;
    mockDataStore.updatePosition(editingId, { title: editTitle, departmentId: editDept, level: editLevel });
    setEditingId(null);
    setEditTitle("");
    setEditDept("");
    setEditLevel("mid");
    refresh();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDept("");
    setEditLevel("mid");
  }

  function remove(id: string) {
    mockDataStore.deletePosition(id);
    refresh();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Positions</h1>

      <div className="mb-4 max-w-lg">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full p-2 border rounded mb-2">
          {mockDataStore.departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded mb-2">
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
          <option value="manager">Manager</option>
          <option value="director">Director</option>
        </select>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={create}>Create Position</button>
      </div>

      <div className="space-y-3 max-w-3xl">
        {positions.map((p) => (
          <div key={p.id} className="p-3 border rounded">
            {editingId === p.id ? (
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <input className="w-full p-2 border rounded mb-2" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <select className="w-full p-2 border rounded mb-2" value={editDept} onChange={(e) => setEditDept(e.target.value)}>
                    {mockDataStore.departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <select className="w-full p-2 border rounded" value={editLevel} onChange={(e) => setEditLevel(e.target.value)}>
                    <option value="entry">Entry</option>
                    <option value="mid">Mid</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="manager">Manager</option>
                    <option value="director">Director</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={saveEdit}>Save</button>
                  <button className="px-3 py-1 bg-gray-300 rounded" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground">{p.departmentId} • {p.level}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => startEdit(p)}>Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => remove(p.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
