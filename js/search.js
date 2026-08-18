// ===========================================================================
// Property search — every filter builds a parameterized SQL query
// ===========================================================================
(function () {
  const grid = document.getElementById("prop-grid");
  if (!grid) return;

  const els = {
    city: document.getElementById("f-city"),
    owner: document.getElementById("f-owner"),
    type: document.getElementById("f-type"),
    status: document.getElementById("f-status"),
    beds: document.getElementById("f-beds"),
    rent: document.getElementById("f-rent"),
    date: document.getElementById("f-date"),
    note: document.getElementById("result-note"),
    sql: document.getElementById("sql-display"),
  };

  function fillSelect(el, rows, valKey, labelKey) {
    rows.forEach((r) => {
      const o = document.createElement("option");
      o.value = r[valKey];
      o.textContent = r[labelKey];
      el.appendChild(o);
    });
  }

  function buildQuery() {
    let sql = `SELECT p.property_id, p.address, p.city, p.state, p.type,
       p.bedrooms, p.bathrooms, p.rent, p.status, p.listed_date,
       o.name AS owner_name
FROM properties p
JOIN owners o ON o.owner_id = p.owner_id`;
    const where = [];
    const params = [];
    if (els.city.value) { where.push("p.city = ?"); params.push(els.city.value); }
    if (els.owner.value) { where.push("o.owner_id = ?"); params.push(+els.owner.value); }
    if (els.type.value) { where.push("p.type = ?"); params.push(els.type.value); }
    if (els.status.value) { where.push("p.status = ?"); params.push(els.status.value); }
    if (els.beds.value) { where.push("p.bedrooms >= ?"); params.push(+els.beds.value); }
    if (els.rent.value) { where.push("p.rent <= ?"); params.push(+els.rent.value); }
    if (els.date.value) { where.push("p.listed_date >= ?"); params.push(els.date.value); }
    if (where.length) sql += "\nWHERE " + where.join("\n  AND ");
    sql += "\nORDER BY p.listed_date DESC;";
    return { sql, params };
  }

  function render() {
    const { sql, params } = buildQuery();
    els.sql.innerHTML = highlightSQL(sql);
    const rows = DB.all(sql, params);

    els.note.textContent = `${rows.length} propert${rows.length === 1 ? "y" : "ies"} found`;
    if (!rows.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><span class="big">🔍</span>No properties match those filters. Try widening your search.</div>`;
      return;
    }
    grid.innerHTML = rows.map((r, i) => `
      <article class="prop-card" style="animation-delay:${i * 45}ms">
        <div class="prop-visual">
          ${propArt(r.type, r.property_id)}
          <span class="status-pill ${r.status.toLowerCase()}">${r.status}</span>
        </div>
        <div class="prop-body">
          <h3>${r.address}</h3>
          <p class="prop-city">${r.city}, ${r.state} &middot; ${r.type}</p>
          <div class="prop-specs">
            <span>🛏 ${r.bedrooms} bed</span>
            <span>🛁 ${r.bathrooms} bath</span>
            <span>👤 ${r.owner_name}</span>
          </div>
          <p class="prop-city">Listed ${fmtDate(r.listed_date)}</p>
          <div class="prop-foot">
            <span class="prop-rent">${fmtMoney(r.rent)}<small>/mo</small></span>
          </div>
        </div>
      </article>`).join("");
  }

  function renderStats() {
    const s = DB.all(`SELECT
        (SELECT COUNT(*) FROM properties) AS props,
        (SELECT COUNT(*) FROM properties WHERE status = 'Vacant') AS vacant,
        (SELECT COUNT(*) FROM tenants) AS tenants,
        (SELECT COUNT(DISTINCT city) FROM properties) AS cities`)[0];
    document.getElementById("stat-strip").innerHTML = `
      <div class="stat"><div class="n">${s.props}</div><div class="l">Properties</div></div>
      <div class="stat"><div class="n">${s.vacant}</div><div class="l">Available now</div></div>
      <div class="stat"><div class="n">${s.tenants}</div><div class="l">Happy tenants</div></div>
      <div class="stat"><div class="n">${s.cities}</div><div class="l">Cities</div></div>`;
  }

  DB.onReady(() => {
    fillSelect(els.city, DB.all("SELECT DISTINCT city FROM properties ORDER BY city"), "city", "city");
    fillSelect(els.owner, DB.all("SELECT owner_id, name FROM owners ORDER BY name"), "owner_id", "name");
    fillSelect(els.type, DB.all("SELECT DISTINCT type FROM properties ORDER BY type"), "type", "type");
    Object.values(els).forEach((el) => {
      if (el && el.tagName && ["SELECT", "INPUT"].includes(el.tagName)) el.addEventListener("change", render);
    });
    document.getElementById("f-clear").addEventListener("click", () => {
      ["city","owner","type","status","beds","rent","date"].forEach((k) => (els[k].value = ""));
      render();
    });
    renderStats();
    render();
  });
  DB.init();
})();
