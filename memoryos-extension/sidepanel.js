// Utility to render a memory
function renderMemory(memory) {
  const div = document.createElement("div");
  div.className = "memoryos-memory";
  div.innerHTML = `
    <div class="memory-type">${memory.mode} &mdash; ${memory.type}</div>
    <div class="memory-content">${memory.content}</div>
  `;
  return div;
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
    memories.forEach((memory) => {
      container.appendChild(renderMemory(memory));
    });
  });
}

document.addEventListener("DOMContentLoaded", loadMemories);
