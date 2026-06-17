import sys

def main():
    file_path = "e:/quickmatte/frontend-web/src/app/dashboard/page.tsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the starting fragment and replace with a div
    content = content.replace(
        "            ) : (\n              <>\n                {/* Dashboard Stats */}",
        '            ) : (\n              <div className="w-full">\n                {/* Dashboard Stats */}'
    )
    
    # Find the ending fragment and replace with a closing div
    content = content.replace(
        "            </div>\n            </>\n          </div>\n        )}",
        "            </div>\n            </div>\n          </div>\n        )}"
    )

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print("Success")

if __name__ == "__main__":
    main()
