import sys

def main():
    file_path = "e:/quickmatte/frontend-web/src/app/dashboard/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # 1. Update Navigation Buttons
    nav_start = -1
    for i, line in enumerate(lines):
        if "My Tasks" in line and "className=" not in line:
            nav_start = i
            break
            
    if nav_start != -1:
        # We find the button definition for My Tasks and change its onClick to activeRole="customer"
        for i in range(nav_start - 10, nav_start):
            if 'setActiveRole("helper");' in lines[i]:
                lines[i] = lines[i].replace('"helper"', '"customer"')
        
        # Insert "Become a Mate" button right after the "My Tasks" button
        end_my_tasks = -1
        for i in range(nav_start, nav_start + 10):
            if "</button>" in lines[i]:
                end_my_tasks = i
                break
                
        if end_my_tasks != -1:
            become_mate_btn = """            <button
              onClick={() => {
                setActiveRole("helper");
                setCurrentTab("dashboard");
              }}
              className="text-[15px] font-bold text-[#212529] hover:text-[#0D7F64] transition-colors cursor-pointer"
            >
              Become a Mate
            </button>\n"""
            lines.insert(end_my_tasks + 1, become_mate_btn)

    # 2. Update Helper Mode View
    helper_start = -1
    for i, line in enumerate(lines):
        if "{/* ==================== HELPER MODE VIEW ==================== */}" in line:
            helper_start = i
            break
            
    if helper_start != -1:
        # Find the line after <div className="mt-8 space-y-8">
        div_start = -1
        for i in range(helper_start, helper_start + 5):
            if '<div className="mt-8 space-y-8">' in lines[i]:
                div_start = i
                break
                
        if div_start != -1:
            verify_check = """            {verificationState.status !== "Verified" ? (
              <div className="rounded-2xl border border-[#ced4da] bg-white p-8 shadow-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-6">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-extrabold text-[#212529] mb-2">
                  Verify Your Identity to Become a Mate
                </h2>
                <p className="text-[#6c757d] mb-8 max-w-lg mx-auto">
                  To ensure the safety of our community, all Mates must undergo a quick KYC verification before they can start accepting tasks.
                </p>
                <div className="max-w-md mx-auto space-y-4">
                  <div className="text-left">
                    <label className="block text-sm font-bold text-[#212529] mb-2">Select Document Type</label>
                    <select
                      value={verificationState.docType}
                      onChange={(e) => setVerificationState(prev => ({ ...prev, docType: e.target.value }))}
                      disabled={verificationState.status !== "Pending Upload"}
                      className="w-full rounded-md border border-[#ced4da] bg-white px-4 py-3 outline-none focus:border-[#0D7F64] disabled:opacity-50"
                    >
                      <option>Aadhar Card</option>
                      <option>PAN Card</option>
                      <option>Driving License</option>
                    </select>
                  </div>
                  
                  {verificationState.status === "Pending Upload" && (
                    <button
                      onClick={() => {
                        setVerificationState(prev => ({ ...prev, status: "Uploading" }));
                        setTimeout(() => {
                          setVerificationState(prev => ({ ...prev, status: "Pending Review" }));
                        }, 2000);
                      }}
                      className="w-full rounded-md border-2 border-dashed border-[#ced4da] bg-[#f8f9fa] py-10 font-bold text-[#0D7F64] hover:bg-[#e9ecef] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <Upload className="h-6 w-6" />
                      Click to upload {verificationState.docType}
                    </button>
                  )}

                  {verificationState.status === "Uploading" && (
                    <div className="w-full rounded-md border border-[#ced4da] bg-[#f8f9fa] py-10 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 text-[#0D7F64] animate-spin" />
                      <p className="font-bold text-[#212529]">Uploading securely...</p>
                    </div>
                  )}

                  {verificationState.status === "Pending Review" && (
                    <div className="w-full rounded-md border border-amber-200 bg-amber-50 py-6 px-4 flex items-center justify-center gap-3 text-left">
                      <FileText className="h-6 w-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-amber-800">Document under review</p>
                        <p className="text-sm text-amber-700 mt-1">We will notify you once verified. You can simulate approval by refreshing the page later. (Demo mode)</p>
                        <button 
                          onClick={() => setVerificationState(prev => ({ ...prev, status: "Verified" }))}
                          className="mt-3 text-xs font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded hover:bg-amber-300 transition-colors cursor-pointer"
                        >
                          Dev: Force Approve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
"""
            lines.insert(div_start + 1, verify_check)
            
            # Find the end of HELPER MODE VIEW which is right before {/* 4. Chat Sim */}
            chat_start = -1
            for j in range(div_start, len(lines)):
                if "{/* 4. Chat Sim Modal */}" in lines[j] or "Chat Sim" in lines[j] or "ChatSim" in lines[j]:
                    chat_start = j
                    break
            
            if chat_start != -1:
                # We need to insert `</>` before the closing div of helper view
                # The closing div is usually right before Chat Sim Modal
                for j in range(chat_start, chat_start-10, -1):
                    if "</div>" in lines[j]:
                        lines.insert(j, "              </>\n            )}\n")
                        break

    with open(file_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Success")

if __name__ == "__main__":
    main()
