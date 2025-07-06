"use client";
import React from "react";
import Link from "next/link";
import { Car, FilePlus, Printer } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <Car className="w-10 h-10 text-indigo-600" />
          <h1 className="text-3xl font-bold tracking-wide">
            Billing Pro — Car Rental Invoicing
          </h1>
        </div>
        <p className="text-gray-500 text-sm">
          Create, manage and print your invoices easily.
        </p>
      </div>

      {/* Main Action Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Create Invoice Card */}
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4 bg-white shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
            <FilePlus className="w-5 h-5" /> Create Invoice
          </h2>
          <p className="text-gray-500 text-sm">
            Start a new invoice or update existing ones.
          </p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/add-invoice"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              ➕ New Invoice
            </Link>
            <Link
              href="/edit"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              ✏️ Edit Invoice
            </Link>
            <Link
              href="/duplicate"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              📑 Duplicate Invoice
            </Link>
          </div>
        </div>

        {/* Manage Invoices Card */}
        <div className="border border-gray-200 rounded-2xl p-6 space-y-4 bg-white shadow hover:shadow-md transition">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-indigo-700">
            <Printer className="w-5 h-5" /> Manage Invoices
          </h2>
          <p className="text-gray-500 text-sm">
            View, fetch, or print your invoices.
          </p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/fetch"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              🔍 Fetch All Invoices
            </Link>
            <Link
              href="/view"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              📄 View Invoice
            </Link>
            <Link
              href="/print"
              className="border border-indigo-600 text-indigo-700 rounded px-4 py-2 text-center hover:bg-indigo-600 hover:text-white transition"
            >
              🖨️ Print Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-gray-400 text-xs pt-8">
        © 2025 The Heritage Travels Billing System
      </div>
    </div>
  );
}
