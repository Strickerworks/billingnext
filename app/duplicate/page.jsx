"use client";
import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import Information from "../components/Information";

export default function DuplicateInvoice() {
  const [existingInvoiceNo, setExistingInvoiceNo] = useState("");
  const [newInvoiceNo, setNewInvoiceNo] = useState("");
  const [invoiceData, setInvoiceData] = useState(null);

  const handleFetchAndDuplicate = async () => {
    if (!existingInvoiceNo) {
      alert("Please enter existing Invoice No.");
      return;
    }

    if (!newInvoiceNo) {
      alert("Please enter New Invoice No.");
      return;
    }

    const { data, error } = await supabase
      .from("billdata")
      .select("*")
      .eq("invoice_no", existingInvoiceNo)
      .single();

    if (error) {
      alert("Invoice not found");
      console.error(error);
      return;
    }

    // Duplicate data and assign new invoice number
    const duplicateData = {
      ...data,
      invoice_no: newInvoiceNo,
    };

    setInvoiceData(duplicateData);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Duplicate an Invoice</h1>
          <p className="text-gray-500 text-sm">
            Fetch an existing invoice and create a new copy with a new invoice number.
          </p>
        </div>

        {!invoiceData && (
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <input
              type="text"
              value={existingInvoiceNo}
              onChange={(e) => setExistingInvoiceNo(e.target.value)}
              placeholder="Enter Existing Invoice No."
              className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              value={newInvoiceNo}
              onChange={(e) => setNewInvoiceNo(e.target.value)}
              placeholder="Enter New Invoice No."
              className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleFetchAndDuplicate}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Fetch & Create Duplicate
            </button>
          </div>
        )}

        {invoiceData && <Information initialData={invoiceData} mode="duplicate" />}
      </div>
    </div>
  );
}
