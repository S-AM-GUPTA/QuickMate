import sys

def main():
    file_path = "e:/quickmatte/frontend-web/src/app/dashboard/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # 1. Replace background color
    for i, line in enumerate(lines):
        if 'className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300"' in line:
            lines[i] = line.replace('bg-slate-50 font-sans text-slate-900 transition-colors duration-300', 'bg-[#f6f6f6] font-sans text-[#212529]')
            break
            
    # 2. Replace Header (approx 402 to 480)
    start_header = -1
    end_header = -1
    for i, line in enumerate(lines):
        if "{/* Navigation Header */}" in line:
            start_header = i
            break
            
    if start_header != -1:
        for i in range(start_header, len(lines)):
            if "</header>" in lines[i]:
                end_header = i
                break
                
    new_header = """      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#e9ecef] bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentTab('dashboard')} className="flex items-center gap-2 cursor-pointer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#0D7F64"/>
                <path d="M11 7h2v5h-2zm0 6h2v2h-2z" fill="#0D7F64"/>
              </svg>
              <span className="text-2xl font-bold tracking-tight text-[#0D7F64]">taskrabbit</span>
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveRole("customer");
                setCurrentTab("dashboard");
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Book a Task
            </button>
            <button
              onClick={() => {
                setActiveRole("helper");
                setCurrentTab("dashboard");
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              My Tasks
            </button>
            <button
              onClick={() => setCurrentTab("profile")}
              className="text-[15px] font-extrabold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Account
            </button>
          </div>
        </div>
      </header>
"""
    if start_header != -1 and end_header != -1:
        lines = lines[:start_header] + [new_header] + lines[end_header+1:]

    # 3. Replace Profile block
    start_profile = -1
    end_profile = -1
    for i, line in enumerate(lines):
        if "{/* ==================== CUSTOMER PROFILE VIEW ==================== */}" in line:
            start_profile = i
            break
            
    if start_profile != -1:
        for i in range(start_profile, len(lines)):
            if "{/* ==================== SETTINGS VIEW ==================== */}" in lines[i]:
                end_profile = i
                break
                
    new_profile = """        {/* ==================== UNIFIED ACCOUNT VIEW ==================== */}
        {currentTab === "profile" && (
          <div className="mt-8 max-w-[1000px] mx-auto space-y-6">
            <h1 className="text-[32px] font-extrabold text-[#212529] mb-6">Your Account</h1>
            
            <div className="flex flex-col md:flex-row border border-[#ced4da] rounded-sm bg-white overflow-hidden">
              {/* Left Sidebar */}
              <div className="w-full md:w-[280px] bg-[#f8f9fa] border-r border-[#ced4da] flex flex-col shrink-0">
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#212529] border-l-4 border-[#0D7F64] bg-white">
                  Profile
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Password
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Account Security
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Notifications
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Billing Info
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Cancel a Task
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Business Information
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Account Balance
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Transactions
                </button>
                <button className="px-6 py-4 text-left text-[15px] font-bold text-[#0D7F64] border-l-4 border-transparent hover:bg-white hover:text-[#0a6650] transition-colors">
                  Delete Account
                </button>
              </div>
              
              {/* Main Content Box */}
              <div className="flex-1 p-8">
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
                      <span className="text-[17px] font-bold">23456</span>
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
              </div>
            </div>
          </div>
        )}
"""
    if start_profile != -1 and end_profile != -1:
        lines = lines[:start_profile] + [new_profile] + lines[end_profile:]

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)

    print("Success: dashboard/page.tsx rewritten")

if __name__ == "__main__":
    main()
