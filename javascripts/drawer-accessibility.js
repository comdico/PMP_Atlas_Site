/* Accessibility completion for Material's native checkbox-driven drawer. */
(() => {
  const drawer = document.querySelector("#__drawer");
  const trigger = document.querySelector(
    '.md-header__button[for="__drawer"]'
  );
  const sidebar = document.querySelector(".md-sidebar--primary");

  if (!drawer || !trigger || !sidebar) return;

  sidebar.id = sidebar.id || "atlas-primary-navigation";
  trigger.setAttribute("role", "button");
  trigger.setAttribute("tabindex", "0");
  trigger.setAttribute("aria-label", "Open navigation menu");
  trigger.setAttribute("aria-controls", sidebar.id);

  const isDrawerViewport = () =>
    window.matchMedia("(max-width: 76.234375em)").matches;

  const focusableItems = () =>
    Array.from(
      sidebar.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((item) => !item.hidden && item.getClientRects().length);

  const synchronizeState = () => {
    const expanded = isDrawerViewport() && drawer.checked;
    trigger.setAttribute("aria-expanded", String(expanded));
    trigger.setAttribute(
      "aria-label",
      expanded ? "Close navigation menu" : "Open navigation menu"
    );
    if (expanded) {
      window.setTimeout(() => {
        const current = sidebar.querySelector('[aria-current="page"]');
        const items = focusableItems();
        (items.includes(current) ? current : items[0])?.focus();
      }, 50);
    }
  };

  const closeDrawer = () => {
    if (!drawer.checked) return;
    drawer.checked = false;
    drawer.dispatchEvent(new Event("change", { bubbles: true }));
    synchronizeState();
    trigger.focus();
  };

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    drawer.checked = !drawer.checked;
    drawer.dispatchEvent(new Event("change", { bubbles: true }));
    synchronizeState();
  });

  drawer.addEventListener("change", synchronizeState);
  window.addEventListener("resize", synchronizeState);

  document.addEventListener("keydown", (event) => {
    if (!isDrawerViewport() || !drawer.checked) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeDrawer();
      return;
    }
    if (event.key !== "Tab") return;

    const items = focusableItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!sidebar.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  });

  document
    .querySelectorAll(".md-nav__link--active[href]")
    .forEach((link) => link.setAttribute("aria-current", "page"));

  synchronizeState();
})();
