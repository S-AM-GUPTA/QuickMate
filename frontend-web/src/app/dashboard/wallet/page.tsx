"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Wallet, TrendingUp, ShieldCheck, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, X, CheckCircle, Trash2 } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";

export default function WalletPage() {
  const { addNotification } = useNotification();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Payment Method States
  const [savedMethods, setSavedMethods] = useState([
    { id: 1, type: "CARD", title: "HDFC Bank ending in 4242", icon: <CreditCard className="w-5 h-5" /> },
    { id: 2, type: "UPI", title: "alex@okhdfcbank", icon: <Smartphone className="w-5 h-5" /> }
  ]);
  
  // Modal States
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  
  // Form States
  const [fundAmount, setFundAmount] = useState<number | "">(1000);
  const [selectedMethod, setSelectedMethod] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingSuccess, setProcessingSuccess] = useState(false);
  
  const [newMethodType, setNewMethodType] = useState<"CARD" | "UPI">("CARD");
  const [newMethodDetails, setNewMethodDetails] = useState("");

  const fetchWallet = async () => {
    try {
      const res = await api.get('/wallet/balance');
      setBalance(res.data.balance || 0);
      setTransactions(res.data.transactions || []);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.warn('Failed to fetch wallet data', err.message);
      }
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleProcessFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundAmount || Number(fundAmount) <= 0) return;
    
    setIsProcessing(true);
    
    // Simulate real transaction delay
    setTimeout(async () => {
      setIsProcessing(false);
      setProcessingSuccess(true);
      
      try {
        await api.post('/wallet/add-funds', { amount: Number(fundAmount) });
        addNotification(`Successfully added ₹${fundAmount} to wallet`);
        fetchWallet();
      } catch (err) {
        console.error(err);
      }
      
      // Close modal after success animation
      setTimeout(() => {
        setProcessingSuccess(false);
        setShowAddFundsModal(false);
        setFundAmount(1000);
      }, 1500);
      
    }, 2000);
  };

  const handleSaveMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodDetails.trim()) return;
    
    const newMethod = {
      id: Date.now(),
      type: newMethodType,
      title: newMethodType === "CARD" ? `Card ending in ${newMethodDetails.slice(-4)}` : newMethodDetails,
      icon: newMethodType === "CARD" ? <CreditCard className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />
    };
    
    setSavedMethods([...savedMethods, newMethod]);
    addNotification("Payment method saved securely.");
    setShowAddMethodModal(false);
    setNewMethodDetails("");
  };

  const removeMethod = (id: number) => {
    setSavedMethods(savedMethods.filter(m => m.id !== id));
    addNotification("Payment method removed.");
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      <div>
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-ink leading-tight">Wallet & Escrow</h1>
        <p className="text-smoke font-medium text-[16px] mt-1">Manage your funds, payment methods, and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-charcoal text-paper rounded-2xl p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-paper/10 rounded-full blur-[50px] mix-blend-overlay -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <span className="text-[13px] font-semibold tracking-wider uppercase text-paper/70 mb-2 block">Available Balance</span>
              <div className="text-[56px] font-serif tracking-tight">₹{balance.toLocaleString()}</div>
            </div>
            
            <button 
              onClick={() => setShowAddFundsModal(true)}
              className="bg-paper text-ink px-8 py-3.5 rounded-full font-medium text-[15px] hover:bg-mist transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" /> Add Funds
            </button>
          </div>
        </div>

        {/* Escrow Card */}
        <div className="bg-paper rounded-2xl p-8 border border-smoke/30 flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-sand rounded-2xl border border-smoke/30">
              <ShieldCheck className="w-6 h-6 text-ink" />
            </div>
            <div>
              <span className="text-[12px] font-semibold uppercase tracking-wider text-smoke block">In Escrow</span>
              <div className="text-2xl font-serif tracking-tight text-ink">₹4,500</div>
            </div>
          </div>
          <p className="text-[13px] text-smoke font-medium leading-relaxed">Funds locked securely for active tasks. They are released only upon completion.</p>
        </div>
      </div>

      {/* Two Column Layout for the rest */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Transaction History (2/3) */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-serif text-ink mb-4">Transaction History</h3>
          
          <div className="bg-paper rounded-2xl border border-smoke/30 overflow-hidden shadow-sm">
            {transactions.length === 0 ? (
              <>
                <div className="flex items-center justify-between p-6 border-b border-smoke/30 hover:bg-sand/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-sand border border-smoke/30 text-ink">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-ink mb-1">Payment Escrowed</p>
                      <p className="text-[13px] text-smoke">Pitch Deck Polish • 2h ago</p>
                    </div>
                  </div>
                  <div className="font-serif text-[22px] tracking-tight text-ink">
                    -₹2,000
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-6 hover:bg-sand/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-ink text-paper border border-ink">
                      <ArrowDownLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-ink mb-1">Funds Added</p>
                      <p className="text-[13px] text-smoke">via UPI • 1d ago</p>
                    </div>
                  </div>
                  <div className="font-serif text-[22px] tracking-tight text-ink">
                    +₹10,000
                  </div>
                </div>
              </>
            ) : (
              transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-6 border-b border-smoke/30 hover:bg-sand/50 transition-colors last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full border ${tx.type === 'CREDIT' ? 'bg-ink text-paper border-ink' : 'bg-sand text-ink border-smoke/30'}`}>
                      {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-ink mb-1">{tx.description || (tx.type === 'CREDIT' ? 'Funds Added' : 'Payment Escrowed')}</p>
                      <p className="text-[13px] text-smoke">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-serif text-[22px] tracking-tight ${tx.type === 'CREDIT' ? 'text-ink' : 'text-smoke'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Saved Payment Methods (1/3) */}
        <div className="lg:col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif text-ink">Payment Methods</h3>
            <button 
              onClick={() => setShowAddMethodModal(true)}
              className="p-2 bg-sand hover:bg-smoke/20 rounded-full transition-colors text-ink"
              title="Add New Method"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {savedMethods.map((method) => (
              <div key={method.id} className="bg-paper p-5 rounded-2xl border border-smoke/30 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sand rounded-xl border border-smoke/30 text-ink">
                    {method.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-smoke mb-1">{method.type}</p>
                    <p className="text-[14px] font-bold text-ink">{method.title}</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeMethod(method.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-smoke hover:text-[#ff0000] transition-all rounded-full hover:bg-mist"
                  title="Remove Method"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {savedMethods.length === 0 && (
              <div className="bg-sand border border-dashed border-smoke/40 rounded-2xl p-6 text-center text-smoke text-[13px] font-medium">
                No payment methods saved.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal (Checkout Flow) */}
      {showAddFundsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-paper rounded-2xl border border-smoke/30 w-full max-w-md relative animate-fade-in-up shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-smoke/20 flex justify-between items-center bg-sand/30">
              <h2 className="text-[20px] font-serif tracking-tight text-ink">Add Funds</h2>
              <button onClick={() => setShowAddFundsModal(false)} className="p-2 bg-sand rounded-full hover:bg-smoke/20 transition-colors">
                <X className="w-4 h-4 text-ink" />
              </button>
            </div>

            {/* Modal Body */}
            {processingSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-16 h-16 bg-ink rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-paper" />
                </div>
                <h3 className="text-[24px] font-serif text-ink mb-2">Payment Successful</h3>
                <p className="text-smoke text-[14px]">₹{fundAmount} has been added to your wallet securely.</p>
              </div>
            ) : (
              <form onSubmit={handleProcessFunds} className="p-6">
                
                <div className="mb-6">
                  <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">Select Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[500, 1000, 5000].map(amt => (
                      <button 
                        type="button" 
                        key={amt}
                        onClick={() => setFundAmount(amt)}
                        className={`py-3 rounded-xl font-medium text-[14px] transition-all border ${fundAmount === amt ? 'bg-charcoal text-paper border-charcoal' : 'bg-sand text-ink border-smoke/30 hover:border-ink'}`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke font-medium">₹</span>
                    <input 
                      type="number" 
                      required min="100"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value ? Number(e.target.value) : "")}
                      className="w-full bg-sand border border-smoke/30 rounded-xl pl-8 pr-4 py-3 text-[16px] font-medium text-ink outline-none focus:border-ink transition-all"
                      placeholder="Custom amount"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">Pay Using</label>
                  <div className="space-y-3">
                    {savedMethods.map((method) => (
                      <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${selectedMethod === method.id ? 'border-ink bg-sand/50' : 'border-smoke/30 bg-paper hover:bg-sand/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${selectedMethod === method.id ? 'bg-ink text-paper' : 'bg-sand text-smoke'}`}>
                            {method.icon}
                          </div>
                          <span className={`text-[14px] font-bold ${selectedMethod === method.id ? 'text-ink' : 'text-ink/80'}`}>{method.title}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-ink' : 'border-smoke/30'}`}>
                          {selectedMethod === method.id && <div className="w-2.5 h-2.5 bg-ink rounded-full" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing || !fundAmount}
                  className="w-full bg-charcoal text-paper py-4 rounded-xl font-bold text-[15px] hover:opacity-90 transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-paper border-t-transparent rounded-full animate-spin" />
                      Processing securely...
                    </>
                  ) : (
                    `Pay ₹${fundAmount}`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-paper rounded-2xl border border-smoke/30 w-full max-w-md relative animate-fade-in-up shadow-2xl overflow-hidden">
            
            <div className="p-6 border-b border-smoke/20 flex justify-between items-center bg-sand/30">
              <h2 className="text-[20px] font-serif tracking-tight text-ink">Add Payment Method</h2>
              <button onClick={() => setShowAddMethodModal(false)} className="p-2 bg-sand rounded-full hover:bg-smoke/20 transition-colors">
                <X className="w-4 h-4 text-ink" />
              </button>
            </div>

            <form onSubmit={handleSaveMethod} className="p-6">
              
              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setNewMethodType("CARD")}
                  className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl border transition-all ${newMethodType === "CARD" ? 'border-ink bg-ink text-paper' : 'border-smoke/30 bg-sand text-ink hover:border-ink/50'}`}
                >
                  <CreditCard className="w-4 h-4" /> Card
                </button>
                <button 
                  type="button"
                  onClick={() => setNewMethodType("UPI")}
                  className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl border transition-all ${newMethodType === "UPI" ? 'border-ink bg-ink text-paper' : 'border-smoke/30 bg-sand text-ink hover:border-ink/50'}`}
                >
                  <Smartphone className="w-4 h-4" /> UPI
                </button>
              </div>

              {newMethodType === "CARD" ? (
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">Card Number</label>
                    <input 
                      type="text" required placeholder="0000 0000 0000 0000" maxLength={19}
                      value={newMethodDetails} onChange={e => setNewMethodDetails(e.target.value)}
                      className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">Expiry Date</label>
                      <input type="text" placeholder="MM/YY" className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">CVV</label>
                      <input type="password" placeholder="•••" maxLength={3} className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <label className="block text-[12px] font-semibold text-ink uppercase tracking-wider mb-2">UPI ID</label>
                  <input 
                    type="text" required placeholder="name@bank"
                    value={newMethodDetails} onChange={e => setNewMethodDetails(e.target.value)}
                    className="w-full bg-sand border border-smoke/30 rounded-xl px-4 py-3 text-[14px] font-medium text-ink outline-none focus:border-ink transition-all"
                  />
                  <p className="text-[12px] text-smoke mt-2">A verification request will be sent to your UPI app.</p>
                </div>
              )}

              <button type="submit" className="w-full bg-charcoal text-paper py-4 rounded-xl font-bold text-[15px] hover:opacity-90 transition-all shadow-lg">
                Save & Verify
              </button>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
}
