// src/app/admin/users/[userId]/AccountAdmin.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Check, X } from "lucide-react";

function money(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

const typeLabel = { checking: "Checking", savings: "Savings", credit: "Credit Card" };

export default function AccountAdmin({ account }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const [balance, setBalance] = useState(account.balance);
  const [freezeMsg, setFreezeMsg] = useState(account.freezeMessage || "");
  const [tx, setTx] = useState({ type: "credit", amount: "", description: "", label: "" });

  // which transaction is being edited, and its editable values
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({ type: "credit", amount: "", description: "", label: "" });

  async function post(url, body, method = "POST") {
    setBusy(true);
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    router.refresh();
  }

  async function saveBalance(e) {
    e.preventDefault();
    await post(`/api/admin/accounts/${account.id}/balance`, { balance });
  }

  async function toggleFreeze() {
    await post(`/api/admin/accounts/${account.id}/freeze`, {
      frozen: !account.frozen,
      freezeMessage: freezeMsg,
    });
  }

    async function toggleBlockTransfer() {
    await post(`/api/admin/accounts/${account.id}/block-transfer`, {
      blockTransfer: !account.blockTransfer,
    });
  }

  async function addTx(e) {
    e.preventDefault();
    await post(`/api/admin/accounts/${account.id}/transactions`, tx);
    setTx({ type: "credit", amount: "", description: "", label: "" });
  }

  async function deleteTx(id) {
    await post(`/api/admin/transactions/${id}`, null, "DELETE");
  }

  // start editing a transaction: fill the edit form with its current values
  function startEdit(t) {
    setEditingId(t.id);
    setEdit({
      type: t.type,
      amount: t.amount,
      description: t.description,
      label: t.label || "",
    });
  }

  async function saveEdit(id) {
    await post(`/api/admin/transactions/${id}`, edit, "PATCH");
    setEditingId(null);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 bg-grey-bg px-5 py-3">
        <div>
          <span className="text-sm font-bold text-navy">
            {typeLabel[account.type] || account.type}
          </span>
          <span className="ml-2 text-xs text-text-grey">••••{account.accountNumber.slice(-4)}</span>
        </div>
        <span className="text-sm font-bold text-navy">{money(account.balance)}</span>
      </div>

      <div className="space-y-5 p-5">
        {/* Update balance */}
        <form onSubmit={saveBalance} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-navy">Set balance</label>
            <input
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50"
          >
            Save
          </button>
        </form>

        {/* Freeze */}
        <div className="rounded-md bg-grey-bg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">
              {account.frozen ? "Account is FROZEN" : "Account is active"}
            </span>
            <button
              onClick={toggleFreeze}
              disabled={busy}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                account.frozen
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red text-white hover:bg-red-dark"
              }`}
            >
              {account.frozen ? "Unfreeze" : "Freeze"}
            </button>
          </div>
          {!account.frozen && (
            <input
              type="text"
              placeholder="Freeze message (shown to customer)"
              value={freezeMsg}
              onChange={(e) => setFreezeMsg(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-400 px-3 py-2 text-xs outline-none focus:border-navy"
            />
          )}
        </div>


                {/* Block transfers */}
        <div className="rounded-md bg-grey-bg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-navy">
                {account.blockTransfer ? "Transfers BLOCKED" : "Transfers allowed"}
              </span>
              <p className="text-xs text-text-grey">
                {account.blockTransfer
                  ? "Customer sees the freeze message when transferring from this account."
                  : "Customer can transfer from this account normally."}
              </p>
            </div>
            <button
              onClick={toggleBlockTransfer}
              disabled={busy}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold disabled:opacity-50 ${
                account.blockTransfer
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red text-white hover:bg-red-dark"
              }`}
            >
              {account.blockTransfer ? "Allow transfers" : "Block transfers"}
            </button>
          </div>
        </div>

        {/* Add transaction */}
        <form onSubmit={addTx} className="space-y-2 rounded-md border border-gray-200 p-3">
          <p className="text-xs font-bold uppercase text-text-grey">Add transaction</p>
          <div className="flex gap-2">
            <select
              value={tx.type}
              onChange={(e) => setTx({ ...tx, type: e.target.value })}
              className="rounded-md border border-gray-400 px-2 py-2 text-sm outline-none focus:border-navy"
            >
              <option value="credit">Credit (+)</option>
              <option value="debit">Debit (−)</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={tx.amount}
              onChange={(e) => setTx({ ...tx, amount: e.target.value })}
              required
              className="w-28 rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy"
            />
            <input
              type="text"
              placeholder="Description"
              value={tx.description}
              onChange={(e) => setTx({ ...tx, description: e.target.value })}
              required
              className="flex-1 rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy"
            />
          </div>
          <input
            type="text"
            placeholder="Label (optional, e.g. 'ATM Deposit')"
            value={tx.label}
            onChange={(e) => setTx({ ...tx, label: e.target.value })}
            className="w-full rounded-md border border-gray-400 px-3 py-2 text-sm outline-none focus:border-navy"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-light disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {/* Existing transactions */}
        {account.transactions.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase text-text-grey">
              Transactions ({account.transactions.length})
            </p>
            <ul className="divide-y divide-gray-100">
              {account.transactions.map((t) => (
                <li key={t.id} className="py-2 text-sm">
                  {editingId === t.id ? (
                    /* EDIT MODE */
                    <div className="space-y-2 rounded-md bg-grey-bg p-2">
                      <div className="flex gap-2">
                        <select
                          value={edit.type}
                          onChange={(e) => setEdit({ ...edit, type: e.target.value })}
                          className="rounded-md border border-gray-400 px-2 py-1 text-sm outline-none focus:border-navy"
                        >
                          <option value="credit">Credit (+)</option>
                          <option value="debit">Debit (−)</option>
                        </select>
                        <input
                          type="number"
                          step="0.01"
                          value={edit.amount}
                          onChange={(e) => setEdit({ ...edit, amount: e.target.value })}
                          className="w-24 rounded-md border border-gray-400 px-2 py-1 text-sm outline-none focus:border-navy"
                        />
                        <input
                          type="text"
                          value={edit.description}
                          onChange={(e) => setEdit({ ...edit, description: e.target.value })}
                          className="flex-1 rounded-md border border-gray-400 px-2 py-1 text-sm outline-none focus:border-navy"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Label (optional)"
                        value={edit.label}
                        onChange={(e) => setEdit({ ...edit, label: e.target.value })}
                        className="w-full rounded-md border border-gray-400 px-2 py-1 text-sm outline-none focus:border-navy"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(t.id)}
                          disabled={busy}
                          className="flex items-center gap-1 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white hover:bg-navy-light disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center gap-1 rounded-full border border-gray-400 px-3 py-1 text-xs font-semibold text-text-grey hover:bg-white"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE */
                    <div className="flex items-center justify-between">
                      <span className="text-text-grey">
                        <span className={t.type === "credit" ? "text-green-700" : "text-red"}>
                          {t.type === "credit" ? "+" : "−"}
                          {money(t.amount)}
                        </span>{" "}
                        · {t.description}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => startEdit(t)}
                          disabled={busy}
                          className="text-navy hover:text-navy-light disabled:opacity-50"
                          aria-label="Edit transaction"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteTx(t.id)}
                          disabled={busy}
                          className="text-red hover:text-red-dark disabled:opacity-50"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
