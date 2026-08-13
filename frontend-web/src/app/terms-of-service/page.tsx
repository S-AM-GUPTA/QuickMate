import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-paper p-8 sm:p-12 md:p-24 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl tracking-tight text-ink font-bold">Terms of Service</h1>
        <p className="text-smoke">Last updated: August 2026</p>
        <div className="h-px w-full bg-hairline my-8" />
        
        <div className="space-y-8 text-ink leading-relaxed prose prose-slate">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-smoke">
              By accessing or using the QuickMate platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
            <p className="mb-4 text-smoke">
              To use certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="text-smoke">
              You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Prohibited Activities</h2>
            <p className="mb-4 text-smoke">You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-6 space-y-2 text-smoke">
              <li>Posting tasks that are illegal, dangerous, or violate the rights of others.</li>
              <li>Using the platform for any fraudulent or deceptive purpose.</li>
              <li>Attempting to bypass the escrow payment system or pay for services outside the platform.</li>
              <li>Harassing, abusing, or harming another person.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
            <p className="text-smoke">
              QuickMate acts as a marketplace to connect customers with independent service providers. We are not responsible for the performance or quality of the services provided by Mates, though we provide mechanisms for mediation and dispute resolution.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
