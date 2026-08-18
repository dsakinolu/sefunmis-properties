// ===========================================================================
// Admin — demo login, INSERT forms, and a live SQL console
// ===========================================================================
(function () {
  const loginView = document.getElementById("login-view");
  if (!loginView) return;
  const adminView = document.getElementById("admin-view");

  // --- demo auth (client-side only; documented as such) --------------------
  const DEMO_USER = "admin";
  const DEMO_PASS = "sefunmi2026";

  function signIn() {
    loginView.hidden = true;
    adminView.hidden = false;
    sessionStorage.setItem("sp_admin", "1");
    DB.onReady(boot);
    DB.init();
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const u = document.getElementById("lg-user").value.trim();
    const p = document.getElementById("lg-pass").value;
    const err = document.getElementById("lg-error");
    if (u === DEMO_USER && p === DEMO_PASS) { err.hidden = true; signIn(); }
    else { err.hidden = false; }
  });

  document.getElementById("logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem("sp_admin");
    location.reload();
  });

  if (sessionStorage.getItem("sp_admin")) signIn();

  // --- dashboard ------------------------------------------------------------
  function boot() {
    document.querySelectorAll("[data-az]").forEach((b) =>
      b.addEventListener("click", () => {
        document.querySelectorAll(".admin-zone").forEach((z) => z.classList.remove("active"));
        document.getElementById("az-" + b.dataset.az).classList.add("active");
        document.querySelectorAll("[data-az]").forEach((x) =>
          x.className = "btn " + (x === b ? "btn-primary" : "btn-quiet"));
      }));

    function refreshSelects() {
      const owners = DB.all("SELECT owner_id, name FROM owners ORDER BY name");
      document.getElementById("p-owner").innerHTML =
        owners.map((o) => `<option value="${o.owner_id}">${o.name}</option>`).join("");
      const props = DB.all("SELECT property_id, address, city FROM properties ORDER BY address");
      document.getElementById("t-property").innerHTML =
        props.map((p) => `<option value="${p.property_id}">${p.address} (${p.city})</option>`).join("");
    }

    function refreshTables() {
      const props = DB.all("SELECT p.property_id, p.address, p.city, p.type, p.rent, p.status, o.name AS owner FROM properties p JOIN owners o ON o.owner_id=p.owner_id ORDER BY p.property_id DESC");
      document.getElementById("admin-props").innerHTML = `<table>
        <thead><tr><th>ID</th><th>Address</th><th>City</th><th>Type</th><th>Rent</th><th>Owner</th><th>Status</th></tr></thead>
        <tbody>${props.map((p) => `<tr><td class="mono">${p.property_id}</td><td>${p.address}</td><td>${p.city}</td><td>${p.type}</td><td>${fmtMoney(p.rent)}</td><td>${p.owner}</td><td><span class="badge ${p.status === "Vacant" ? "late" : "on"}">${p.status}</span></td></tr>`).join("")}</tbody></table>`;

      const tenants = DB.all("SELECT t.tenant_id, t.name, t.email, t.phone, p.address FROM tenants t LEFT JOIN properties p ON p.property_id=t.property_id ORDER BY t.tenant_id DESC");
      document.getElementById("admin-tenants").innerHTML = `<table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Property</th></tr></thead>
        <tbody>${tenants.map((t) => `<tr><td class="mono">${t.tenant_id}</td><td>${t.name}</td><td>${t.email || "—"}</td><td>${t.phone || "—"}</td><td>${t.address || "—"}</td></tr>`).join("")}</tbody></table>`;

      const owners = DB.all("SELECT owner_id, name, email, phone FROM owners ORDER BY owner_id DESC");
      document.getElementById("admin-owners").innerHTML = `<table>
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
        <tbody>${owners.map((o) => `<tr><td class="mono">${o.owner_id}</td><td>${o.name}</td><td>${o.email || "—"}</td><td>${o.phone || "—"}</td></tr>`).join("")}</tbody></table>`;
    }

    const val = (id) => document.getElementById(id).value.trim();

    document.getElementById("p-save").addEventListener("click", () => {
      if (!val("p-address") || !val("p-city")) { toast("Address and city are required"); return; }
      DB.run(`INSERT INTO properties (address, city, state, zip, type, bedrooms, bathrooms, rent, owner_id, listed_date, status)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [val("p-address"), val("p-city"), val("p-state").toUpperCase(), val("p-zip"), val("p-type"),
         +val("p-beds") || 0, +val("p-baths") || 0, +val("p-rent") || 0, +val("p-owner"),
         val("p-listed") || new Date().toISOString().slice(0, 10), val("p-status")]);
      ["p-address","p-city","p-state","p-zip","p-rent","p-listed"].forEach((id) => (document.getElementById(id).value = ""));
      refreshTables(); refreshSelects();
      toast("✓ Property added to the database");
    });

    document.getElementById("t-save").addEventListener("click", () => {
      if (!val("t-name")) { toast("Tenant name is required"); return; }
      DB.run(`INSERT INTO tenants (name, email, phone, property_id, move_in_date) VALUES (?, ?, ?, ?, ?)`,
        [val("t-name"), val("t-email"), val("t-phone"), +val("t-property"),
         val("t-movein") || new Date().toISOString().slice(0, 10)]);
      ["t-name","t-email","t-phone","t-movein"].forEach((id) => (document.getElementById(id).value = ""));
      refreshTables();
      toast("✓ Tenant added");
    });

    document.getElementById("o-save").addEventListener("click", () => {
      if (!val("o-name")) { toast("Owner name is required"); return; }
      DB.run(`INSERT INTO owners (name, email, phone) VALUES (?, ?, ?)`,
        [val("o-name"), val("o-email"), val("o-phone")]);
      ["o-name","o-email","o-phone"].forEach((id) => (document.getElementById(id).value = ""));
      refreshTables(); refreshSelects();
      toast("✓ Owner added");
    });

    // --- SQL console --------------------------------------------------------
    const SAMPLES = [
      { label: "All vacant units", q: "SELECT address, city, rent\nFROM properties\nWHERE status = 'Vacant'\nORDER BY rent;" },
      { label: "Income by owner", q: "SELECT o.name, COUNT(p.property_id) AS units, SUM(p.rent) AS monthly\nFROM owners o\nJOIN properties p ON p.owner_id = o.owner_id\nGROUP BY o.owner_id\nORDER BY monthly DESC;" },
      { label: "Late payments", q: "SELECT t.name, pay.payment_date, pay.amount\nFROM payments pay\nJOIN tenants t ON t.tenant_id = pay.tenant_id\nWHERE pay.status = 'Late'\nORDER BY pay.payment_date DESC;" },
      { label: "Listed in 2026", q: "SELECT address, city, listed_date, rent\nFROM properties\nWHERE listed_date >= '2026-01-01'\nORDER BY listed_date;" },
      { label: "Leases ending soon", q: "SELECT p.address, t.name AS tenant, l.end_date\nFROM leases l\nJOIN properties p ON p.property_id = l.property_id\nJOIN tenants t ON t.tenant_id = l.tenant_id\nWHERE l.end_date <= '2026-12-31'\nORDER BY l.end_date;" },
    ];
    const samplesEl = document.getElementById("samples");
    const input = document.getElementById("sql-input");
    SAMPLES.forEach((s) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = s.label;
      b.addEventListener("click", () => { input.value = s.q; runQuery(); });
      samplesEl.appendChild(b);
    });
    input.value = SAMPLES[1].q;

    function runQuery() {
      const err = document.getElementById("sql-error");
      const out = document.getElementById("sql-results");
      err.hidden = true;
      try {
        const sql = input.value.trim();
        if (/^\s*(insert|update|delete|drop|create|alter)/i.test(sql)) {
          DB.run(sql);
          refreshTables(); refreshSelects();
          out.innerHTML = `<p class="empty"><span class="big">✓</span>Statement executed. The tables above are updated.</p>`;
          return;
        }
        const { columns, rows } = DB.query(sql);
        if (!rows.length) { out.innerHTML = `<p class="empty"><span class="big">∅</span>Query ran fine — no rows returned.</p>`; return; }
        out.innerHTML = `<table>
          <thead><tr>${columns.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c === null ? "—" : c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table><p class="result-note">${rows.length} row${rows.length === 1 ? "" : "s"}</p>`;
      } catch (e) {
        err.hidden = false;
        err.textContent = "SQL error: " + e.message;
      }
    }
    document.getElementById("sql-run").addEventListener("click", runQuery);
    document.getElementById("db-reset").addEventListener("click", () => {
      if (confirm("Reset the database to the original CSV data? Any records you added will be lost.")) DB.reset();
    });

    refreshSelects();
    refreshTables();
    runQuery();
  }
})();
