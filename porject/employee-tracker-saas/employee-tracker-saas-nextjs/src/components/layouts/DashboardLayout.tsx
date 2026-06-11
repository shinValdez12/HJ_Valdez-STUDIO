"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, UserCheck, AlertCircle, Clock, DollarSign, BarChart3, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const navItems = [
    { label: "Dashboard", href: user?.role === "employee" ? "/employee" : "/admin" },
    ...(user?.role === "employee"
      ? [
          { label: "My Calendar", href: "/employee/calendar" },
          { label: "My Documents", href: "/employee/documents" },
          { label: "My Leave", href: "/employee/leaves" },
          { label: "Settings", href: "/settings" },
        ]
      : [
          { label: "Attendance", href: "/admin/attendance" },
          { label: "Leave Requests", href: "/admin/leaves" },
          { label: "Documents", href: "/admin/documents" },
          { label: "Departments", href: "/admin/departments" },
          { label: "Positions", href: "/admin/positions" },
          { label: "Calendar", href: "/admin/calendar" },
          { label: "Reports", href: "/admin/reports" },
          { label: "Security", href: "/admin/security" },
          { label: "Announcements", href: "/admin/announcements" },
          { label: "Holidays", href: "/admin/holidays" },
          { label: "Users", href: "/admin/users" },
          { label: "Company", href: "/admin/company" },
          { label: "Activity Logs", href: "/admin/activity-logs" },
          { label: "Settings", href: "/settings" },
        ]),
  ];

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("workforce_dark_mode", darkMode.toString());
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("workforce_dark_mode");
      setDarkMode(stored === "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm"
      >
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">WF</span>
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Workforce</h1>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setDarkMode(!darkMode)}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-3 hover:bg-slate-100 px-3 py-2 rounded-lg transition">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-blue-500 text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      {user?.role.replace(/_/g, " ")}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/settings">
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <Link href={user?.role === "employee" ? "/employee" : "/admin"}>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/80">
          <div className="max-w-7xl mx-auto px-6 py-3 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={`px-3 py-2 rounded-md transition ${pathname === item.href ? "bg-slate-200 text-slate-900" : "text-slate-600 hover:bg-slate-100"}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-slate-600 mt-2">{subtitle}</p>
          )}
        </motion.div>

        {/* Content */}
        {children}
      </main>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
  className?: string;
}

export function MetricCard({
  icon,
  label,
  value,
  change,
  trend,
  className = "",
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className={`bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {change !== undefined && (
            <p
              className={`text-xs mt-2 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "↑" : "↓"} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className="text-slate-400">{icon}</div>
      </div>
    </motion.div>
  );
}
