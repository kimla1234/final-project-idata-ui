"use client";
import React from 'react';
import { 
  Ticket, 
  Banknote, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { EventData } from '@/redux/service/events';

interface ReportEventsProps {
  eventData: EventData;
}

export default function ReportEvents({ eventData }: ReportEventsProps) {
  // 1. Calculate real data from eventData.ticketTypes
  const totalTickets = eventData.ticketTypes?.reduce((acc, t) => acc + t.total_quantity, 0) || 0;
  const totalSold = eventData.ticketTypes?.reduce((acc, t) => acc + t.sold_quantity, 0) || 0;
  const totalRemaining = totalTickets - totalSold;
  
  // Calculate total revenue based on sold tickets
  const totalRevenue = eventData.ticketTypes?.reduce((acc, t) => acc + (t.price * t.sold_quantity), 0) || 0;

  return (
    <div className="w-full space-y-6 p-1">
      {/* --- Header Section --- */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Event Report</h1>
        <p className="text-xs text-slate-500">Real-time overview for: <span className="font-semibold text-blue-600">{eventData.title}</span></p>
      </div>

      {/* --- Main Stats Card --- */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-x-0 md:divide-x divide-slate-100">
          
          {/* Total Bookings (Sold Tickets) */}
          <div className="px-4 space-y-3">
            <p className="text-sm font-medium text-slate-500">Tickets Sold</p>
            <h2 className="text-3xl font-bold text-slate-900">{totalSold}</h2>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} />
              {totalTickets > 0 ? Math.round((totalSold / totalTickets) * 100) : 0}% Capacity
            </div>
          </div>

          {/* Tickets Remaining */}
          <div className="px-6 space-y-3">
            <p className="text-sm font-medium text-slate-500">Remaining</p>
            <h2 className="text-3xl font-bold text-slate-900">{totalRemaining}</h2>
            <div className="flex flex-wrap gap-2">
              {eventData.ticketTypes?.map((ticket) => (
                <div key={ticket.id} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  {ticket.name}: {ticket.total_quantity - ticket.sold_quantity}
                </div>
              ))}
            </div>
          </div>

          {/* Total Revenue */}
          <div className="px-6 space-y-3">
            <p className="text-sm font-medium text-slate-500">Gross Revenue</p>
            <h2 className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</h2>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
              <TrendingUp size={14} />
              Live Sales
            </div>
          </div>

        </div>
      </div>

      {/* --- Detailed Breakdown Sections --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ticket Type Breakdown */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Ticket size={18} className="text-blue-500" />
              Sales Progress
            </h3>
          </div>
          <div className="space-y-3">
            {eventData.ticketTypes?.map((ticket) => {
              const percentage = (ticket.sold_quantity / ticket.total_quantity) * 100;
              return (
                <div key={ticket.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">{ticket.name} (${ticket.price})</span>
                    <span className="text-slate-400">{ticket.sold_quantity} / {ticket.total_quantity} Sold</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
            <Banknote size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Available Payout</h3>
          <p className="text-4xl font-black text-emerald-600">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-2">Current funds available based on ticket sales</p>
        </div>
      </div>
    </div>
  );
}