"use client";
import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  Image as ImageIcon, 
  Users, 
  Link, 
  Layers,
  Trash2,
  Globe
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/DashboardCompoenents/ui/table"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/DashboardCompoenents/ui/dropdown-menu";
import { FaRegEdit } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { TicketType } from '@/redux/service/events';

interface TicketEventsProps {
  ticketTypes: TicketType[];
}

export default function TicketEvents({ ticketTypes }: TicketEventsProps) {
  return (
    <div className="w-full space-y-5">
      {/* --- Header Section --- */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tickets</h1>
          <p className="text-xs text-slate-500">Manage your event entry passes and pricing</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
          <Plus size={16} strokeWidth={3} />
          Create Ticket
        </button>
      </div>

      {/* --- UI Table Container --- */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Ticket Name</TableHead>
              <TableHead className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Price</TableHead>
              <TableHead className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Sold / Total</TableHead>
              <TableHead className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">Status</TableHead>
              <TableHead className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketTypes && ticketTypes.length > 0 ? (
              ticketTypes.map((ticket) => {
                const isSoldOut = ticket.sold_quantity >= ticket.total_quantity;
                
                return (
                  <TableRow key={ticket.id} className="group hover:bg-blue-50/30 transition-colors border-slate-100">
                    {/* Name */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <ImageIcon size={18} />
                        </div>
                        <span className="font-semibold text-slate-700">{ticket.name}</span>
                      </div>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="px-6 py-4 text-center">
                      <span className="text-sm font-bold text-slate-800">${ticket.price}</span>
                    </TableCell>

                    {/* Capacity (Sold / Total) */}
                    <TableCell className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        <Users size={12} />
                        {ticket.sold_quantity} / {ticket.total_quantity}
                      </span>
                    </TableCell>

                    {/* Status (Dynamic based on sold quantity) */}
                    <TableCell className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${
                        isSoldOut 
                        ? "bg-rose-50 text-rose-600 ring-rose-600/20" 
                        : "bg-emerald-50 text-emerald-600 ring-emerald-600/20"
                      }`}>
                        <span className={`h-1 w-1 rounded-full ${isSoldOut ? "bg-rose-600" : "bg-emerald-600"}`}></span>
                        {isSoldOut ? "Sold Out" : "Active"}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-md text-blue-500 hover:bg-blue-100 transition-colors" title="Edit">
                          <FaRegEdit size={16} />
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 outline-none transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95">
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 focus:bg-slate-50 focus:text-blue-600 cursor-pointer">
                              <ImageIcon size={14} /> Update Image
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 focus:bg-slate-50 focus:text-blue-600 cursor-pointer">
                              <Globe size={14} /> Visibility Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 focus:bg-slate-50 focus:text-blue-600 cursor-pointer border-b border-slate-50 mb-1">
                              <Link size={14} /> Copy Ticket Link
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-rose-600 focus:bg-rose-50 cursor-pointer">
                              <Trash2 size={14} /> Remove Ticket
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-slate-400 text-sm">
                  No tickets found for this event.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Footer Button --- */}
      <div className="group cursor-pointer border border-dashed flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 border-slate-300 py-4 text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-all active:scale-[0.99]">
        <IoAddCircleOutline size={22} className="group-hover:rotate-90 transition-transform duration-300"/>
        <span className="text-sm font-bold uppercase tracking-wider">Create Ticket</span>
      </div>
    </div>
  );
}