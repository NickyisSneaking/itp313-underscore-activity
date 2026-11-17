// Small, dependency-free behaviours for the Bank Account Manager UI.
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // ── Mobile menu ─────────────────────────────────────────────
  const sidebar = $("#sidebar");
  const backdrop = $("[data-menu-backdrop]");
  const toggle = $("[data-menu-toggle]");
  const setMenu = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle("-translate-x-full", !open);
    backdrop?.classList.toggle("hidden", !open);
    toggle?.setAttribute("aria-expanded", String(open));
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  backdrop?.addEventListener("click", () => setMenu(false));
  $("[data-menu-close]")?.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // ── Dialogs (native <dialog>) ───────────────────────────────
  const openDialog = (id) => {
    const d = document.getElementById(id);
    if (d && typeof d.showModal === "function") {
      d.showModal();
      const first = $("input:not([type=hidden]), select, textarea", d);
      first?.focus();
    }
  };

  document.addEventListener("click", (e) => {
    const t = e.target;

    const opener = t.closest("[data-open-dialog]");
    if (opener) return openDialog(opener.dataset.openDialog);

    if (t.closest("[data-close-dialog]")) return t.closest("dialog")?.close();
    if (t instanceof HTMLDialogElement) return t.close(); // click on the dim backdrop

    const edit = t.closest("[data-edit-account]");
    if (edit) {
      const form = $("[data-edit-form]");
      form.action = `/accounts/${edit.dataset.id}/update`;
      $("[data-edit-number]", form).textContent = edit.dataset.number;
      form.elements.balance.value = edit.dataset.balance;
      form.elements.status.value = edit.dataset.status;
      return openDialog("editDialog");
    }

    const del = t.closest("[data-delete-account]");
    if (del) {
      const form = $("[data-delete-form]");
      form.action = `/accounts/${del.dataset.id}/delete`;
      $("[data-delete-number]", form).textContent = del.dataset.number;
      return openDialog("deleteDialog");
    }

    const dismiss = t.closest("[data-dismiss]");
    if (dismiss) return dismiss.closest("[data-flash]")?.remove();

    const pw = t.closest("[data-toggle-password]");
    if (pw) {
      const input = document.getElementById(pw.dataset.togglePassword);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      pw.textContent = show ? "Hide" : "Show";
    }
  });

  // ── Filters that apply as soon as you change them ───────────
  $$("[data-autosubmit]").forEach((el) => el.addEventListener("change", () => el.form.requestSubmit()));

  // ── Stop accidental double-submits (e.g. recording a deposit twice) ──
  document.addEventListener("submit", (e) => {
    const form = e.target;
    if (!form.matches("[data-once]")) return;
    if (form.dataset.busy) return e.preventDefault();
    form.dataset.busy = "1";
    $$('button[type="submit"]', form).forEach((b) => {
      b.dataset.label = b.textContent;
      b.disabled = true;
      b.textContent = "Please wait…";
    });
  });
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    $$("form[data-busy]").forEach((f) => {
      delete f.dataset.busy;
      $$('button[type="submit"]', f).forEach((b) => { b.disabled = false; b.textContent = b.dataset.label || b.textContent; });
    });
  });

  // ── "?new=1" opens the New Account form (used by the Overview shortcut) ──
  if (new URLSearchParams(location.search).get("new") === "1") openDialog("createDialog");
})();
