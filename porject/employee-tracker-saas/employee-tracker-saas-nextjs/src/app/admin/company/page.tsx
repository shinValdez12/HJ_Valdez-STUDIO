"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { mockDataStore } from "@/mock/store";
import { Company } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCompanyPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState<Company["status"]>("active");

  useEffect(() => {
    setCompanies(mockDataStore.getCompanies());
    setPlan(mockDataStore.getSubscriptionPlans()[0]?.name || "");
  }, []);

  function addCompany() {
    if (!name.trim() || !industry.trim() || !headquarters.trim()) return;
    mockDataStore.createCompany({
      name,
      industry,
      headquarters,
      employeeCount: Math.floor(Math.random() * 300) + 20,
      subscriptionPlan: plan,
      status,
    });
    setCompanies(mockDataStore.getCompanies());
    setName("");
    setIndustry("");
    setHeadquarters("");
    setStatus("active");
  }

  function toggleCompanyStatus(company: Company) {
    mockDataStore.updateCompany(company.id, {
      status: company.status === "active" ? "suspended" : "active",
    });
    setCompanies(mockDataStore.getCompanies());
  }

  return (
    <DashboardLayout title="Company Management" subtitle="Manage customers, subscriptions, and platform accounts">
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Companies</h2>
              <p className="text-sm text-slate-600">Review active accounts and subscription tiers.</p>
            </div>
            <div className="space-y-3">
              {companies.map((company) => (
                <div key={company.id} className="p-4 border rounded-lg bg-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{company.name}</p>
                    <p className="text-sm text-slate-500">{company.industry} • {company.headquarters}</p>
                    <p className="text-xs text-slate-500 mt-1">Employees: {company.employeeCount} • Plan: {company.subscriptionPlan}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs ${company.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {company.status}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => toggleCompanyStatus(company)}>
                      {company.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">Create New Company</h2>
            <div className="space-y-3">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Company name" />
              <Input value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Industry" />
              <Input value={headquarters} onChange={(event) => setHeadquarters(event.target.value)} placeholder="Headquarters" />
              <select className="w-full rounded border border-slate-300 px-3 py-2" value={plan} onChange={(event) => setPlan(event.target.value)}>
                {mockDataStore.getSubscriptionPlans().map((planOption) => (
                  <option key={planOption.id} value={planOption.name}>{planOption.name}</option>
                ))}
              </select>
              <select className="w-full rounded border border-slate-300 px-3 py-2" value={status} onChange={(event) => setStatus(event.target.value as Company["status"])}>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="trial">Trial</option>
              </select>
              <Button className="w-full" onClick={addCompany}>Add Company</Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
