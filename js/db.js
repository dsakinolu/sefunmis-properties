// ===========================================================================
// Sefunmi's Properties — database layer
//
// This is a REAL SQL database: SQLite compiled to WebAssembly (sql.js).
// Schema is created with CREATE TABLE, seeded from the CSV files in /data,
// and every lookup on the site runs an actual SELECT with JOINs.
//
// Why: the original was PHP + MySQL, which needs a server. SQLite-in-the-
// browser keeps the SQL honest while deploying anywhere as static files.
// Admin inserts are persisted to localStorage so they survive a refresh.
// ===========================================================================

const DB = (() => {
  let db = null;
  const listeners = [];

  const SCHEMA = `
    CREATE TABLE owners (
      owner_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT
    );
    CREATE TABLE properties (
      property_id INTEGER PRIMARY KEY,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT,
      zip TEXT,
      type TEXT,
      bedrooms INTEGER,
      bathrooms REAL,
      rent REAL,
      owner_id INTEGER REFERENCES owners(owner_id),
      listed_date TEXT,
      status TEXT
    );
    CREATE TABLE tenants (
      tenant_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      property_id INTEGER REFERENCES properties(property_id),
      move_in_date TEXT
    );
    CREATE TABLE employees (
      employee_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      email TEXT,
      phone TEXT
    );
    CREATE TABLE leases (
      lease_id INTEGER PRIMARY KEY,
      property_id INTEGER REFERENCES properties(property_id),
      tenant_id INTEGER REFERENCES tenants(tenant_id),
      employee_id INTEGER REFERENCES employees(employee_id),
      start_date TEXT,
      end_date TEXT,
      monthly_rent REAL,
      deposit REAL
    );
    CREATE TABLE payments (
      payment_id INTEGER PRIMARY KEY,
      lease_id INTEGER REFERENCES leases(lease_id),
      tenant_id INTEGER REFERENCES tenants(tenant_id),
      payment_date TEXT,
      amount REAL,
      method TEXT,
      status TEXT
    );
  `;

  const TABLES = ["owners", "properties", "tenants", "employees", "leases", "payments"];

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    const heads = lines[0].split(",");
    return lines.slice(1).map((line) => {
      // simple split is safe here — our CSVs contain no quoted commas
      const cells = line.split(",");
      const o = {};
      heads.forEach((h, i) => (o[h] = cells[i] ?? ""));
      return o;
    });
  }

  function seedFromCSV() {
    for (const t of TABLES) {
      const rows = parseCSV(SEED_CSV[t] || "");
      if (!rows.length) continue;
      const cols = Object.keys(rows[0]);
      const stmt = db.prepare(
        `INSERT INTO ${t} (${cols.join(",")}) VALUES (${cols.map(() => "?").join(",")})`
      );
      db.run("BEGIN TRANSACTION");
      rows.forEach((r) => stmt.run(cols.map((c) => (r[c] === "" ? null : r[c]))));
      db.run("COMMIT");
      stmt.free();
    }
  }

  // ---- public API ---------------------------------------------------------
  return {
    async init() {
      if (db) { listeners.forEach((f) => f()); return; }   // already loaded
      const t0 = performance.now();
      try {
        const SQL = await initSqlJs({
          locateFile: (f) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${f}`,
        });

        const saved = localStorage.getItem("sp_db");
        if (saved) {
          try {
            db = new SQL.Database(Uint8Array.from(atob(saved), (c) => c.charCodeAt(0)));
          } catch (e) {
            db = null;
          }
        }
        if (!db) {
          db = new SQL.Database();
          db.run(SCHEMA);
          seedFromCSV();
          this.persist();
        }
        this.loadMs = Math.round(performance.now() - t0);
        listeners.forEach((f) => f());
      } catch (err) {
        console.error("Database failed to load:", err);
        document.querySelectorAll(".loading").forEach((el) => {
          el.innerHTML = `<p style="max-width:46ch;margin:0 auto">
            <strong>The database engine couldn't load.</strong><br>
            This usually means the SQLite file (about 1.2&nbsp;MB) was blocked
            or the connection dropped. Reloading the page normally fixes it.</p>
            <button class="btn btn-primary" style="margin-top:1rem" onclick="location.reload()">Reload</button>`;
        });
      }
    },

    /** Run a SELECT; returns { columns, rows } */
    query(sql, params = []) {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const rows = [];
      let columns = [];
      while (stmt.step()) {
        columns = stmt.getColumnNames();
        rows.push(stmt.get());
      }
      stmt.free();
      return { columns, rows };
    },

    /** Run a SELECT; returns array of objects */
    all(sql, params = []) {
      const { columns, rows } = this.query(sql, params);
      return rows.map((r) => Object.fromEntries(columns.map((c, i) => [c, r[i]])));
    },

    /** Run INSERT/UPDATE/DELETE */
    run(sql, params = []) {
      db.run(sql, params);
      this.persist();
    },

    persist() {
      try {
        const bytes = db.export();
        let bin = "";
        bytes.forEach((b) => (bin += String.fromCharCode(b)));
        localStorage.setItem("sp_db", btoa(bin));
      } catch (e) { /* storage full or unavailable — session-only is fine */ }
    },

    reset() {
      localStorage.removeItem("sp_db");
      location.reload();
    },

    onReady(fn) { listeners.push(fn); },
  };
})();

const fmtMoney = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtDate = (s) => {
  if (!s) return "—";
  const d = new Date(s + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
