# 🏡 Sefunmi's Properties

**Live site:** https://dsakinolu.github.io/sefunmis-properties/
📲 Installable on your phone — open the site and choose "Add to Home Screen."

A property management system: search rentals by city, owner, type, size,
availability and listing date; browse tenants, staff, leases and payment
history; and sign in as staff to add records or run your own SQL.

Originally built as a **PHP + MySQL** database project at Indiana University
(then called "Polly's & Peter's Properties"), rebuilt as an installable web
app with a **real SQL database that runs in the browser**.

---

## 🗄️ The database question

The original needed a server for PHP and MySQL. GitHub Pages serves static
files only — so instead of faking the data with JavaScript arrays, this
version runs **SQLite compiled to WebAssembly** ([sql.js](https://sql.js.org)).

That means the SQL is real:

- Six tables created with `CREATE TABLE`, with foreign keys:
  `owners · properties · tenants · employees · leases · payments`
- Seeded at load time from CSV text embedded in `js/seed.js` (the same
  content as the files in `/data`, inlined so there are zero network requests
  and the app also works when opened as local files)
- Every filter on the site builds a **parameterized `SELECT`** with `JOIN`s —
  open "See the SQL running this search" under the filters to watch it change
- Admin forms run real `INSERT` statements
- The **SQL console** lets you run any query against the live database
- The database is saved to `localStorage`, so records you add survive a refresh
  (with a "reset to CSV seed" button to start over)

**Why this matters:** the schema, the joins, and the queries are the same ones
a PHP/MySQL version would use — only the engine and transport changed.

### Load time

The SQLite engine is a ~1.2 MB WebAssembly file, so the very first visit takes
a moment. After that the service worker caches it and the database opens
instantly — including offline. The page shows a clear loading state, and a
readable error with a Reload button if the engine can't be fetched.

## ✨ Features

- **Property search** — city, owner, type, status, minimum bedrooms, maximum
  rent, and *listed on or after* a date; results as animated floating cards
  with generated illustrations per property type
- **Live stats** — property count, availability, tenants, cities, all from
  a single aggregate query
- **Directory** — five relational views (tenants, owners with income totals,
  staff with leases managed, leases, payments) each showing its SQL
- **Admin area** — sign-in, then add properties/tenants/owners through forms,
  or use the SQL console with one-click sample queries
- **Installable PWA** — home screen icon from the Sefunmi's Properties logo,
  fullscreen launch, and full offline support via a service worker
- Accessible: skip link, keyboard-operable, visible focus, labeled fields,
  44px+ touch targets, `prefers-reduced-motion` respected

## 🔐 Demo credentials

Username `admin` · password `sefunmi2026`

This is a **portfolio demo**: the check runs in the browser and protects
nothing real. A production version would authenticate server-side with hashed
passwords and session tokens — the login here exists to demonstrate the
admin flow.

## 🛠️ Stack

HTML · CSS · Vanilla JavaScript · SQLite via sql.js (WebAssembly) · CSV seed
data · Service worker + Web App Manifest. No build step; deploys as static files.

```
index.html      Property search
directory.html  Relational views (tenants, owners, staff, leases, payments)
admin.html      Login, insert forms, SQL console
js/db.js        Schema, CSV seeding, query API
data/*.csv      Seed data — edit here to change the starting database
```

## Adding your own data

Edit the CSV files in `/data` (they match the table columns exactly), then use
the admin panel's **Reset database to CSV seed** button to reload.

Built by **Sefunmi Akin-Olukunle** · [Portfolio](https://dsakinolu.github.io/portfolio/)
