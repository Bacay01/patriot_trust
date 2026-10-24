// src/app/dashboard/transfer/TransferForm.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

const typeLabel = { checking: "Checking", savings: "Savings", credit: "Credit Card" };

export default function TransferForm({ accounts }) {
  const router = useRouter();

  const [step, setStep] = useState("details"); // "details" | "review" | "success"
  const [mode, setMode] = useState("internal"); // "internal" | "external"
  const [form, setForm] = useState({
    fromAccountId: accounts[0]?.id || "",
    toAccountId: "",
    toAccountNumber: "",
    recipientName: "",
    amount: "",
    description: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Human-readable names for the review screen
  const fromAccount = accounts.find((a) => a.id === form.fromAccountId);
  const toAccountInternal = accounts.find((a) => a.id === form.toAccountId);

  const recipientLabel =
    mode === "internal"
      ? toAccountInternal
        ? `your ${typeLabel[toAccountInternal.type] || toAccountInternal.type} account`
        : "—"
      : form.recipientName
        ? `${form.recipientName} (••${form.toAccountNumber.slice(-4)})`
        : `account ••${form.toAccountNumber.slice(-4)}`;

  // Step 1 → validate basics, then move to review
  function goToReview(e) {
    e.preventDefault();
    setError("");

    const value = Number(form.amount);
    if (isNaN(value) || value <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (mode === "internal" && !form.toAccountId) {
      setError("Choose a destination account.");
      return;
    }
    if (mode === "external" && !form.toAccountNumber) {
      setError("Enter the recipient's account number.");
      return;
    }
    setStep("review");
  }

  // Step 2 → submit with PIN
  async function confirmSend(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, mode }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error || "Transfer failed.");
      return;
    }

    setStep("success");
    router.refresh();
  }

  function reset() {
    setForm({
      fromAccountId: accounts[0]?.id || "",
      toAccountId: "",
      toAccountNumber: "",
      recipientName: "",
      amount: "",
      description: "",
      pin: "",
    });
    setError("");
    setMode("internal");
    setStep("details");
  }

  // ---------- SUCCESS SCREEN ----------
  if (step === "success") {
    return (
      <div className="overflow-hidden rounded-xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-9 w-9 text-green-600" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-navy">Transfer successful</h2>
        <p className="mt-2 text-sm text-text-grey">
          You have successfully sent{" "}
          <span className="font-bold text-navy">{money(form.amount)}</span> to{" "}
          <span className="font-bold text-navy">{recipientLabel}</span>.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
          >
            Done
          </button>
          <button
            onClick={reset}
            className="rounded-full border border-navy px-6 py-2.5 text-sm font-semibold text-navy hover:bg-navy hover:text-white"
          >
            Make another transfer
          </button>
        </div>
      </div>
    );
  }

  // ---------- REVIEW SCREEN ----------
  if (step === "review") {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="flex h-1.5 w-full">
          <div className="h-full w-3/5 bg-red" />
          <div className="h-full w-2/5 bg-navy" />
        </div>

        <div className="p-6">
          <button
            onClick={() => { setStep("details"); setError(""); }}
            className="mb-4 flex items-center gap-1 text-sm font-semibold text-text-grey hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Edit details
          </button>

          <h2 className="text-lg font-bold text-navy">Review transfer</h2>

          {/* Summary */}
          <div className="mt-4 space-y-3 rounded-lg bg-grey-bg p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-grey">Amount</span>
              <span className="font-bold text-navy">{money(form.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-grey">From</span>
              <span className="font-semibold text-navy">
                {fromAccount ? `${typeLabel[fromAccount.type]} ••${fromAccount.accountNumber.slice(-4)}` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-grey">To</span>
              <span className="font-semibold text-navy">{recipientLabel}</span>
            </div>
            {form.description && (
              <div className="flex justify-between">
                <span className="text-text-grey">Note</span>
                <span className="font-semibold text-navy">{form.description}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">{error}</div>
          )}

          {/* PIN step */}
          <form onSubmit={confirmSend} className="mt-5">
            <label htmlFor="pin" className="block text-sm font-bold text-navy">
              Enter your PIN to confirm
            </label>
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={form.pin}
              onChange={handleChange}
              required
              autoFocus
              className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2.5 text-center text-lg tracking-widest outline-none focus:border-navy"
            />
            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full rounded-full bg-navy px-6 py-3 text-base font-semibold text-white hover:bg-navy-light disabled:opacity-60"
            >
              {busy ? "Sending..." : "Confirm & send"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------- DETAILS SCREEN ----------
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="flex h-1.5 w-full">
        <div className="h-full w-3/5 bg-red" />
        <div className="h-full w-2/5 bg-navy" />
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setMode("internal"); setError(""); }}
          className={`flex-1 px-4 py-3 text-sm font-semibold ${
            mode === "internal" ? "border-b-2 border-navy text-navy" : "text-text-grey"
          }`}
        >
          Between my accounts
        </button>
        <button
          onClick={() => { setMode("external"); setError(""); }}
          className={`flex-1 px-4 py-3 text-sm font-semibold ${
            mode === "external" ? "border-b-2 border-navy text-navy" : "text-text-grey"
          }`}
        >
          Send to someone
        </button>
      </div>

      <form onSubmit={goToReview} className="space-y-4 p-6">
        {error && (
          <div className="rounded-md bg-red/10 px-4 py-3 text-sm font-medium text-red">{error}</div>
        )}

        <div>
          <label htmlFor="fromAccountId" className="block text-sm font-bold text-navy">From</label>
          <select
            id="fromAccountId"
            name="fromAccountId"
            value={form.fromAccountId}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {typeLabel[a.type] || a.type} ••{a.accountNumber.slice(-4)} — {money(a.balance)}
              </option>
            ))}
          </select>
        </div>

        {mode === "internal" ? (
          <div>
            <label htmlFor="toAccountId" className="block text-sm font-bold text-navy">To</label>
            <select
              id="toAccountId"
              name="toAccountId"
              value={form.toAccountId}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
            >
              <option value="">Choose an account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {typeLabel[a.type] || a.type} ••{a.accountNumber.slice(-4)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-bold text-navy">Recipient name</label>
              <input
                id="recipientName"
                name="recipientName"
                type="text"
                placeholder="e.g. John Smith"
                value={form.recipientName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
              />
            </div>
            <div>
              <label htmlFor="toAccountNumber" className="block text-sm font-bold text-navy">Recipient account number</label>
              <input
                id="toAccountNumber"
                name="toAccountNumber"
                type="text"
                inputMode="numeric"
                placeholder="10-digit account number"
                value={form.toAccountNumber}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="amount" className="block text-sm font-bold text-navy">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-navy">
            Description <span className="font-normal text-text-grey">(optional)</span>
          </label>
          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Rent, Savings top-up"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2.5 text-sm outline-none focus:border-navy"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-navy px-6 py-3 text-base font-semibold text-white hover:bg-navy-light"
        >
          Continue
        </button>
      </form>
    </div>
  );
}