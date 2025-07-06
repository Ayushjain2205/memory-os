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

  // Loader SVG generator
  function getLoaderSVG(color) {
    return `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="4" opacity="0.2"/><circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-dasharray="80" stroke-dashoffset="60"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="1s" repeatCount="indefinite"/></circle></svg>`;
  }

  // Dropdown menu in document.body
  let menu = null;
  let menuHovered = false;
  let btnHovered = false;
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
    // Position below the button
    const rect = btn.getBoundingClientRect();
    menu.style.left = rect.left + "px";
    menu.style.top = rect.bottom + 4 + "px";
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
