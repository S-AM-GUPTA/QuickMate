"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  CheckCircle,
  Star,
  ThumbsUp,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-moss/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-paper/80 backdrop-blur-md border-b border-hairline transition-all shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src="/logo.png" alt="QuickMate" className="h-10 sm:h-12 w-auto object-contain cursor-pointer" />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {isLoggedIn ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-md bg-moss px-5 py-2 text-[14px] font-medium text-paper shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                className="text-[14px] font-medium text-ink hover:text-moss transition-colors cursor-pointer hidden md:block"
              >
                Become a Helper
              </button>
              <button
                onClick={() => router.push("/login")}
                className="text-[14px] font-medium text-ink hover:text-moss transition-colors cursor-pointer mr-2"
              >
                Log in
              </button>
              <button
                onClick={() => router.push("/login?mode=signup")}
                className="rounded-md bg-moss px-5 py-2 text-[14px] font-medium text-paper shadow-md hover:shadow-lg hover:bg-moss/90 hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative px-6 pt-10 pb-24 md:pt-16 md:pb-32 overflow-hidden max-w-[1200px] mx-auto animate-fade-in-up">

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-8 items-center justify-between">
          {/* Left Text Content */}
          <div className="text-left max-w-2xl z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-mist text-ink text-[13px] font-medium mb-8 border border-hairline shadow-sm hover:shadow-md transition-shadow">
              <Sparkles className="h-4 w-4 text-moss" />
              Over 500+ tasks completed for busy people everywhere
            </div>
            
            <h1 className="text-[52px] md:text-[64px] lg:text-[72px] font-bold tracking-tight text-ink mb-6 leading-[1.1]">
              Get help.<br/>
              Gain happiness.
            </h1>
            
            <p className="text-[18px] text-slate mb-10 leading-[1.6] max-w-[580px]">
              The premium marketplace for your everyday needs. Book trusted, vetted talent for cleaning, handyman services, deliveries, and more—instantly.
            </p>
            
            {/* Search Bar */}
            <div className="flex items-center w-full max-w-[580px] mb-8 bg-paper border border-hairline shadow-lg shadow-slate/5 rounded-md p-2 focus-within:border-moss focus-within:ring-2 focus-within:ring-moss/20 transition-all duration-300">
              <div className="pl-4 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate" />
              </div>
              <input 
                type="text" 
                placeholder="What do you need help with?" 
                className="flex-1 bg-transparent text-[16px] placeholder:text-fog text-ink focus:outline-none min-w-0 py-3 font-sans"
              />
              <div className="flex items-center gap-2 pl-2">
                <button 
                  onClick={() => router.push("/login")}
                  className="rounded-md bg-moss px-6 py-3 text-[15px] font-medium text-paper hover:bg-moss/90 shadow-md hover:shadow-lg transition-all duration-300 flex items-center whitespace-nowrap"
                >
                  Post a Task
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[13px] font-medium text-slate mr-2">{'Popular:'}</span>
              {["Handyman", "Cleaning", "Delivery", "Tech Help"].map((cat) => (
                <button key={cat} onClick={() => router.push("/login")} className="flex items-center gap-1.5 rounded-md bg-mist border border-hairline px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-paper hover:border-slate hover:shadow-sm transition-all">
                   {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Right Graphics - Enhanced Collage */}
          <div className="relative hidden lg:block h-[560px] w-full max-w-[500px]">
            {/* Main Image */}
            <div className="absolute top-[5%] right-[0%] w-[80%] h-[75%] rounded-lg overflow-hidden border border-hairline z-20 shadow-2xl shadow-charcoal/10 hover:-translate-y-2 transition-transform duration-500">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop" alt="Local Taskers at Work" className="w-full h-full object-cover" />
            </div>
            
            {/* Floating Graphic 1 */}
            <div className="absolute bottom-[10%] left-[-10%] w-[60%] h-[40%] rounded-lg overflow-hidden border border-hairline z-30 shadow-xl shadow-charcoal/10 hover:-translate-y-2 transition-transform duration-500 delay-100 bg-sand">
              <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop" alt="Tools" className="w-full h-full object-cover" />
            </div>


          </div>
        </div>
      </main>


      {/* How It Works Section */}
      <section id="how-it-works" className="bg-paper py-24 px-6 relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-[36px] md:text-[44px] font-bold text-ink mb-4 tracking-tight">
              Seamless hiring. Guaranteed results.
            </h2>
            <p className="text-[18px] text-slate max-w-2xl mx-auto leading-relaxed">
              We've stripped away the friction of traditional freelancing platforms. Hire top-tier talent in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                icon: Search,
                title: "1. Post Your Request",
                desc: "Describe what you need in plain English. Choose your budget, timeline, and required skills instantly.",
              },
              {
                icon: Zap,
                title: "2. Match & Hire",
                desc: "Get matched with rigorously vetted professionals. Review their profiles, read reviews, and hire with one click.",
              },
              {
                icon: CheckCircle,
                title: "3. Approve & Pay",
                desc: "Review the completed work. We hold your payment securely in escrow until you're 100% satisfied.",
              },
            ].map((step, idx) => (
              <div key={idx} className="bg-paper border border-hairline rounded-md p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="h-14 w-14 rounded-md bg-mist flex items-center justify-center mb-6 group-hover:bg-moss/10 transition-colors border border-hairline">
                  <step.icon className="h-7 w-7 text-ink group-hover:text-moss transition-colors" />
                </div>
                <h3 className="text-[22px] font-bold text-ink mb-3">{step.title}</h3>
                <p className="text-[16px] text-slate leading-relaxed flex-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects Section */}
      <section className="py-24 px-6 bg-mist/30 border-y border-hairline">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in-up">
            <div>
              <h2 className="text-[36px] md:text-[44px] font-bold text-ink mb-4 tracking-tight">
                Popular everyday tasks
              </h2>
              <p className="text-[18px] text-slate max-w-xl leading-relaxed">
                Browse pre-scoped projects with transparent pricing. No back-and-forth negotiation required.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[15px] font-bold text-moss hover:text-ink transition-colors">
              View all projects <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Furniture Assembly", price: "₹499", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop" },
              { title: "Deep Cleaning", price: "₹899", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=600&auto=format&fit=crop" },
              { title: "Appliance Repair", price: "₹349", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=600&auto=format&fit=crop" },
              { title: "Moving Help", price: "₹799", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop" },
            ].map((project, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-md border border-hairline bg-paper shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="h-48 overflow-hidden bg-mist relative">
                  <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors z-10" />
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-[18px] font-bold text-ink mb-1">{project.title}</h3>
                  <p className="text-[15px] font-medium text-slate mb-6">Starting at {project.price}</p>
                  <button className="mt-auto w-full py-2.5 rounded-md border border-hairline font-bold text-[14px] text-ink group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-sand/30 py-24 px-6 border-y border-hairline relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={{
          background: 'radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.4) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.3) 0%, transparent 40%)'
        }} />
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orchid/10 text-orchid text-[13px] font-bold tracking-wider uppercase mb-4 border border-orchid/20 shadow-sm">
              <Sparkles className="h-4 w-4" /> Powered by AI
            </span>
            <h2 className="text-[36px] md:text-[44px] font-bold text-ink mb-6 tracking-tight">
              Smarter matching. Fairer prices.
            </h2>
            <p className="text-[18px] text-slate max-w-2xl mx-auto leading-[1.6]">
              QuickMate uses advanced artificial intelligence to ensure every task is completed efficiently, safely, and fairly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-paper p-8 rounded-md border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
                <Search className="h-6 w-6 text-ink" />
              </div>
              <h4 className="text-[18px] font-bold text-ink mb-3">Smart Mate Matching</h4>
              <p className="text-[15px] text-slate leading-relaxed">
                Our AI ranks suitable nearby mates using complex factors such as distance, specialized skills, ratings, and previous performance.
              </p>
            </div>
            
            <div className="bg-paper p-8 rounded-md border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orchid to-moss" />
              <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
                <Zap className="h-6 w-6 text-ink" />
              </div>
              <h4 className="text-[18px] font-bold text-ink mb-3">Dynamic Price Suggestion</h4>
              <p className="text-[15px] text-slate leading-relaxed">
                Never guess what to pay. Our AI helps you determine a reasonable price based on task type, location, time, and real-time demand.
              </p>
            </div>
            
            <div className="bg-paper p-8 rounded-md border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
                <ShieldCheck className="h-6 w-6 text-ink" />
              </div>
              <h4 className="text-[18px] font-bold text-ink mb-3">AI Safety & Fraud Detection</h4>
              <p className="text-[15px] text-slate leading-relaxed">
                Trust is our currency. We utilize AI-based detection to identify suspicious activity and improve overall trust within the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-24 px-6 max-w-[1000px] mx-auto text-center animate-fade-in-up">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-md bg-mist mb-8 border border-hairline shadow-sm">
          <ShieldCheck className="h-10 w-10 text-moss" />
        </div>
        <h2 className="text-[36px] md:text-[44px] font-bold text-ink mb-6 tracking-tight">
          The QuickMate Pledge
        </h2>
        <p className="text-[18px] text-slate leading-[1.7] mb-16 max-w-3xl mx-auto">
          Your peace of mind is our product. We enforce strict identity verification, rigorous profile reviews, and a secure escrow system. You only pay when the work meets your exact standards.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
          <div className="p-8 rounded-md bg-paper border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start">
            <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
              <CheckCircle className="h-6 w-6 text-ink" />
            </div>
            <h4 className="text-[18px] font-bold text-ink mb-3">Top 3% Talent</h4>
            <p className="text-[15px] text-slate leading-relaxed">
              We accept only the top echelon of applicants through our rigorous screening process.
            </p>
          </div>
          <div className="p-8 rounded-md bg-paper border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-moss to-orchid" />
            <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
              <ShieldCheck className="h-6 w-6 text-ink" />
            </div>
            <h4 className="text-[18px] font-bold text-ink mb-3">Secure Escrow</h4>
            <p className="text-[15px] text-slate leading-relaxed">
              Funds are held securely. You release payment only when you approve the final delivery.
            </p>
          </div>
          <div className="p-8 rounded-md bg-paper border border-hairline shadow-sm hover:shadow-lg transition-all flex flex-col items-start">
            <div className="h-12 w-12 rounded-md bg-mist flex items-center justify-center mb-6 border border-hairline">
              <ThumbsUp className="h-6 w-6 text-ink" />
            </div>
            <h4 className="text-[18px] font-bold text-ink mb-3">Money-Back Guarantee</h4>
            <p className="text-[15px] text-slate leading-relaxed">
              Not satisfied? Our support team will mediate, replace the mate, or refund you entirely.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-ink py-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-[36px] md:text-[44px] font-bold text-paper mb-4 tracking-tight">
              Trusted by homeowners everywhere
            </h2>
            <p className="text-[18px] text-fog max-w-2xl mx-auto">
              Don't just take our word for it. Here's what busy people are saying about getting their time back with QuickMate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "QuickMate saved me this weekend. The mate I hired was professional, fast, and assembled all my IKEA furniture perfectly. Worth every penny.",
                author: "Priya Sharma",
                role: "Homeowner",
              },
              {
                quote: "I needed my entire apartment deep cleaned before moving out. My mate delivered stunning results overnight. Incredible service.",
                author: "Rahul Verma",
                role: "Tenant",
              },
              {
                quote: "I use QuickMate every time I have a plumbing issue or need an errand run. The vetting process makes me feel totally safe.",
                author: "Ananya Desai",
                role: "Busy Parent",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-charcoal p-8 rounded-md border border-graphite shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[16px] text-paper leading-relaxed mb-8 flex-1 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-graphite">
                  <div className="h-12 w-12 rounded-md bg-moss text-paper flex items-center justify-center font-bold text-[18px]">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-paper">{testimonial.author}</p>
                    <p className="text-[13px] text-fog">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-mist opacity-50 -z-10" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-moss/10 blur-[100px] rounded-full -z-10" />
        
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h3 className="mb-6 text-[44px] md:text-[56px] font-bold text-ink tracking-tight leading-tight">
            Ready to reclaim your time?
          </h3>
          <p className="mb-10 text-[20px] text-slate leading-relaxed">
            Stop letting chores slow you down. Find a trusted Mate today and get back to what matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto rounded-md bg-moss px-10 py-4 text-[16px] font-bold text-paper shadow-[0_0_20px_rgba(80,146,9,0.3)] hover:shadow-[0_0_25px_rgba(80,146,9,0.5)] hover:-translate-y-1 transition-all duration-300"
            >
              Start Hiring Now
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full sm:w-auto rounded-md bg-paper border border-moss text-moss px-10 py-4 text-[16px] font-bold shadow-sm hover:bg-moss/10 hover:-translate-y-1 transition-all duration-300"
            >
              Become a Mate
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-paper py-16 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img src="/logo.png" alt="QuickMate" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-[15px] text-slate max-w-sm leading-relaxed">
              QuickMate is the premium marketplace to book trusted, vetted talent for your everyday needs and projects.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/how-it-works" className="text-[14px] text-slate hover:text-moss transition-colors">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/trust-and-safety" className="text-[14px] text-slate hover:text-moss transition-colors">Trust & Safety</Link></li>
              <li><Link href="/contact" className="text-[14px] text-slate hover:text-moss transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-slate">
            © 2026 QuickMate. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-[14px] text-slate hover:text-ink transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="text-[14px] text-slate hover:text-ink transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
