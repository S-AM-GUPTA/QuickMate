import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-paper p-8 sm:p-12 md:p-24 animate-fade-in text-ink">
      <div className="max-w-3xl mx-auto space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">About Us</h1>
          <div className="h-2 w-24 bg-moss rounded-full mb-8"></div>
          <p className="text-2xl text-charcoal font-medium leading-relaxed">
            We built QuickMate with a simple mission: to connect communities by making everyday tasks effortless and secure.
          </p>
        </div>
        
        <div className="space-y-8 text-lg text-smoke leading-relaxed">
          <p>
            Finding reliable help shouldn't be a chore, and finding flexible work shouldn't be a hassle. QuickMate bridges the gap between individuals who need a helping hand and skilled professionals looking to monetize their time.
          </p>
          <p>
            Founded in 2026, our platform utilizes cutting-edge technology, strict vetting processes, and a secure escrow payment system to ensure that every interaction on our marketplace is rooted in trust.
          </p>
          <div className="bg-mist p-8 rounded-2xl border border-hairline my-12">
            <h3 className="text-xl font-bold text-ink mb-4">Our Values</h3>
            <ul className="space-y-3">
              <li><strong className="text-ink">Trust First:</strong> Every Mate is verified, and every payment is protected.</li>
              <li><strong className="text-ink">Community Driven:</strong> We empower local economies by keeping money within the community.</li>
              <li><strong className="text-ink">Radical Transparency:</strong> No hidden fees. What you agree on is what you pay.</li>
            </ul>
          </div>
          <p>
            Whether you need furniture assembled, a house cleaned, or IT support, we've got a Mate for that. Welcome to the future of the gig economy.
          </p>
        </div>
      </div>
    </div>
  );
}
