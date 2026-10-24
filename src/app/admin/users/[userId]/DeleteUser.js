// src/app/admin/users/[userId]/DeleteUser.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteUser({ userId, userName }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
    } else {
      setBusy(false);
      alert("Failed to delete user.");
    }
  }

  return (
    <div className="rounded-lg border border-red/30 bg-red/5 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-red">Danger zone</h2>
      {!confirming ? (
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-text-grey">Permanently delete this customer and all their data.</p>
          <button onClick={() => setConfirming(true)} className="flex items-center gap-2 rounded-full bg-red px-4 py-2 text-sm font-semibold text-white hover:bg-red-dark">
            <Trash2 className="h-4 w-4" /> Delete user
          </button>
        </div>
      ) : (
        <div className="mt-3 space-y-3">
          <p className="text-sm font-medium text-red">Are you sure? This permanently deletes {userName}, all their accounts, and all transactions. This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={busy} className="rounded-full bg-red px-5 py-2 text-sm font-semibold text-white hover:bg-red-dark disabled:opacity-50">
              {busy ? "Deleting..." : "Yes, delete permanently"}
            </button>
            <button onClick={() => setConfirming(false)} disabled={busy} className="rounded-full border border-gray-400 px-5 py-2 text-sm font-semibold text-text-grey hover:bg-white disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
