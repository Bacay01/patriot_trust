// src/app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "", pin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      pin: form.pin,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email, password, or PIN.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Top brand bar */}
      <header className="w-full border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-xl font-extrabold text-navy sm:text-2xl">
            Patriot<span className="text-red">Trust</span>
          </span>
          <a href="/signup" className="text-sm text-text-grey hover:text-navy">
            Enroll
          </a>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
        <h1 className="text-center text-3xl font-bold text-navy sm:text-4xl md:text-5xl">
          Log in to Online Banking
        </h1>

        {/* Login card */}
        <div className="mt-8 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 sm:mt-10">
          <div className="flex h-1.5 w-full">
            <div className="h-full w-3/5 bg-red" />
            <div className="h-full w-2/5 bg-navy" />
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-4 rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-navy">
                  Email / User ID
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
                <div className="relative mt-2">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-400 px-3 py-2.5 pr-10 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-grey hover:text-navy"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

                            <div>
                <label htmlFor="pin" className="block text-sm font-bold text-navy">
                  4-digit PIN
                </label>
                <div className="relative mt-2">
                  <input
                    id="pin"
                    name="pin"
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    maxLength={4}
                    value={form.pin}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-400 px-3 py-2.5 pr-10 text-sm text-text-grey outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-grey hover:text-navy"
                    aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPin ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input id="save" type="checkbox" className="h-5 w-5 accent-navy" />
                <label htmlFor="save" className="text-sm text-text-grey">
                  Save user ID
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-navy px-6 py-3 text-base font-semibold text-white hover:bg-navy-light disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <a href="#" className="block text-sm font-semibold text-blue-700 underline hover:text-navy">
                Forgot user ID/password
              </a>
              <div className="flex items-center justify-center gap-4">
                <a href="#" className="text-sm font-semibold text-blue-700 underline hover:text-navy">
                  Security &amp; Help
                </a>
                <a href="/signup" className="text-sm font-semibold text-blue-700 underline hover:text-navy">
                  Enroll
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}