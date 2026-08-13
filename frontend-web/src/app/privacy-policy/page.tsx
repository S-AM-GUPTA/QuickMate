import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-paper p-8 sm:p-12 md:p-24 animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl tracking-tight text-ink font-bold">Privacy Policy</h1>
        <p className="text-smoke">Last updated: August 2026</p>
        <div className="h-px w-full bg-hairline my-8" />
        
        <div className="space-y-8 text-ink leading-relaxed prose prose-slate">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4 text-smoke">
              When you use QuickMate, we collect information you provide directly to us, such as when you create an account, update your profile, post a task, or communicate with us. This may include your name, email address, phone number, physical address, and payment information.
            </p>
            <p className="text-smoke">
              We also collect information automatically when you use our platform, including your IP address, device type, operating system, and browsing behavior on our app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4 text-smoke">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 text-smoke">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process transactions and send related information, including confirmations and receipts.</li>
              <li>Verify your identity and prevent fraud.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
              <li>Respond to your comments, questions, and requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="text-smoke">
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. All payment data is processed securely through encrypted channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
