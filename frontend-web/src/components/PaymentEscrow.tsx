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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-paper shadow-2xl border border-hairline">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-mist px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-moss/10 px-2 py-0.5 text-[10px] font-bold text-moss">
              RAZORPAY SECURE
            </span>
            <span className="text-xs text-slate font-medium">
              Escrow Portal
            </span>
          </div>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate hover:bg-mist cursor-pointer"
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
                <ShieldCheck className="mx-auto h-12 w-12 text-moss" />
                <h3 className="mt-3 text-lg font-bold text-ink">
                  Escrow Payment Initialization
                </h3>
                <p className="mt-1 text-xs text-smoke">
                  Funds will be safely locked in QuickMate Escrow until task
                  completion.
                </p>
              </div>

              {/* Order Info */}
              <div className="mt-6 rounded-xl bg-mist p-4 text-sm">
                <div className="flex justify-between border-b border-hairline pb-2">
                  <span className="text-smoke">Task</span>
                  <span className="font-semibold text-ink truncate max-w-[180px]">
                    {taskTitle}
                  </span>
                </div>
                <div className="flex justify-between border-b border-hairline py-2">
                  <span className="text-smoke">Assigned Helper</span>
                  <span className="font-semibold text-ink">
                    {helperName}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-smoke font-semibold">
                    Total to Lock
                  </span>
                  <span className="font-bold text-moss">
                    Rs. {amount}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-slate uppercase tracking-wider">
                  Select Payment Method
                </span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                      paymentMethod === "upi"
                        ? "border-moss bg-moss/10 text-moss"
                        : "border-hairline hover:bg-mist text-ink"
                    }`}
                  >
                    <span className="text-xs">UPI (GPay/PhonePe)</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-sm font-semibold transition cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-moss bg-moss/10 text-moss"
                        : "border-hairline hover:bg-mist text-ink"
                    }`}
                  >
                    <CreditCard className="mb-1 h-4 w-4" />
                    <span className="text-xs">Credit/Debit Card</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="mt-6 w-full flex items-center justify-center rounded-xl bg-moss py-3 text-sm font-semibold text-paper hover:bg-moss/90 shadow transition duration-200 cursor-pointer"
              >
                Pay & Hold Rs. {amount}
              </button>
            </div>
          )}

          {step === "processing" && (
            <div className="py-8 text-center">
              <RefreshCw className="mx-auto h-12 w-12 animate-spin text-moss" />
              <h4 className="mt-4 font-bold text-ink">
                Processing Secure Order...
              </h4>
              <p className="mt-1 text-xs text-smoke">
                Do not refresh or close this window.
              </p>
            </div>
          )}

          {step === "held" && (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-ink border-2 border-smoke/30">
                <Lock className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">
                Funds Locked in Escrow!
              </h3>
              <p className="mt-2 text-sm text-smoke">
                Payment of{" "}
                <span className="font-semibold text-ink">
                  Rs. {amount}
                </span>{" "}
                is held securely by QuickMate. The helper will be paid
                automatically once you confirm the task is complete.
              </p>

              <button
                onClick={confirmEscrowRelease}
                className="mt-8 w-full flex items-center justify-center rounded-xl bg-moss py-3 text-sm font-semibold text-paper hover:bg-moss/90 shadow transition duration-200 cursor-pointer"
              >
                Approve Release to Helper
              </button>
            </div>
          )}

          {step === "released" && (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-moss/10 text-moss border-2 border-moss/30">
                <Unlock className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink">
                Funds Released Successfully!
              </h3>
              <p className="mt-2 text-sm text-smoke">
                Rs. {amount} has been successfully transferred to {helperName}&apos;s
                wallet.
              </p>
              <CheckCircle2 className="mx-auto mt-6 h-8 w-8 text-moss animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
