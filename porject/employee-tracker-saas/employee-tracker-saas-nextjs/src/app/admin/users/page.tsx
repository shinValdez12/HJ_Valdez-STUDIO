"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { User } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLES: User["role"][] = ["employee", "department_admin", "super_admin"];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("employee");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");

  useEffect(() => {
    setUsers(mockDataStore.getAllUsers());
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  );

  function addUser() {
    if (!name.trim() || !email.trim()) return;
    mockDataStore.createUser({
      name,
      email,
      role,
      departmentId: departmentId || mockDataStore.departments[0]?.id || "dept-it",
      positionId: positionId || mockDataStore.positions[0]?.id || "pos-mid",
      workMode: "hybrid",
      joinDate: new Date(),
    });
    setUsers(mockDataStore.getAllUsers());
    setName("");
    setEmail("");
    setDepartmentId("");
    setPositionId("");
    setRole("employee");
  }

  function deleteUser(userId: string) {
    mockDataStore.deleteUser(userId);
    setUsers(mockDataStore.getAllUsers());
  }

  return (
    <DashboardLayout title="User Management" subtitle="Add, search, and manage employees and admins">
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">User Directory</h2>
                  <p className="text-sm text-slate-600">Search and review active users.</p>
                </div>
                <Input
                  className="max-w-sm"
                  placeholder="Search users..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <p className="text-xs text-slate-500 mt-1">{user.role.replace(/_/g, " ")} • {mockDataStore.getDepartmentById(user.departmentId)?.name || "Unknown"}</p>
                      </div>
                      <Button variant="secondary" size="sm" onClick={() => deleteUser(user.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Create New User</h2>
            <div className="space-y-3">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Full Name" />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address" />
              <div className="grid grid-cols-2 gap-3">
                <select className="rounded border border-slate-300 px-3 py-2" value={role} onChange={(event) => setRole(event.target.value as User["role"])}>
                  {ROLES.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>{roleOption}</option>
                  ))}
                </select>
                <select className="rounded border border-slate-300 px-3 py-2" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
                  <option value="">Select department</option>
                  {mockDataStore.departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select className="rounded border border-slate-300 px-3 py-2" value={positionId} onChange={(event) => setPositionId(event.target.value)}>
                  <option value="">Select position</option>
                  {mockDataStore.positions.map((position) => (
                    <option key={position.id} value={position.id}>{position.title}</option>
                  ))}
                </select>
                <Button className="w-full" onClick={addUser}>Add User</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
