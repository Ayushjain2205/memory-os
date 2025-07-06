console.log("[MemoryOS Extension] Content script loaded.");

// Inject Poppins font if not already present
(function injectPoppinsFont() {
  if (!document.getElementById("memoryos-poppins-font")) {
    const link = document.createElement("link");
    link.id = "memoryos-poppins-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap";
    document.head.appendChild(link);
  }
})();

// Loader SVG generator (must be at top level for global access)
function getLoaderSVG(color) {
  return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="4" opacity="0.2"/><circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="80" stroke-dashoffset="60"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="1s" repeatCount="indefinite"/></circle></svg>`;
}

// Modes array and SVGs (must be at the very top for global access)
const modes = [
  {
    name: "Personal",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="#2563eb" stroke-width="1.5"/><path d="M16.667 16.667c0-2.577-3-4.334-6.667-4.334s-6.667 1.757-6.667 4.334" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    bg: "#e8f0fe",
    color: "#2563eb",
  },
  {
    name: "Work",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="7.5" width="13" height="8" rx="2" stroke="#22c55e" stroke-width="1.5"/><path d="M7 7V5.5A2.5 2.5 0 0 1 12 5.5V7" stroke="#22c55e" stroke-width="1.5"/></svg>`,
    bg: "#e6faea",
    color: "#22c55e",
  },
  {
    name: "Health",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17s-6-4.686-6-8.5A4.5 4.5 0 0 1 10 4a4.5 4.5 0 0 1 6 4.5C16 12.314 10 17 10 17Z" stroke="#ef4444" stroke-width="1.5"/></svg>`,
    bg: "#fdeaea",
    color: "#ef4444",
  },
  {
    name: "Travel",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 16.5 16.5 3.5m0 0-4.5-.5m4.5.5-.5 4.5" stroke="#a78bfa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bg: "#f3e8ff",
    color: "#a78bfa",
  },
];

