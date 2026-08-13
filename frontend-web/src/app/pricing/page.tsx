import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      {/* Header */}
      <div className="bg-mist pt-24 pb-32 px-8 text-center border-b border-hairline">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-ink">Transparent Pricing</h1>
          <p className="text-xl text-smoke max-w-2xl mx-auto leading-relaxed">
            No hidden fees. You only pay when the job gets done right.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-16 relative z-10 grid md:grid-cols-2 gap-8">
        {/* Customer Pricing */}
        <div className="bg-paper rounded-3xl shadow-xl border border-hairline p-8 md:p-12 hover:-translate-y-2 transition-transform duration-300">
          <div className="inline-block bg-moss/10 text-moss px-4 py-1.5 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">For Customers</div>
          <h2 className="text-4xl font-bold mb-4">Free to post</h2>
          <p className="text-smoke mb-8 leading-relaxed">Post tasks, receive bids, and chat with Mates completely free of charge. We only add a small service fee to the final agreed price.</p>
          
          <div className="text-5xl font-extrabold mb-8 text-ink">5% <span className="text-xl text-smoke font-normal">service fee</span></div>
          
          <ul className="space-y-4">
            {['No upfront costs to post', 'Secure escrow protection included', '24/7 priority support', 'Full refund if task is cancelled'].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-moss shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mate Pricing */}
        <div className="bg-charcoal text-paper rounded-3xl shadow-2xl shadow-charcoal/20 p-8 md:p-12 hover:-translate-y-2 transition-transform duration-300">
          <div className="inline-block bg-white/10 text-white px-4 py-1.5 rounded-full font-bold text-sm mb-6 uppercase tracking-wider">For Mates</div>
          <h2 className="text-4xl font-bold mb-4">Keep what you earn</h2>
          <p className="text-mist/80 mb-8 leading-relaxed">Access hundreds of local tasks daily. Our platform fee is deducted automatically when the job is successfully completed.</p>
          
          <div className="text-5xl font-extrabold mb-8 text-white">10% <span className="text-xl text-mist/60 font-normal">platform fee</span></div>
          
          <ul className="space-y-4">
            {['Free background check & verification', 'Guaranteed payment via Escrow', 'In-app chat & support', 'Instant payouts available'].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-moss shrink-0 mt-0.5" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 mt-24 text-center">
        <h3 className="text-2xl font-bold mb-4">Need higher visibility?</h3>
        <p className="text-smoke mb-8">Specialist Mates can subscribe to our Pro tier for $19/month to get premium placement, reduced fees (5%), and exclusive access to high-value corporate tasks.</p>
        <Link href="/login" className="inline-block bg-paper border-2 border-charcoal text-charcoal px-8 py-3 rounded-xl font-bold hover:bg-charcoal hover:text-paper transition">Explore Pro Tier</Link>
      </div>
    </div>
  );
}
