import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-paper text-ink pb-24">
      <div className="max-w-6xl mx-auto px-8 pt-24 grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 text-moss hover:text-moss/80 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Get in touch</h1>
          <p className="text-xl text-smoke leading-relaxed">
            Have a question, need help with a task, or want to explore enterprise options? Our team is here to help.
          </p>
          
          <div className="space-y-6 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center shrink-0 border border-hairline text-moss">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Email us</h3>
                <p className="text-smoke mb-1">Our friendly team is here to help.</p>
                <a href="mailto:support@quickmate.com" className="text-moss font-medium hover:underline">support@quickmate.com</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center shrink-0 border border-hairline text-moss">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Visit us</h3>
                <p className="text-smoke mb-1">Come say hello at our HQ.</p>
                <p className="text-ink font-medium">100 Innovation Drive<br/>Tech City, TC 12345</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-mist rounded-2xl flex items-center justify-center shrink-0 border border-hairline text-moss">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Call us</h3>
                <p className="text-smoke mb-1">Mon-Fri from 8am to 5pm.</p>
                <a href="tel:+18001234567" className="text-moss font-medium hover:underline">+1 (800) 123-4567</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-mist p-8 md:p-12 rounded-3xl border border-hairline shadow-xl">
          <h2 className="text-2xl font-bold mb-8">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">First name</label>
                <input type="text" className="w-full bg-paper border border-hairline rounded-xl px-4 py-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20 transition-all" placeholder="First name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-ink">Last name</label>
                <input type="text" className="w-full bg-paper border border-hairline rounded-xl px-4 py-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20 transition-all" placeholder="Last name" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Email</label>
              <input type="email" className="w-full bg-paper border border-hairline rounded-xl px-4 py-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20 transition-all" placeholder="you@company.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-ink">Message</label>
              <textarea rows={5} className="w-full bg-paper border border-hairline rounded-xl px-4 py-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20 transition-all resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button type="button" className="w-full bg-charcoal text-paper py-4 rounded-xl font-bold hover:bg-charcoal/90 transition shadow-lg">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}
