// src/app/admin/users/[userId]/ResetCredentials.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetCredentials({ userId }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const res = await fetch(`/api/admin/users/${userId}/credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, pin }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMsg(data.error || "Failed.");
      return;
    }

    setMsg("✅ Updated.");
    setPassword("");
    setPin("");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-navy">
        Reset login details
      </h2>
      <p className="mt-1 text-xs text-text-grey">
        Leave a field blank to keep it unchanged.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="New password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          <input
            type="text"
            placeholder="New 4-digit PIN"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy sm:w-40"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50"
          >
            Update
          </button>
        </div>
        {msg && <p className="text-sm font-medium text-text-grey">{msg}</p>}
      </form>
    </div>
  );
}