// Add the second dropdown options for response memory
const memoryTypes = [
  {
    name: "Goal",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="6" fill="#E6FAEA"/><path d="M10 15.5c3.038 0 5.5-2.462 5.5-5.5S13.038 4.5 10 4.5 4.5 6.962 4.5 10s2.462 5.5 5.5 5.5Z" stroke="#22C55E" stroke-width="1.5"/><path d="M10 7.5v3l2 2" stroke="#22C55E" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    color: "#22C55E",
    bg: "#E6FAEA",
  },
  {
    name: "Preference",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="6" fill="#F3E8FF"/><path d="M10 14.5l-1.618-1.07a1 1 0 0 1-.382-1.118l.618-1.902-1.618-1.07a1 1 0 0 1 .618-1.764h2l.618-1.902a1 1 0 0 1 1.764 0l.618 1.902h2a1 1 0 0 1 .618 1.764l-1.618 1.07.618 1.902a1 1 0 0 1-1.382 1.118L10 14.5Z" stroke="#A78BFA" stroke-width="1.5"/></svg>`,
    color: "#A78BFA",
    bg: "#F3E8FF",
  },
  {
    name: "Fact",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="6" fill="#E8F0FE"/><path d="M10 14.5v-1m0-6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" stroke="#2563EB" stroke-width="1.5"/><circle cx="10" cy="10" r="7.25" stroke="#2563EB" stroke-width="1.5"/></svg>`,
    color: "#2563EB",
    bg: "#E8F0FE",
  },
  {
    name: "Note",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="6" fill="#F4F4F5"/><rect x="6" y="7" width="8" height="6" rx="1" stroke="#71717A" stroke-width="1.5"/><path d="M8 9h4" stroke="#71717A" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    color: "#71717A",
    bg: "#F4F4F5",
  },
  {
    name: "Document",
    icon: `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="20" height="20" rx="6" fill="#E8F0FE"/><rect x="6" y="6" width="8" height="8" rx="1" stroke="#2563EB" stroke-width="1.5"/><path d="M8 9h4" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    color: "#2563EB",
    bg: "#E8F0FE",
  },
];

function injectMemoryButton() {
  // Find the composer trailing actions container
  const trailingActions = document.querySelector(
    'div[data-testid="composer-trailing-actions"]'
  );
  if (!trailingActions) return;

  // Prevent duplicate buttons
  if (document.getElementById("memoryos-add-memory-btn")) return;

  // Create the image button
  const btn = document.createElement("button");
  btn.id = "memoryos-add-memory-btn";
  btn.title = "Add to Memory";
  btn.style.padding = "0";
  btn.style.width = "44px";
  btn.style.height = "44px";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "9999";
  btn.style.boxShadow = "none";
  btn.style.background = "none";
  btn.style.border = "none";

  // Add the logo image
  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("logo.png");
  img.alt = "Add to Memory";
  img.style.width = "32px";
  img.style.height = "32px";
  img.style.objectFit = "contain";
  img.style.display = "block";
  btn.appendChild(img);

  // Dropdown menu in document.body
  let menu = null;
  let menuHovered = false;
  let btnHovered = false;

  function showMenu(selectedIdx = 0) {
    if (menu) return;
    menu = document.createElement("div");
    menu.id = "memoryos-memory-menu";
    menu.style.position = "absolute";
    menu.style.background = "#fff";
    menu.style.border = "none";
    menu.style.borderRadius = "12px";
    menu.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
    menu.style.padding = "8px 0";
    menu.style.minWidth = "180px";
    menu.style.fontSize = "16px";
    menu.style.fontWeight = "400";
    menu.style.zIndex = "2147483647";
    menu.style.fontFamily = "Poppins, sans-serif";
    menu.style.color = "#222";

    modes.forEach((mode, idx) => {
      const item = document.createElement("div");
      item.innerHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:${
        mode.bg
      };margin-right:12px;">${mode.icon}</span><span style="font-weight:${
        idx === selectedIdx ? "600" : "400"
      };color:${idx === selectedIdx ? mode.color : "#222"};font-size:17px;">${
        mode.name
      }</span>`;
      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.padding = "6px 18px";
      item.style.cursor = "pointer";
      item.style.whiteSpace = "nowrap";
      item.style.borderRadius = "8px";
      item.style.margin = "2px 8px";
      item.style.transition = "background 0.15s";
      if (idx === selectedIdx) {
        item.style.background = "#e8f0fe";
      }
      item.addEventListener("mouseenter", () => {
        item.style.background = "#e8f0fe";
        item.querySelector("span:last-child").style.color = mode.color;
        item.querySelector("span:last-child").style.fontWeight = "600";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
        item.querySelector("span:last-child").style.color =
          idx === selectedIdx ? mode.color : "#222";
        item.querySelector("span:last-child").style.fontWeight =
          idx === selectedIdx ? "600" : "400";
      });
      item.addEventListener("click", () => {
        hideMenu();
        // Replace logo with loader
        btn.innerHTML = getLoaderSVG(mode.color);
        btn.disabled = true;
        setTimeout(() => {
          // Restore logo
          btn.innerHTML = "";
          btn.appendChild(img);
          btn.disabled = false;
          // Append to prompt box
          const promptBox = document.querySelector(
            'div#prompt-textarea[contenteditable="true"]'
          );
          if (promptBox) {
            const p = document.createElement("p");
            p.innerHTML = `<b>${mode.name}:</b> asdasdas asdasdd as`;
            promptBox.appendChild(p);
            promptBox.focus();
          }
        }, 5000);
      });
      menu.appendChild(item);
    });

    // Track hover state for menu
    menu.addEventListener("mouseenter", () => {
      menuHovered = true;
    });
    menu.addEventListener("mouseleave", () => {
      menuHovered = false;
      setTimeout(() => {
        if (!btnHovered && !menuHovered) hideMenu();
      }, 100);
    });

    document.body.appendChild(menu);
    // Position above the button (for prompt button)
    const rect = btn.getBoundingClientRect();
    menu.style.left = rect.left + "px";
    menu.style.top = rect.top - menu.offsetHeight - 8 + "px";
    // If menu height is not available yet, use a default offset
    setTimeout(() => {
      if (menu) {
        menu.style.top = rect.top - menu.offsetHeight - 8 + "px";
      }
    }, 0);
  }

  function hideMenu() {
    if (menu) {
      menu.remove();
      menu = null;
    }
  }

  // Track hover state for button
  btn.addEventListener("mouseenter", () => {
    btnHovered = true;
    showMenu();
  });
  btn.addEventListener("mouseleave", () => {
    btnHovered = false;
    setTimeout(() => {
      if (!btnHovered && !menuHovered) hideMenu();
    }, 100);
  });
  btn.addEventListener("focus", showMenu);
  btn.addEventListener("blur", hideMenu);

  // Insert the button at the start of the trailing actions container
  trailingActions.insertBefore(btn, trailingActions.firstChild);
}

