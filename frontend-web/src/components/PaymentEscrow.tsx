"use client";

import React, { useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  X,
} from "lucide-react";

interface PaymentEscrowProps {
  taskTitle: string;
  amount: number;
  helperName: string;
  onPaymentSuccess: () => void;
  onClose: () => void;
}

export default function PaymentEscrow({
  taskTitle,
  amount,
  helperName,
  onPaymentSuccess,
  onClose,
}: PaymentEscrowProps) {
  const [step, setStep] = useState<
    "checkout" | "processing" | "held" | "released"
  >("checkout");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("held");
    }, 2000);
  };

  const confirmEscrowRelease = () => {
    setStep("released");
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              RAZORPAY SECURE
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Escrow Portal
            </span>
          </div>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "checkout" && (
            <div>
              <div className="text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-blue-600" />
                <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  Escrow Payment Initialization
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Funds will be safely locked in QuickMate Escrow until task
                  completion.
                </p>
              </div>

              {/* Order Info */}
              <div className="mt-6 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/40 text-sm">
                <div className="flex justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800/50">
                  <span className="text-zinc-500">Task</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50 truncate max-w-[180px]">
                    {taskTitle}
                  </span>
                </div>
                <div className="flex justify-between border-b border-zinc-100 py-2 dark:border-zinc-800/50">
                  <span className="text-zinc-500">Assigned Helper</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {helperName}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-zinc-500 font-semibold">
                    Total to Lock
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    Rs. {amount}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Select Payment Method
                </span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-blue-500 bg-blue-50/20 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400"
                        : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <span className="text-xs">UPI (GPay/PhonePe)</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50/20 text-blue-600 dark:border-blue-500 dark:bg-blue-950/20 dark:text-blue-400"
                        : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    <CreditCard className="mb-1 h-4 w-4" />
                    <span className="text-xs">Credit/Debit Card</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="mt-6 w-full flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-500 shadow transition duration-200 cursor-pointer"
              >
                Pay & Hold Rs. {amount}
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-8 text-center">
              <RefreshCw className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <h4 className="mt-4 font-bold text-zinc-900 dark:text-zinc-50">
                Processing Secure Order...
              </h4>
              <p className="mt-1 text-xs text-zinc-500">
                Do not refresh or close this window.
              </p>
            </div>
          )}

          {step === "held" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-500 border-2 border-amber-200 dark:border-amber-800/30">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Funds Locked in Escrow!
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Payment of{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Rs. {amount}
                </span>{" "}
                is held securely by QuickMate. The helper will be paid
                automatically once you confirm the task is complete.
              </p>

              <button
                onClick={confirmEscrowRelease}
                className="mt-8 w-full flex items-center justify-center rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 shadow transition duration-200 cursor-pointer"
              >
                Approve Release to Helper
              </button>
            </div>
          )}

          {step === "released" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 border-2 border-emerald-200 dark:border-emerald-800/30">
                <Unlock className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Funds Released Successfully!
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Rs. {amount} has been successfully transferred to {helperName}&apos;s
                wallet.
              </p>
              <CheckCircle2 className="mx-auto mt-6 h-8 w-8 text-emerald-500 animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
