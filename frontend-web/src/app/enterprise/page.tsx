import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Briefcase, ShieldCheck, Users } from 'lucide-react';

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-charcoal text-paper pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-8 pt-24">
        <Link href="/" className="inline-flex items-center gap-2 text-mist hover:text-white transition-colors font-medium mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-moss/20 text-moss px-4 py-2 rounded-full font-bold text-sm uppercase tracking-widest border border-moss/30">
              <Building2 className="w-4 h-4" /> QuickMate for Business
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
              Scale your operations with ease.
            </h1>
            <p className="text-xl text-mist/80 leading-relaxed">
              From office logistics to bulk deliveries and on-demand staffing. QuickMate Enterprise provides businesses with vetted, reliable professionals at scale.
            </p>
            <div className="pt-4">
              <Link href="/contact" className="bg-moss text-paper px-8 py-4 rounded-xl font-bold text-lg hover:bg-moss/90 transition shadow-lg shadow-moss/20 inline-block">
                Contact Sales
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-ink p-8 rounded-3xl border border-smoke/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-moss"><Users className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white">Dedicated Account Manager</h3>
              <p className="text-mist/70 text-sm">A single point of contact to handle your volume requests and ensure quality.</p>
            </div>
            <div className="bg-ink p-8 rounded-3xl border border-smoke/10 space-y-4 hover:-translate-y-1 transition-transform mt-0 sm:mt-8">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-moss"><ShieldCheck className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white">Premium Vetting</h3>
              <p className="text-mist/70 text-sm">Enterprise tasks are exclusively routed to our highest-rated, fully background-checked Pro Mates.</p>
            </div>
            <div className="bg-ink p-8 rounded-3xl border border-smoke/10 space-y-4 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-moss"><Briefcase className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-white">Invoicing & API</h3>
              <p className="text-mist/70 text-sm">Streamlined monthly invoicing and API access to integrate task posting into your own software.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
