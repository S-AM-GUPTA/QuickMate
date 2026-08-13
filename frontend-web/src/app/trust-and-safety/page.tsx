import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, UserCheck, Lock, Star } from 'lucide-react';

export default function TrustAndSafety() {
  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <div className="bg-mist pt-24 pb-32 px-8 text-center border-b border-hairline">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-moss" />
          </div>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-ink">Trust & Safety</h1>
          <p className="text-xl text-smoke max-w-2xl mx-auto leading-relaxed">
            Your peace of mind is our top priority. We've built robust systems to ensure every interaction on QuickMate is secure, transparent, and reliable.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-16 relative z-10 grid md:grid-cols-2 gap-8">
        <div className="bg-paper rounded-3xl shadow-xl border border-hairline p-8 md:p-10">
          <div className="w-12 h-12 bg-moss/10 text-moss rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Secure Escrow Payments</h3>
          <p className="text-smoke leading-relaxed">
            Never worry about getting scammed. When a task is booked, funds are held in our secure escrow system. They are only released to the Mate once the customer confirms the job is completed to their satisfaction.
          </p>
        </div>

        <div className="bg-paper rounded-3xl shadow-xl border border-hairline p-8 md:p-10">
          <div className="w-12 h-12 bg-moss/10 text-moss rounded-2xl flex items-center justify-center mb-6">
            <UserCheck className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Identity Verification</h3>
          <p className="text-smoke leading-relaxed">
            Every Mate on our platform undergoes a rigorous identity check. We verify government-issued IDs and cross-reference them to ensure that the person arriving at your door is exactly who they say they are.
          </p>
        </div>

        <div className="bg-paper rounded-3xl shadow-xl border border-hairline p-8 md:p-10">
          <div className="w-12 h-12 bg-moss/10 text-moss rounded-2xl flex items-center justify-center mb-6">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Transparent Reviews</h3>
          <p className="text-smoke leading-relaxed">
            Our community relies on honest feedback. After every task, both parties are prompted to leave a rating and review. This ensures high standards are maintained and helps you choose the best person for the job.
          </p>
        </div>

        <div className="bg-paper rounded-3xl shadow-xl border border-hairline p-8 md:p-10">
          <div className="w-12 h-12 bg-moss/10 text-moss rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold mb-4">24/7 Support & Mediation</h3>
          <p className="text-smoke leading-relaxed">
            If a dispute ever arises, our dedicated support team is available 24/7 to mediate and find a fair resolution. You are never left to handle issues on your own.
          </p>
        </div>
      </div>
    </div>
  );
}
