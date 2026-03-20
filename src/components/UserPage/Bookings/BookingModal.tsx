// --- Integrated Booking Modal Component ---
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  Minus,
  Plus,
  ArrowRight,
  Share2,
  User,
  Stethoscope,
  Building2,
  FileText,
  LayoutGrid,
  QrCode,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ShareModal from "../ListEventCard/ShareModal";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/DashboardCompoenents/ui/button";

export function BookingModal({
  isOpen,
  onClose,
  ticketSelection,
  subTotal,
}: any) {
  // We manage the internal step and form data here, like MultiStepForm
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  if (!isOpen) return null;

  const steps = [
    { id: 1, name: "Information", icon: User },
    { id: 2, name: "Review", icon: LayoutGrid },
    { id: 3, name: "Payment", icon: QrCode },
  ];

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="min-h-[600px] w-full max-w-4xl rounded-[32px] transition-all">
            {/* Progress Header (Logic from MultiStepForm) */}
            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-white p-4">
              {steps.map((s, idx) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center justify-start gap-2">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                        step >= idx
                          ? "bg-[#e2ff8d] text-black"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <s.icon size={22} />
                    </div>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-[2px] w-[900px] border-t-2 border-dashed ${
                        step > idx ? "border-[#e2ff8d]" : "border-gray-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* STEP 1: Personal Details */}
            {step === 0 && (
              <div className="space-y-5 rounded-xl bg-white p-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold">Personal Information</h2>
                <div className="space-y-4">
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={updateField}
                    placeholder="John Doe"
                    required
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={updateField}
                    placeholder="john@example.com"
                    required
                  />
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={updateField}
                    placeholder="012 345 678"
                    required
                  />
                </div>
                <div className="flex gap-4 pt-6">
                  <DialogClose asChild>
                    <button className="w-1/2 rounded-xl border py-4 font-bold">
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    onClick={handleNext}
                    disabled={!formData.fullName || !formData.email}
                    className="w-1/2 rounded-xl bg-purple-600 py-4 font-bold text-white shadow-lg shadow-purple-200 disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Order Review */}
            {step === 1 && (
              <div className="space-y-6 rounded-xl bg-white p-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-bold">Review Your Order</h2>
                <div className="space-y-4 rounded-2xl border bg-gray-50/50 p-5">
                  {Object.entries(ticketSelection).map(
                    ([type, qty]: [string, any]) =>
                      qty > 0 && (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <span className="font-medium capitalize text-gray-600">
                            {type} Ticket
                          </span>
                          <span className="rounded-lg border bg-white px-4 py-1 font-bold">
                            x {qty}
                          </span>
                        </div>
                      ),
                  )}
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-black text-orange-600">
                      ${subTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="w-1/2 rounded-xl border py-4 font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-1/2 rounded-xl bg-purple-600 py-4 font-bold text-white"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment (KHQR) */}
            {step === 2 && (
              <div className="space-y-6 rounded-xl bg-white p-6 text-center animate-in zoom-in-95">
                <h2 className="text-xl font-bold">Scan to Pay</h2>
                <div className="mx-auto flex aspect-square w-64 items-center justify-center rounded-3xl border-4 border-dashed border-gray-200 bg-gray-50">
                  <div className="flex flex-col items-center gap-2">
                    <QrCode size={100} className="text-gray-300" />
                    <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                      KHQR Simulation
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Please scan the QR code with your bank app to complete the
                  payment of{" "}
                  <span className="font-bold text-gray-900">
                    ${subTotal.toFixed(2)}
                  </span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="w-full rounded-xl border py-4 font-bold"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full rounded-xl bg-[#3d021e] py-4 font-bold text-white"
                  >
                    Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper for consistency
function FormInput({ label, required, ...props }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {label} {required && "*"}
      </label>
      <input
        {...props}
        className="rounded-xl border border-gray-200 bg-white p-4 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
      />
    </div>
  );
}
