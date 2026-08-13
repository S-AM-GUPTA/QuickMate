import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Search, Handshake, Zap } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      {/* Header */}
      <div className="bg-charcoal pt-24 pb-32 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-paper">How QuickMate Works</h1>
          <p className="text-xl text-mist/80 max-w-2xl mx-auto leading-relaxed">
            Whether you need a helping hand or you're looking to earn on your own schedule, QuickMate makes the process seamless and secure.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-16 space-y-24">
        {/* For Customers Section */}
        <section className="bg-paper rounded-3xl shadow-2xl border border-hairline p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-moss/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="bg-moss/10 text-moss p-2 rounded-xl"><Search className="w-6 h-6" /></span>
            For Customers
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-charcoal text-paper rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">1</div>
              <h3 className="text-xl font-bold">Post your task</h3>
              <p className="text-smoke leading-relaxed">Describe what you need, set your location, and specify your budget. It takes less than 2 minutes to get your task on the market.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-charcoal text-paper rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg">2</div>
              <h3 className="text-xl font-bold">Review bids</h3>
              <p className="text-smoke leading-relaxed">Local, vetted Mates will place bids on your task. Compare their profiles, ratings, and prices to choose the perfect fit.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-moss text-paper rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-moss/30">3</div>
              <h3 className="text-xl font-bold">Get it done</h3>
              <p className="text-smoke leading-relaxed">Your payment is held securely in escrow until the job is complete. Once you approve, the funds are released. Simple and safe.</p>
            </div>
          </div>
        </section>

        {/* For Mates Section */}
        <section className="bg-mist rounded-3xl shadow-xl border border-hairline p-8 md:p-12 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-moss/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <span className="bg-charcoal/10 text-charcoal p-2 rounded-xl"><Zap className="w-6 h-6" /></span>
            For Mates
          </h2>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white text-ink border border-hairline rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm">1</div>
              <h3 className="text-xl font-bold">Browse jobs</h3>
              <p className="text-smoke leading-relaxed">Check the market for tasks in your area that match your skills. Filter by category, budget, or distance.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white text-ink border border-hairline rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm">2</div>
              <h3 className="text-xl font-bold">Place your bid</h3>
              <p className="text-smoke leading-relaxed">Offer your price and explain why you're the right person for the job. Chat directly with customers if they have questions.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-moss text-paper rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg shadow-moss/30">3</div>
              <h3 className="text-xl font-bold">Earn & grow</h3>
              <p className="text-smoke leading-relaxed">Complete the task, get paid automatically via our secure escrow, and build your reputation with 5-star reviews.</p>
            </div>
          </div>
        </section>
        
        {/* Call to action */}
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="bg-moss text-paper px-8 py-4 rounded-xl font-bold hover:bg-moss/90 transition shadow-lg shadow-moss/30">Join as a Customer</Link>
            <Link href="/login" className="bg-charcoal text-paper px-8 py-4 rounded-xl font-bold hover:bg-charcoal/90 transition shadow-lg shadow-charcoal/30">Become a Mate</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
