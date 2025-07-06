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
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    bg: "#e8f0fe",
    color: "#2563eb",
  },
  {
    name: "Work",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase-icon lucide-briefcase"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    bg: "#e6faea",
    color: "#22c55e",
  },
  {
    name: "Health",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    bg: "#fdeaea",
    color: "#ef4444",
  },
  {
    name: "Travel",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane-icon lucide-plane"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
    bg: "#f3e8ff",
    color: "#a78bfa",
  },
];

// Add the second dropdown options for response memory
const memoryTypes = [
  {
    name: "Goal",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain-icon lucide-brain"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>`,
    color: "#22C55E",
    bg: "#E6FAEA",
  },
  {
    name: "Preference",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`,
    color: "#A78BFA",
    bg: "#F3E8FF",
  },
  {
    name: "Fact",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb-icon lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
    color: "#2563EB",
    bg: "#E8F0FE",
  },
  {
    name: "Note",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    color: "#71717A",
    bg: "#F4F4F5",
  },
  {
    name: "Document",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-icon lucide-book"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
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
                const responseText =
                  response.innerText || response.textContent || "";
                const title = responseText
                  .split(/[.!?\n]/)[0]
                  .split(" ")
                  .slice(0, 8)
                  .join(" ");
                const content = responseText;
                const tags = [type.name.toLowerCase(), mode.name.toLowerCase()];
                const date = new Date().toISOString().slice(0, 10);
                const memory = {
                  title,
                  content,
                  tags,
                  type: type.name,
                  mode: mode.name,
                  date,
                };
                chrome.storage.local.get(["memories"], (result) => {
                  const memories = result.memories || [];
                  memories.unshift(memory);
                  chrome.storage.local.set({ memories });
                });
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
