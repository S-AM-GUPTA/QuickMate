import sys

def main():
    file_path = "e:/quickmatte/frontend-web/src/app/dashboard/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # The issue is the missing closing brace for the ternary operator.
    # Currently it ends with:
    #             </div>
    #             </div>
    #           </div>
    #         )}
    # It should be:
    #             </div>
    #           )}
    #         </div>
    #       )}

    content = content.replace(
        "            </div>\n            </div>\n          </div>\n        )}",
        "            </div>\n            )}\n          </div>\n        )}"
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Success")

if __name__ == "__main__":
    main()
