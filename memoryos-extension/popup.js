const typeIcons = {
  Goal: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18V5"/><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77"/><path d="M18 18a4 4 0 0 0 2-7.464"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path d="M6 18a4 4 0 0 1-2-7.464"/><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77"/></svg>',
    bg: "#E6FAEA",
  },
  Preference: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>',
    bg: "#F3E8FF",
  },
  Fact: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
    bg: "#E8F0FE",
  },
  Note: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    bg: "#F4F4F5",
  },
  Document: {
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>',
    bg: "#E8F0FE",
  },
};
const tagColors = {
  goal: "#22C55E",
  preference: "#A78BFA",
  fact: "#2563EB",
  note: "#71717A",
  document: "#2563EB",
  high: "#F87171",
  medium: "#FACC15",
  low: "#60A5FA",
  books: "#6B7280",
  "self-improvement": "#6B7280",
  communication: "#6B7280",
  style: "#6B7280",
  fitness: "#6B7280",
  schedule: "#6B7280",
};

function renderMemoryCollapsed(memory, idx) {
  const iconObj = typeIcons[memory.type] || { svg: "", bg: "#eee" };
  return `
    <div class="memoryos-memory-card memoryos-collapsed" data-idx="${idx}">
      <div class="memoryos-memory-header">
        <span class="memoryos-memory-icon" style="background:${
          iconObj.bg
        }"><span class="memoryos-memory-icon-inner">${iconObj.svg}</span></span>
        <span class="memoryos-memory-title">${memory.title || ""}</span>
        <button class="memoryos-delete-btn" title="Delete" data-idx="${idx}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
      </div>
    </div>
  `;
}

function renderMemoryExpanded(memory, idx) {
  const iconObj = typeIcons[memory.type] || { svg: "", bg: "#eee" };
  const tagBadges = (memory.tags || [])
    .map(
      (tag) =>
        `<span class="memoryos-tag" style="background:${
          tagColors[tag] || "#E5E7EB"
        };color:${
          ["goal", "preference", "fact", "note", "document"].includes(tag)
            ? "#fff"
            : "#222"
        }">${tag}</span>`
    )
    .join(" ");
  const date = memory.date
    ? `<span class="memoryos-date"><svg width="16" height="16" fill="none" stroke="#888" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 9h18"/></svg> ${
        memory.date.split("T")[0]
      }</span>`
    : "";
  return `
    <div class="memoryos-memory-card memoryos-expanded" data-idx="${idx}">
      <div class="memoryos-memory-header">
        <span class="memoryos-memory-icon" style="background:${
          iconObj.bg
        }"><span class="memoryos-memory-icon-inner">${iconObj.svg}</span></span>
        <span class="memoryos-memory-title">${memory.title || ""}</span>
        <button class="memoryos-delete-btn" title="Delete" data-idx="${idx}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
      </div>
      <div class="memoryos-memory-content">${memory.content || ""}</div>
      <div class="memoryos-memory-tags">${tagBadges}</div>
      <div class="memoryos-memory-footer">${date}</div>
    </div>
  `;
}

function loadMemories() {
  chrome.storage.local.get(["memories"], (result) => {
    const memories = result.memories || [];
    const container = document.getElementById("memoryos-memories");
    container.innerHTML = "";
    if (memories.length === 0) {
      container.innerHTML =
        '<div style="color:#888;">No memories saved yet.</div>';
      return;
    }
    memories.forEach((memory, idx) => {
      const div = document.createElement("div");
      div.innerHTML = renderMemoryCollapsed(memory, idx);
      container.appendChild(div.firstElementChild);
    });
    // Add click handlers for expand/collapse and delete
    Array.from(container.querySelectorAll(".memoryos-memory-card")).forEach(
      (card) => {
        card.addEventListener("click", function (e) {
          if (e.target.closest(".memoryos-delete-btn")) return; // Don't toggle if delete clicked
          const idx = this.getAttribute("data-idx");
          if (this.classList.contains("memoryos-collapsed")) {
            this.outerHTML = renderMemoryExpanded(memories[idx], idx);
          } else {
            this.outerHTML = renderMemoryCollapsed(memories[idx], idx);
          }
        });
      }
    );
    Array.from(container.querySelectorAll(".memoryos-delete-btn")).forEach(
      (btn) => {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          const idx = parseInt(this.getAttribute("data-idx"));
          memories.splice(idx, 1);
          chrome.storage.local.set({ memories }, loadMemories);
        });
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", loadMemories);
