import sys

def main():
    file_path = "e:/quickmatte/frontend-web/src/app/dashboard/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    start_idx = -1
    end_idx = -1
    for i, line in enumerate(lines):
        if "{/* ==================== UNIFIED ACCOUNT VIEW ==================== */}" in line:
            start_idx = i
        if "{/* ==================== SETTINGS VIEW ==================== */}" in line:
            end_idx = i
            break
            
    if start_idx == -1 or end_idx == -1:
        print("Could not find blocks")
        return
        
    new_block = """        {/* ==================== UNIFIED ACCOUNT VIEW ==================== */}
        {currentTab === "profile" && (
          <div className="mt-8 max-w-[1000px] mx-auto space-y-6">
            <h1 className="text-[32px] font-extrabold text-[#212529] mb-6">Your Account</h1>
            
            <div className="flex flex-col md:flex-row border border-[#ced4da] rounded-sm bg-white overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-full md:w-[280px] bg-[#f8f9fa] border-r border-[#ced4da] flex flex-col shrink-0">
                {[
                  "Profile",
                  "Password",
                  "Account Security",
                  "Notifications",
                  "Billing Info",
                  "Cancel a Task",
                  "Business Information",
                  "Account Balance",
                  "Transactions",
                  "Delete Account"
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAccountTab(tab)}
                    className={`px-6 py-4 text-left text-[15px] font-bold transition-colors cursor-pointer ${
                      accountTab === tab
                        ? "text-[#212529] border-l-4 border-[#0D7F64] bg-white"
                        : "text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              {/* Main Content Box */}
              <div className="flex-1 p-8">
                {accountTab === "Profile" && (
                  <>
                    <div className="flex justify-between items-center border-b border-[#ced4da] pb-3 mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#212529]">Account</h2>
                      <button className="rounded-md border border-[#ced4da] bg-white px-5 py-1.5 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors cursor-pointer">
                        Edit
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                      <div className="h-[160px] w-[160px] rounded-full bg-[#e9ecef] flex items-center justify-center overflow-hidden shrink-0 border border-[#ced4da]">
                        <User className="h-[100px] w-[100px] text-[#ced4da]" />
                      </div>
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3 text-[#212529]">
                          <User className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <Mail className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <Phone className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#212529]">
                          <MapPin className="h-[18px] w-[18px] text-[#495057]" />
                          <span className="text-[17px] font-bold">{profileData.postalCode || '110001'}</span>
                        </div>
                        <div className="pt-4">
                          <button 
                            onClick={() => {
                              localStorage.removeItem("token");
                              router.push("/login");
                            }}
                            className="rounded-md border border-[#ced4da] bg-white px-5 py-2 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {accountTab === "Password" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Password</h2>
                    <div className="space-y-4 max-w-sm">
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Password</button>
                    </div>
                  </div>
                )}

                {accountTab === "Account Security" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Account Security</h2>
                    <div className="p-6 border border-[#ced4da] rounded-md flex justify-between items-center bg-[#f8f9fa]">
                      <div>
                        <p className="font-bold text-[#212529]">Two-Factor Authentication (2FA)</p>
                        <p className="text-sm text-[#6c757d]">Add an extra layer of security to your account.</p>
                      </div>
                      <button className="rounded-full bg-white border border-[#ced4da] text-[#212529] px-6 py-2 font-semibold hover:bg-gray-50 transition-colors">Enable 2FA</button>
                    </div>
                  </div>
                )}

                {accountTab === "Notifications" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Notifications</h2>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">Email Notifications (Task Updates, Promotions)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">SMS Notifications (Urgent Alerts)</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="w-5 h-5 accent-[#0D7F64]" />
                        <span className="font-semibold text-[#212529]">Push Notifications</span>
                      </label>
                      <div className="pt-4">
                        <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Preferences</button>
                      </div>
                    </div>
                  </div>
                )}

                {accountTab === "Billing Info" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-[#ced4da] pb-3 mb-6">
                      <h2 className="text-[22px] font-extrabold text-[#212529]">Billing Info</h2>
                      <button className="rounded-md border border-[#ced4da] bg-white px-5 py-1.5 text-[14px] font-semibold text-[#212529] hover:bg-[#f8f9fa] transition-colors">
                        Add New Card
                      </button>
                    </div>
                    <div className="p-4 border border-[#ced4da] rounded-md flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-[#e9ecef] w-12 h-8 rounded flex items-center justify-center text-xs font-bold text-[#495057]">VISA</div>
                        <div>
                          <p className="font-bold text-[#212529]">Visa ending in 4242</p>
                          <p className="text-sm text-[#6c757d]">Expires 12/2028 (Default)</p>
                        </div>
                      </div>
                      <button className="text-red-600 text-sm font-bold hover:underline">Remove</button>
                    </div>
                  </div>
                )}

                {accountTab === "Cancel a Task" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Cancel a Task</h2>
                    {tasks.filter(t => t.status === "OPEN").length === 0 ? (
                      <p className="text-[#6c757d]">You have no open tasks to cancel.</p>
                    ) : (
                      <div className="space-y-4">
                        {tasks.filter(t => t.status === "OPEN").map(task => (
                          <div key={task.id} className="p-4 border border-[#ced4da] rounded-md flex justify-between items-center">
                            <div>
                              <p className="font-bold text-[#212529]">{task.title}</p>
                              <p className="text-sm text-[#6c757d]">Scheduled: {new Date(task.scheduledTime).toLocaleDateString()}</p>
                            </div>
                            <button className="rounded-full bg-white border border-red-200 text-red-600 px-4 py-1.5 text-sm font-bold hover:bg-red-50 transition-colors">Cancel Task</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {accountTab === "Business Information" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Business Information</h2>
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6 text-sm text-yellow-800">
                      If you provide services as a registered business, please fill in your details below for tax and invoicing purposes.
                    </div>
                    <div className="space-y-4 max-w-sm">
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">Business Name</label>
                        <input type="text" placeholder="e.g. Acme Services" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#212529] mb-1.5">GST/Tax ID</label>
                        <input type="text" placeholder="Tax Number" className="w-full rounded-md border border-[#ced4da] px-4 py-2 outline-none focus:border-[#0D7F64]" />
                      </div>
                      <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Save Details</button>
                    </div>
                  </div>
                )}

                {accountTab === "Account Balance" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Account Balance</h2>
                    <div className="p-8 border border-[#ced4da] rounded-md text-center bg-[#f8f9fa]">
                      <p className="text-sm font-bold text-[#6c757d] uppercase tracking-wider mb-2">Available Wallet Balance</p>
                      <p className="text-4xl font-extrabold text-[#212529] mb-6">₹ 4,500.00</p>
                      <div className="flex gap-4 justify-center">
                        <button className="rounded-full bg-[#0D7F64] text-white px-6 py-2.5 font-bold hover:bg-[#0a6650] transition-colors">Add Funds</button>
                        <button className="rounded-full bg-white border border-[#ced4da] text-[#212529] px-6 py-2.5 font-bold hover:bg-gray-50 transition-colors">Withdraw</button>
                      </div>
                    </div>
                  </div>
                )}

                {accountTab === "Transactions" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Transactions</h2>
                    <div className="border border-[#ced4da] rounded-md overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#f8f9fa] border-b border-[#ced4da]">
                          <tr>
                            <th className="p-3 font-bold text-[#495057]">Date</th>
                            <th className="p-3 font-bold text-[#495057]">Description</th>
                            <th className="p-3 font-bold text-[#495057]">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e9ecef]">
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 12, 2026</td>
                            <td className="p-3 text-[#212529]">Payment for Delivery Task</td>
                            <td className="p-3 font-bold text-red-600">- ₹ 150.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 10, 2026</td>
                            <td className="p-3 text-[#212529]">Wallet Top-up</td>
                            <td className="p-3 font-bold text-green-600">+ ₹ 1,000.00</td>
                          </tr>
                          <tr>
                            <td className="p-3 text-[#212529]">Oct 01, 2026</td>
                            <td className="p-3 text-[#212529]">Refund (Cancelled Task)</td>
                            <td className="p-3 font-bold text-green-600">+ ₹ 500.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {accountTab === "Delete Account" && (
                  <div className="space-y-6">
                    <h2 className="text-[22px] font-extrabold text-[#212529] border-b border-[#ced4da] pb-3 mb-6">Delete Account</h2>
                    <div className="p-6 border border-red-200 bg-red-50 rounded-md">
                      <h3 className="font-bold text-red-700 text-lg mb-2">Warning: Permanent Action</h3>
                      <p className="text-red-700 text-sm mb-6">
                        Deleting your account will permanently erase your profile, wallet balance, active tasks, and transaction history. This action cannot be undone.
                      </p>
                      <button className="rounded-full bg-red-600 text-white px-6 py-2.5 font-bold hover:bg-red-700 transition-colors">
                        Permanently Delete My Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
"""
    lines = lines[:start_idx] + [new_block] + lines[end_idx:]

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Success")

if __name__ == "__main__":
    main()
