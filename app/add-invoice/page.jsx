"use client";
import React from "react";
import Information from "../components/Information";

export default function AddInvoice() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Create New Invoice</h1>
          <p className="text-gray-500 text-sm">Fill out your customer and rental details below.</p>
        </div>

        <Information />
      </div>
    </div>
  );
}
