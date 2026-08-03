(() => {
  function labelFor(table, index) {
    const caption = table.querySelector("caption")?.textContent?.trim();
    if (caption) return `Scrollable table: ${caption}`;
    let node = table.previousElementSibling;
    while (node && !/^H[2-6]$/.test(node.tagName)) node = node.previousElementSibling;
    return `Scrollable table: ${node?.textContent?.trim() || `data table ${index + 1}`}`;
  }

  function enhanceTables(root = document) {
    [...root.querySelectorAll(".md-content table")].forEach((table, index) => {
      if (table.closest(".atlas-table-region")) return;
      const region = document.createElement("div");
      region.className = "atlas-table-region";
      region.setAttribute("role", "region");
      region.setAttribute("aria-label", labelFor(table, index));
      region.tabIndex = 0;
      table.parentNode.insertBefore(region, table);
      region.appendChild(table);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => enhanceTables(), {once: true});
  } else {
    enhanceTables();
  }
  if (typeof document$ !== "undefined") document$.subscribe(() => enhanceTables());
})();
