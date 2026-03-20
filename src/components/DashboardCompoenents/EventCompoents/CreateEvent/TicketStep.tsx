"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Interface updated to match your backend payload (ticketTypes)
interface Ticket {
  name: string;
  price: number;
  total_quantity: number; // Renamed from capacity
  is_published: boolean;
  is_display: boolean;
}

export function TicketStep({
  tickets,
  setTickets,
  onNext,
  onBack,
  isSubmitting,
}: {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}) {
  // Local Form State (Temporary input)
  const [ticketName, setTicketName] = useState("Standing");
  const [price, setPrice] = useState("0");
  const [capacity, setCapacity] = useState("10");

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<Ticket | null>(null);

  const handleAddTicket = () => {
    if (!ticketName) return alert("Please enter ticket name");

    // ១. ឆែកមើលថាឈ្មោះ Ticket នេះមានក្នុង List រួចហើយឬនៅ (Case-insensitive)
    const isDuplicate = tickets.some(
      (t) => t.name.toLowerCase() === ticketName.toLowerCase(),
    );

    if (isDuplicate) {
      alert("ឈ្មោះ Ticket នេះមានរួចហើយ! សូមប្រើឈ្មោះផ្សេង។");
      return; // បញ្ឈប់ការដំនើរការ បើជាន់គ្នា
    }

    const numericPrice = parseFloat(price) || 0;
    const newTicket: Ticket = {
      name: ticketName.toUpperCase(),
      price: numericPrice,
      total_quantity: parseInt(capacity) || 1,
      is_published: true,
      is_display: true,
    };

    setTickets([...tickets, newTicket]);

    // Reset form
    setTicketName(""); // Reset ឈ្មោះផងដែរ
    setPrice("0");
    setCapacity("10");
  };

  const handleDelete = (index: number) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const openEditModal = (ticket: Ticket, index: number) => {
    setEditData({ ...ticket });
    setEditingIndex(index);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editData) {
      // ឆែកមើលឈ្មោះថ្មី កុំឱ្យជាន់ជាមួយ Ticket ផ្សេងទៀត (លើកលែងតែខ្លួនឯង)
      const isDuplicate = tickets.some(
        (t, index) =>
          index !== editingIndex &&
          t.name.toLowerCase() === editData.name.toLowerCase(),
      );

      if (isDuplicate) {
        alert("ឈ្មោះ Ticket ថ្មីនេះមានរួចហើយ!");
        return;
      }

      const updatedTickets = [...tickets];
      updatedTickets[editingIndex] = {
        ...editData,
        name: editData.name.toUpperCase(),
      };
      setTickets(updatedTickets);
      setIsEditOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-full space-y-8">
      {/* 1. TICKET INFO FORM */}
      <div className="space-y-5 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Ticket Info
        </h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Ticket Name <span className="text-red-500">*</span>
            </label>
            <input
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-purple-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-center outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Ticket Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full rounded-lg border border-slate-200 p-3 text-center outline-none"
            />
          </div>
        </div>
        <button
          onClick={handleAddTicket}
          className="w-full rounded-lg bg-[#310a24] py-4 font-semibold text-white hover:bg-[#4a1036]"
        >
          Add Ticket
        </button>
      </div>

      {/* 2. YOUR TICKETS TABLE */}
      {tickets.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase tracking-tight">
            Your Tickets
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket, index) => (
                  <tr key={index} className="text-sm text-slate-600">
                    <td className="px-6 py-4 font-bold">{ticket.name}</td>
                    <td className="px-6 py-4">${ticket.price.toFixed(2)}</td>
                    <td className="px-6 py-4">{ticket.total_quantity}</td>
                    <td className="space-x-3 px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(ticket, index)}
                        className="text-purple-700"
                      >
                        <FaRegEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-800"
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="overflow-hidden rounded-2xl border-none p-0 sm:max-w-[450px]">
          <div className="space-y-6 bg-white p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold uppercase text-[#310a24]">
                Edit Ticket
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 rounded-xl border border-slate-100 p-5 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Ticket Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={editData?.name || ""}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 p-3 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Price *</label>
                  <input
                    type="number"
                    value={editData?.price ?? 0}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev
                          ? { ...prev, price: parseFloat(e.target.value) }
                          : null,
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 p-3 text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Ticket Capacity</label>
                  <input
                    type="number"
                    value={editData?.total_quantity ?? 0}
                    onChange={(e) =>
                      setEditData((prev) =>
                        prev
                          ? {
                              ...prev,
                              total_quantity: parseInt(e.target.value),
                            }
                          : null,
                      )
                    }
                    className="w-full rounded-lg border border-slate-200 p-3 text-center"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveEdit}
              className="w-full rounded-lg bg-[#310a24] py-4 font-semibold text-white hover:bg-[#4a1036]"
            >
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between pt-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="border bg-white px-8"
        >
          Back
        </Button>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            type="button"
            onClick={onBack}
            className="border-slate-200 bg-white px-8 text-slate-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onNext}
            disabled={tickets.length === 0 || isSubmitting}
            className="bg-purple-900 px-8 hover:bg-purple-800 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}