// Try to inject the button on page load and when DOM changes
const observer = new MutationObserver(() => {
  injectMemoryButton();
});

window.addEventListener("DOMContentLoaded", injectMemoryButton);
observer.observe(document.body, { childList: true, subtree: true });

// Add memory button SVG
const addMemorySVG = `<span class="touch:w-10 flex h-8 w-8 items-center justify-center"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="icon"><path d="M2.66821 12.6663V12.5003C2.66821 12.1331 2.96598 11.8353 3.33325 11.8353C3.70052 11.8353 3.99829 12.1331 3.99829 12.5003V12.6663C3.99829 13.3772 3.9992 13.8707 4.03052 14.2542C4.0612 14.6298 4.11803 14.8413 4.19849 14.9993L4.2688 15.1263C4.44511 15.4137 4.69813 15.6481 5.00024 15.8021L5.13013 15.8577C5.2739 15.9092 5.46341 15.947 5.74536 15.97C6.12888 16.0014 6.62221 16.0013 7.33325 16.0013H12.6663C13.3771 16.0013 13.8707 16.0014 14.2542 15.97C14.6295 15.9394 14.8413 15.8825 14.9993 15.8021L15.1262 15.7308C15.4136 15.5545 15.6481 15.3014 15.802 14.9993L15.8577 14.8695C15.9091 14.7257 15.9469 14.536 15.97 14.2542C16.0013 13.8707 16.0012 13.3772 16.0012 12.6663V12.5003C16.0012 12.1332 16.2991 11.8355 16.6663 11.8353C17.0335 11.8353 17.3313 12.1331 17.3313 12.5003V12.6663C17.3313 13.3553 17.3319 13.9124 17.2952 14.3626C17.2624 14.7636 17.1974 15.1247 17.053 15.4613L16.9866 15.6038C16.7211 16.1248 16.3172 16.5605 15.8215 16.8646L15.6038 16.9866C15.227 17.1786 14.8206 17.2578 14.3625 17.2952C13.9123 17.332 13.3553 17.3314 12.6663 17.3314H7.33325C6.64416 17.3314 6.0872 17.332 5.63696 17.2952C5.23642 17.2625 4.87552 17.1982 4.53931 17.054L4.39673 16.9866C3.87561 16.7211 3.43911 16.3174 3.13501 15.8216L3.01294 15.6038C2.82097 15.2271 2.74177 14.8206 2.70435 14.3626C2.66758 13.9124 2.66821 13.3553 2.66821 12.6663ZM9.33521 12.5003V4.9388L7.13696 7.13704C6.87732 7.39668 6.45625 7.39657 6.19653 7.13704C5.93684 6.87734 5.93684 6.45631 6.19653 6.19661L9.52954 2.86263L9.6311 2.77962C9.73949 2.70742 9.86809 2.66829 10.0002 2.66829C10.1763 2.66838 10.3454 2.73819 10.47 2.86263L13.804 6.19661C14.0633 6.45628 14.0634 6.87744 13.804 7.13704C13.5443 7.39674 13.1222 7.39674 12.8625 7.13704L10.6653 4.93977V12.5003C10.6651 12.8673 10.3673 13.1652 10.0002 13.1654C9.63308 13.1654 9.33538 12.8674 9.33521 12.5003Z"></path></svg></span>`;

