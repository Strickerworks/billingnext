"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function FetchInvoice() {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchAllInvoices();
  }, []);

  const fetchAllInvoices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("billdata")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invoices:", error);
      alert("Could not load invoices.");
    } else {
      setInvoices(data);
    }
    setLoading(false);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const term = searchTerm.toLowerCase();
    return (
      invoice.invoice_no?.toLowerCase().includes(term) ||
      invoice.customer_name?.toLowerCase().includes(term) ||
      invoice.customer_gst?.toLowerCase().includes(term)
    );
  });

  const handleView = (invoice_no) => {
    router.push(`/view/${invoice_no}`);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "—";
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Manage Invoices</h1>
          <p className="text-gray-500 text-sm">View or manage your invoices.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Invoice No, Customer Name or GST"
              className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading invoices...</div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No invoices found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-3 border">Invoice No.</th>
                    <th className="p-3 border">Customer Name</th>
                    <th className="p-3 border">Customer GST</th>
                    <th className="p-3 border">Date</th>
                    <th className="p-3 border text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="p-3 border">{inv.invoice_no}</td>
                      <td className="p-3 border">{inv.customer_name}</td>
                      <td className="p-3 border">{inv.customer_gst}</td>
                      <td className="p-3 border">{formatDate(inv.created_at)}</td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleView(inv.invoice_no)}
                          className="px-4 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
