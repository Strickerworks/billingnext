"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export default function Information({ initialData = null, mode = "default" }) {
  const router = useRouter();

  const [billDate, setBillDate] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerGST, setCustomerGST] = useState("");

  const [cgst, setCgst] = useState(0);
  const [sgst, setSgst] = useState(0);
  const [igst, setIgst] = useState(0);

  const [contentRows, setContentRows] = useState([]);
  const [additionalRows, setAdditionalRows] = useState([]);

  const [tableTotal, setTableTotal] = useState(0);
  const [additionalTotal, setAdditionalTotal] = useState(0);

  const [paymentAccount, setPaymentAccount] = useState("");

  useEffect(() => {
    if (initialData) {
      setBillDate(initialData.bill_date);
      setInvoiceNo(initialData.invoice_no);
      setCustomerName(initialData.customer_name);
      setCustomerGST(initialData.customer_gst);
      setCgst(initialData.cgst_percentage);
      setSgst(initialData.sgst_percentage);
      setIgst(initialData.igst_percentage);
      setPaymentAccount(initialData.payment_account);
      setContentRows(initialData.content);
      setAdditionalRows(initialData.additional_charges);
    }
  }, [initialData]);

  const addContentRow = () => {
    setContentRows([
      ...contentRows,
      {
        sno: contentRows.length + 1,
        description: "",
        unit: 1,
        rate: 100,
        amount: 100,
      },
    ]);
  };

  const deleteContentRow = (index) => {
    const updatedRows = [...contentRows];
    updatedRows.splice(index, 1);
    updatedRows.forEach((row, idx) => (row.sno = idx + 1));
    setContentRows(updatedRows);
  };

  const addAdditionalRow = () => {
    setAdditionalRows([
      ...additionalRows,
      { sno: additionalRows.length + 1, description: "", amount: 0 },
    ]);
  };

  const deleteAdditionalRow = (index) => {
    const updatedRows = [...additionalRows];
    updatedRows.splice(index, 1);
    updatedRows.forEach((row, idx) => (row.sno = idx + 1));
    setAdditionalRows(updatedRows);
  };

  const updateContentRow = (index, field, value) => {
    const updatedRows = [...contentRows];
    updatedRows[index][field] = value;
    if (field === "unit" || field === "rate") {
      const unit = parseFloat(updatedRows[index].unit) || 0;
      const rate = parseFloat(updatedRows[index].rate) || 0;
      updatedRows[index].amount = unit * rate;
    }
    setContentRows(updatedRows);
  };

  const updateAdditionalRow = (index, field, value) => {
    const updatedRows = [...additionalRows];
    updatedRows[index][field] = value;
    setAdditionalRows(updatedRows);
  };

  useEffect(() => {
    const total = contentRows.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0
    );
    setTableTotal(total);

    const addTotal = additionalRows.reduce(
      (sum, row) => sum + parseFloat(row.amount || 0),
      0
    );
    setAdditionalTotal(addTotal);
  }, [contentRows, additionalRows]);

  const cgstTotal = (tableTotal * parseFloat(cgst || 0)) / 100;
  const sgstTotal = (tableTotal * parseFloat(sgst || 0)) / 100;
  const igstTotal = (tableTotal * parseFloat(igst || 0)) / 100;

  const finalTotal = tableTotal + cgstTotal + sgstTotal + igstTotal;
  const grandTotal = finalTotal + additionalTotal;

  const handleSaveInvoice = async () => {
    if (!billDate || !invoiceNo || !customerName || !customerGST) {
      alert("Please fill in Date, Invoice No, Customer Name and Customer GST No.");
      return;
    }

    const bill = {
      bill_date: billDate,
      invoice_no: invoiceNo,
      customer_name: customerName,
      customer_gst: customerGST,
      cgst_percentage: parseFloat(cgst),
      sgst_percentage: parseFloat(sgst),
      igst_percentage: parseFloat(igst),
      payment_account: paymentAccount,
      content: contentRows.map((row) => ({
        sno: row.sno,
        description: row.description,
        unit: parseFloat(row.unit),
        rate: parseFloat(row.rate),
        amount: parseFloat(row.amount),
      })),
      additional_charges: additionalRows.map((row) => ({
        sno: row.sno,
        description: row.description,
        amount: parseFloat(row.amount),
      })),
      table_total: parseFloat(tableTotal.toFixed(2)),
      cgst_total: parseFloat(cgstTotal.toFixed(2)),
      sgst_total: parseFloat(sgstTotal.toFixed(2)),
      igst_total: parseFloat(igstTotal.toFixed(2)),
      final_total: parseFloat(finalTotal.toFixed(2)),
      additional_total: parseFloat(additionalTotal.toFixed(2)),
      grand_total: parseFloat(grandTotal.toFixed(2)),
    };

    let result;
    if (mode === "duplicate") {
      result = await supabase.from("billdata").insert([bill]);
    } else if (initialData) {
      result = await supabase.from("billdata").update(bill).eq("invoice_no", invoiceNo);
    } else {
      result = await supabase.from("billdata").insert([bill]);
    }

    const { error } = result;
    if (error) {
      alert("Error saving invoice");
      console.error(error);
    } else {
      alert("Invoice saved successfully!");
      router.push("/");
    }

  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Invoice Information</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" />
        <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="Invoice No" />
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="Customer Name" />
        <input type="text" value={customerGST} onChange={(e) => setCustomerGST(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="Customer GST No" />
        <input type="number" step="0.01" value={cgst} onChange={(e) => setCgst(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="CGST (%)" />
        <input type="number" step="0.01" value={sgst} onChange={(e) => setSgst(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="SGST (%)" />
        <input type="number" step="0.01" value={igst} onChange={(e) => setIgst(e.target.value)} className="border border-gray-300 w-full p-3 rounded-lg" placeholder="IGST (%)" />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Invoice Items</h3>
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate (₹)</th>
              <th className="border p-2">Amount (₹)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contentRows.map((row, index) => (
              <tr key={row.sno}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2"><textarea className="border w-full p-2 rounded-lg resize-y min-h-[60px]" value={row.description} onChange={(e) => updateContentRow(index, "description", e.target.value)} /></td>
                <td className="border p-2"><input type="number" className="border w-full p-2 rounded-lg" value={row.unit} onChange={(e) => updateContentRow(index, "unit", e.target.value)} /></td>
                <td className="border p-2"><input type="number" className="border w-full p-2 rounded-lg" value={row.rate} onChange={(e) => updateContentRow(index, "rate", e.target.value)} /></td>
                <td className="border p-2 text-right">{row.amount.toFixed(2)}</td>
                <td className="border p-2 text-center"><button onClick={() => deleteContentRow(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addContentRow} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">+ Add Row</button>
      </div>

      {/* Totals */}
      <div className="space-y-1 text-gray-800 text-sm">
        <div>Table Total: ₹ {tableTotal.toFixed(2)}</div>
        <div>CGST Total: ₹ {cgstTotal.toFixed(2)}</div>
        <div>SGST Total: ₹ {sgstTotal.toFixed(2)}</div>
        <div>IGST Total: ₹ {igstTotal.toFixed(2)}</div>
        <div className="font-semibold text-base">Final Total: ₹ {finalTotal.toFixed(2)}</div>
      </div>

      {/* Additional Charges */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Charges (No GST)</h3>
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount (₹)</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {additionalRows.map((row, index) => (
              <tr key={row.sno}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2"><input type="text" className="border w-full p-2 rounded-lg" value={row.description} onChange={(e) => updateAdditionalRow(index, "description", e.target.value)} /></td>
                <td className="border p-2"><input type="number" className="border w-full p-2 rounded-lg" value={row.amount} onChange={(e) => updateAdditionalRow(index, "amount", e.target.value)} /></td>
                <td className="border p-2 text-center"><button onClick={() => deleteAdditionalRow(index)} className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-xs">✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addAdditionalRow} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">+ Add Charge</button>
        <div className="mt-3 text-gray-800">Additional Total: ₹ {additionalTotal.toFixed(2)}</div>
      </div>

      <div>
        <label className="block font-medium text-gray-800 mb-1">Select Payment Account</label>
        <select className="border w-full p-3 rounded-lg" value={paymentAccount} onChange={(e) => setPaymentAccount(e.target.value)}>
          <option value="">Select Account</option>
          <option value="Bank of India - THE HERITAGE TRAVEL">Bank of India - THE HERITAGE TRAVEL</option>
          <option value="ICICI Bank - THE HERITAGE GROUP">ICICI Bank - THE HERITAGE GROUP</option>
        </select>
      </div>

      <div className="text-lg font-bold text-gray-800">
        Grand Total (Final + Additional): ₹ {grandTotal.toFixed(2)}
      </div>

      <button onClick={handleSaveInvoice} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Save Invoice</button>
    </div>
  );
}
