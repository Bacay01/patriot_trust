// src/app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    userId: "",
    password: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Updates whichever field changed
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      // Success → go to login
      router.push("/login");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Top brand bar */}
      <header className="w-full border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-xl font-extrabold text-navy sm:text-2xl">
            Bank Of<span className="text-red">America</span>
          </span>
          <a href="/login" className="text-sm text-text-grey hover:text-navy">
            Already enrolled? Log in
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
        <h1 className="text-center text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
          Enroll in Online Banking
        </h1>
        <p className="mt-3 max-w-md text-center text-sm text-text-grey sm:text-base">
          Set up secure access to your accounts in a few steps.
        </p>

        {/* Signup card */}
        <div className="mt-8 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 sm:mt-10">
          <div className="flex h-1.5 w-full">
            <div className="h-full w-3/5 bg-red" />
            <div className="h-full w-2/5 bg-navy" />
          </div>

          <div className="p-6 sm:p-8">
            {/* Error banner */}
            {error && (
              <div className="mb-4 rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-navy">
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-navy">
                  Email address
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
                <label htmlFor="userId" className="block text-sm font-bold text-navy">
                  Create User ID
                </label>
                <input
                  id="userId"
                  name="userId"
                  type="text"
                  value={form.userId}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-navy">
                  Create Password
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
                <p className="mt-1 text-xs text-text-grey">
                  At least 8 characters, with a number and a letter.
                </p>
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-bold text-navy">
                  Create 4-digit PIN
                </label>
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={form.pin}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
                <p className="mt-1 text-xs text-text-grey">
                  Used to confirm logins and transactions.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-navy px-6 py-3 text-base font-semibold text-white hover:bg-navy-light disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Enroll now"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-text-grey">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-700 underline hover:text-navy">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}