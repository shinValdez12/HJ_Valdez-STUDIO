"use client";

import React, { useEffect, useState } from "react";
import { mockDataStore } from "@/mock/store";

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    setDepartments(mockDataStore.departments);
  }, []);

  function refresh() {
    setDepartments([...mockDataStore.departments]);
  }

  function create() {
    if (!name) return;
    mockDataStore.createDepartment(name, description);
    setName("");
    setDescription("");
    refresh();
  }

  function startEdit(d: any) {
    setEditingId(d.id);
    setEditName(d.name);
    setEditDescription(d.description || "");
  }

  function saveEdit() {
    if (!editingId) return;
    mockDataStore.updateDepartment(editingId, { name: editName, description: editDescription });
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    refresh();
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  }

  function remove(id: string) {
    mockDataStore.deleteDepartment(id);
    refresh();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Departments</h1>

      <div className="mb-4 max-w-lg">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded mb-2" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={create}>Create Department</button>
      </div>

      <div className="space-y-3 max-w-3xl">
        {departments.map((d) => (
          <div key={d.id} className="p-3 border rounded">
            {editingId === d.id ? (
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <input className="w-full p-2 border rounded mb-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input className="w-full p-2 border rounded" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={saveEdit}>Save</button>
                  <button className="px-3 py-1 bg-gray-300 rounded" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-sm text-muted-foreground">{d.description}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => startEdit(d)}>Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => remove(d.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
