"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Information from "../components/Information";

export default function EditInvoice() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  const handleFetchInvoice = async () => {
    if (!invoiceNo) {
      alert("Please enter Invoice No.");
      return;
    }

    const { data, error } = await supabase
      .from("billdata")
      .select("*")
      .eq("invoice_no", invoiceNo)
      .single();

    if (error) {
      alert("Invoice not found");
      console.error(error);
      return;
    }

    setInvoiceData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Edit Existing Invoice</h1>
          <p className="text-gray-500 text-sm">Retrieve your invoice by number and make changes below.</p>
        </div>

        {!invoiceData && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              placeholder="Enter Invoice Number"
              className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleFetchInvoice}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Fetch Invoice
            </button>
          </div>
        )}

        {invoiceData && (
          <Information initialData={invoiceData} />
        )}
      </div>
    </div>
  );
}
