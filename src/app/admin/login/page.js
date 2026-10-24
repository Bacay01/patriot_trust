// src/app/admin/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex h-1.5 w-full">
          <div className="h-full w-3/5 bg-red" />
          <div className="h-full w-2/5 bg-navy" />
        </div>

        <div className="p-8">
          <h1 className="text-xl font-bold text-navy">Admin Console</h1>
          <p className="mt-1 text-sm text-text-grey">PatriotTrust staff login</p>

          {error && (
            <div className="mt-4 rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-navy">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-navy">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}