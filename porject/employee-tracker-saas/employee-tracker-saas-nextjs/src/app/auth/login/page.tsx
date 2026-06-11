"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("admin@workforce.demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "super_admin" | "department_admin" | "employee"
  >("super_admin");

  const roleCredentials = {
    super_admin: {
      email: "admin@workforce.demo",
      password: "demo123",
    },
    department_admin: {
      email: "manager@workface.demo",
      password: "demo123",
    },
    employee: {
      email: "employee@workface.demo",
      password: "demo123",
    },
  };

  const handleRoleSelect = (role: "super_admin" | "department_admin" | "employee") => {
    setSelectedRole(role);
    const creds = roleCredentials[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (success) {
      router.push("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-block"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">WF</span>
              </div>
              <span className="text-white font-semibold text-xl">Workforce</span>
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">
            Hybrid Workforce Management Platform
          </p>
        </div>

        {/* Demo Roles */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(
            [
              {
                id: "super_admin",
                label: "Super Admin",
                icon: "👨‍💼",
              },
              {
                id: "department_admin",
                label: "Manager",
                icon: "👩‍💼",
              },
              {
                id: "employee",
                label: "Employee",
                icon: "👨‍💻",
              },
            ] as const
          ).map((role) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRoleSelect(role.id)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedRole === role.id
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
              }`}
            >
              <div className="text-2xl mb-1">{role.icon}</div>
              <div className="text-xs font-semibold text-white">
                {role.label}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-2xl backdrop-blur-sm"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold h-10"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-slate-400"
        >
          <p className="mb-4">
            This is a demo environment. Use the pre-filled credentials.
          </p>
          <p>
            Demo credentials are automatically filled for each role above.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-xs text-slate-500"
        >
          <p>
            Demo Account | Not for production use
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
