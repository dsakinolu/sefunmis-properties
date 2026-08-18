// ===========================================================================
// Directory — five relational views, each a JOIN across tables
// ===========================================================================
(function () {
  const content = document.getElementById("dir-content");
  if (!content) return;
  const sqlEl = document.getElementById("dir-sql");

  const VIEWS = {
    tenants: {
      sql: `SELECT t.name AS tenant, t.email, t.phone,
       p.address || ', ' || p.city AS residence,
       t.move_in_date AS moved_in
FROM tenants t
JOIN properties p ON p.property_id = t.property_id
ORDER BY t.name;`,
      cols: ["Tenant", "Email", "Phone", "Residence", "Moved in"],
      cell: (r) => [r.tenant, r.email, r.phone, r.residence, fmtDate(r.moved_in)],
    },
    owners: {
      sql: `SELECT o.name AS owner, o.email, o.phone,
       COUNT(p.property_id) AS properties,
       SUM(p.rent) AS monthly_income
FROM owners o
LEFT JOIN properties p ON p.owner_id = o.owner_id
GROUP BY o.owner_id
ORDER BY properties DESC;`,
      cols: ["Owner", "Email", "Phone", "Properties", "Monthly income"],
      cell: (r) => [r.owner, r.email, r.phone, r.properties, fmtMoney(r.monthly_income || 0)],
    },
    employees: {
      sql: `SELECT e.name AS staff, e.role, e.email,
       COUNT(l.lease_id) AS leases_managed
FROM employees e
LEFT JOIN leases l ON l.employee_id = e.employee_id
GROUP BY e.employee_id
ORDER BY leases_managed DESC;`,
      cols: ["Staff member", "Role", "Email", "Leases managed"],
      cell: (r) => [r.staff, r.role, r.email, r.leases_managed],
    },
    leases: {
      sql: `SELECT l.lease_id, p.address, t.name AS tenant,
       e.name AS agent, l.start_date, l.end_date, l.monthly_rent
FROM leases l
JOIN properties p ON p.property_id = l.property_id
JOIN tenants t ON t.tenant_id = l.tenant_id
JOIN employees e ON e.employee_id = l.employee_id
ORDER BY l.start_date DESC;`,
      cols: ["Lease", "Property", "Tenant", "Agent", "Term", "Rent"],
      cell: (r) => [`#${r.lease_id}`, r.address, r.tenant, r.agent,
                    `${fmtDate(r.start_date)} – ${fmtDate(r.end_date)}`, fmtMoney(r.monthly_rent)],
    },
    payments: {
      sql: `SELECT pay.payment_date, t.name AS tenant, p.address,
       pay.amount, pay.method, pay.status
FROM payments pay
JOIN tenants t ON t.tenant_id = pay.tenant_id
JOIN leases l ON l.lease_id = pay.lease_id
JOIN properties p ON p.property_id = l.property_id
ORDER BY pay.payment_date DESC
LIMIT 40;`,
      cols: ["Date", "Tenant", "Property", "Amount", "Method", "Status"],
      cell: (r) => [fmtDate(r.payment_date), r.tenant, r.address, fmtMoney(r.amount), r.method,
        `<span class="badge ${r.status === "Late" ? "late" : "on"}">${r.status}</span>`],
    },
  };

  function show(key) {
    const v = VIEWS[key];
    sqlEl.innerHTML = highlightSQL(v.sql);
    const rows = DB.all(v.sql);
    content.innerHTML = `
      <div class="panel"><div class="table-wrap">
        <table>
          <thead><tr>${v.cols.map((c) => `<th>${c}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${v.cell(r).map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div></div>`;
    document.querySelectorAll("[data-tab]").forEach((b) =>
      b.className = "btn " + (b.dataset.tab === key ? "btn-primary" : "btn-quiet"));
  }

  DB.onReady(() => {
    document.querySelectorAll("[data-tab]").forEach((b) =>
      b.addEventListener("click", () => show(b.dataset.tab)));
    show("tenants");
  });
  DB.init();
})();