function addMemoryButtonsToResponses() {
  // Find all assistant responses
  const responses = document.querySelectorAll(
    'div[data-message-author-role="assistant"][data-message-id]'
  );
  responses.forEach((response) => {
    // Find the closest action bar after the response
    let actionBar = null;
    let el = response.parentElement;
    while (el && !actionBar) {
      actionBar = Array.from(el.querySelectorAll("div.flex.items-center")).find(
        (bar) => bar.querySelector("button[data-testid]")
      );
      el = el.nextElementSibling;
    }
    if (!actionBar) {
      let sibling = response.parentElement?.parentElement?.nextElementSibling;
      if (sibling) {
        actionBar = sibling.querySelector("div.flex.items-center");
      }
    }
    if (!actionBar) {
      console.log(
        "[MemoryOS Extension] No action bar found for response:",
        response
      );
      return;
    }
    if (actionBar.querySelector(".memoryos-add-memory-response-btn")) return;
    // Create the logo button
    const btn = document.createElement("button");
    btn.className =
      "memoryos-add-memory-response-btn text-token-text-secondary hover:bg-token-bg-secondary rounded-lg";
    btn.setAttribute("aria-label", "Save to MemoryOS");
    btn.title = "Save to MemoryOS";
    btn.style.border = "none";
    btn.style.background = "none";
    btn.style.cursor = "pointer";
    btn.style.padding = "0";
    btn.style.width = "32px";
    btn.style.height = "32px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    // Add the logo image (20x20 like other icons)
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("logo.png");
    img.alt = "Save to MemoryOS";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.objectFit = "contain";
    img.style.display = "block";
    btn.appendChild(img);
    // Dropdown logic (separate menu for each response button)
    let menu = null;
    let menuHovered = false;
    let btnHovered = false;
    btn.addEventListener("mouseenter", () => {
      btnHovered = true;
      showMenuForButton(btn);
    });
    btn.addEventListener("mouseleave", () => {
      btnHovered = false;
      setTimeout(() => {
        if (!btnHovered && !menuHovered) hideMenuForButton();
      }, 100);
    });
    btn.addEventListener("focus", () => showMenuForButton(btn));
    btn.addEventListener("blur", hideMenuForButton);
    function showMenuForButton(targetBtn, selectedIdx = 0) {
      if (menu) return;
      menu = document.createElement("div");
      menu.id = "memoryos-memory-menu-response";
      menu.style.position = "absolute";
      menu.style.background = "#fff";
      menu.style.border = "none";
      menu.style.borderRadius = "12px";
      menu.style.boxShadow = "0 4px 24px rgba(0,0,0,0.10)";
      menu.style.padding = "8px 0";
      menu.style.minWidth = "180px";
      menu.style.fontSize = "16px";
      menu.style.fontWeight = "400";
      menu.style.zIndex = "2147483647";
      menu.style.fontFamily = "Poppins, sans-serif";
      menu.style.color = "#222";
      modes.forEach((mode, idx) => {
        const item = document.createElement("div");
        item.innerHTML = `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:${
          mode.bg
        };margin-right:12px;">${mode.icon}</span><span style="font-weight:${
          idx === selectedIdx ? "600" : "400"
        };color:${idx === selectedIdx ? mode.color : "#222"};font-size:17px;">${
          mode.name
        }</span>`;
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.padding = "6px 18px";
        item.style.cursor = "pointer";
        item.style.whiteSpace = "nowrap";
        item.style.borderRadius = "8px";
        item.style.margin = "2px 8px";
        item.style.transition = "background 0.15s";
        if (idx === selectedIdx) {
          item.style.background = "#e8f0fe";
        }
        item.addEventListener("mouseenter", () => {
          item.style.background = "#e8f0fe";
          item.querySelector("span:last-child").style.color = mode.color;
          item.querySelector("span:last-child").style.fontWeight = "600";
        });
        item.addEventListener("mouseleave", () => {
          item.style.background = "transparent";
          item.querySelector("span:last-child").style.color =
            idx === selectedIdx ? mode.color : "#222";
          item.querySelector("span:last-child").style.fontWeight =
            idx === selectedIdx ? "600" : "400";
        });
        // On click: show the second dropdown
        item.addEventListener("click", () => {
          // Replace menu with second dropdown
          menu.innerHTML = "";
          memoryTypes.forEach((type, tIdx) => {
            const tItem = document.createElement("div");
            tItem.innerHTML = `<span style=\"display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:${type.bg};margin-right:12px;\">${type.icon}</span><span style=\"font-weight:400;color:#222;font-size:17px;\">${type.name}</span>`;
            tItem.style.display = "flex";
            tItem.style.alignItems = "center";
            tItem.style.padding = "6px 18px";
            tItem.style.cursor = "pointer";
            tItem.style.whiteSpace = "nowrap";
            tItem.style.borderRadius = "8px";
            tItem.style.margin = "2px 8px";
            tItem.style.transition = "background 0.15s";
            tItem.addEventListener("mouseenter", () => {
              tItem.style.background = "#e8f0fe";
              tItem.querySelector("span:last-child").style.color = type.color;
              tItem.querySelector("span:last-child").style.fontWeight = "600";
            });
            tItem.addEventListener("mouseleave", () => {
              tItem.style.background = "transparent";
              tItem.querySelector("span:last-child").style.color = "#222";
              tItem.querySelector("span:last-child").style.fontWeight = "400";
            });
            tItem.addEventListener("click", () => {
              // Final selection: close menu and show loader, then thumbs up, then logo
              hideMenuForButton();
              btn.innerHTML = getLoaderSVG(type.color);
              btn.disabled = true;
              setTimeout(() => {
                btn.innerHTML =
                  '<span style="font-size: 22px; display: flex; align-items: center; justify-content: center; width: 20px; height: 20px;">👍</span>';
                setTimeout(() => {
                  btn.innerHTML = "";
                  btn.appendChild(img);
                  btn.disabled = false;
                }, 1000);
              }, 2000);
              console.log(
                `[MemoryOS Extension] Saved as ${type.name} in mode ${mode.name}`
              );
            });
            menu.appendChild(tItem);
          });
        });
        menu.appendChild(item);
      });
      menu.addEventListener("mouseenter", () => {
        menuHovered = true;
      });
      menu.addEventListener("mouseleave", () => {
        menuHovered = false;
        setTimeout(() => {
          if (!btnHovered && !menuHovered) hideMenuForButton();
        }, 100);
      });
      document.body.appendChild(menu);
      // Position below the button (for response buttons)
      const rect = targetBtn.getBoundingClientRect();
      menu.style.left = rect.left + "px";
      menu.style.top = rect.bottom + 4 + "px";
    }
    function hideMenuForButton() {
      if (menu) {
        menu.remove();
        menu = null;
      }
    }
    actionBar.appendChild(btn);
    console.log(
      "[MemoryOS Extension] Added Add to Memory button to response:",
      response
    );
  });
}

// Observe for new responses
const responseObserver = new MutationObserver(() => {
  addMemoryButtonsToResponses();
});
addMemoryButtonsToResponses();
responseObserver.observe(document.body, { childList: true, subtree: true });
