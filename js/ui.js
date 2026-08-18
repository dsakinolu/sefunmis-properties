// ===========================================================================
// Shared UI: nav, toast, SQL highlighting, property illustrations
// ===========================================================================
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

const KEYWORDS = /\b(SELECT|FROM|WHERE|JOIN|LEFT|INNER|ON|AND|OR|ORDER BY|GROUP BY|INSERT INTO|VALUES|UPDATE|SET|DELETE|LIMIT|AS|COUNT|SUM|AVG|LIKE|DESC|ASC|CREATE TABLE|NOT NULL|PRIMARY KEY|REFERENCES)\b/g;
function highlightSQL(sql) {
  return sql.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))
            .replace(KEYWORDS, '<span class="kw">$1</span>');
}

// Flat SVG house illustrations, varied by property type
function propArt(type, seedNum) {
  const palettes = [
    ["#a8c8dd", "#3f7fa6", "#0e3d47"],
    ["#e8c67c", "#c69433", "#0e3d47"],
    ["#b7d6c4", "#4d9478", "#0e3d47"],
    ["#c9c3dd", "#6f63a6", "#0e3d47"],
  ];
  const [sky, mid, dark] = palettes[seedNum % palettes.length];
  const roof = `<path d="M20 92 L110 34 L200 92 Z" fill="${dark}"/>`;
  const windows = (n) => Array.from({ length: n }, (_, i) =>
    `<rect x="${62 + i * 34}" y="104" width="22" height="22" rx="3" fill="${sky}"/>`).join("");

  if (type === "Apartment" || type === "Loft") {
    return `<svg viewBox="0 0 220 140" role="img" aria-label="${type} illustration">
      <rect width="220" height="140" fill="${sky}"/>
      <rect x="46" y="26" width="128" height="114" fill="${mid}"/>
      <rect x="46" y="26" width="128" height="12" fill="${dark}"/>
      ${[0,1,2].map(r=>[0,1,2,3].map(c=>`<rect x="${58+c*28}" y="${50+r*28}" width="18" height="18" rx="2" fill="#f7f4ec" opacity="0.85"/>`).join("")).join("")}
      <rect x="98" y="118" width="24" height="22" fill="${dark}"/>
    </svg>`;
  }
  if (type === "Condo" || type === "Townhouse") {
    return `<svg viewBox="0 0 220 140" role="img" aria-label="${type} illustration">
      <rect width="220" height="140" fill="${sky}"/>
      ${[0,1,2].map(i=>`<g transform="translate(${i*62},0)">
        <path d="M12 62 L44 34 L76 62 Z" fill="${dark}"/>
        <rect x="18" y="62" width="52" height="78" fill="${mid}"/>
        <rect x="28" y="76" width="14" height="14" rx="2" fill="#f7f4ec" opacity="0.9"/>
        <rect x="48" y="76" width="14" height="14" rx="2" fill="#f7f4ec" opacity="0.9"/>
        <rect x="36" y="110" width="18" height="30" fill="${dark}"/>
      </g>`).join("")}
    </svg>`;
  }
  return `<svg viewBox="0 0 220 140" role="img" aria-label="${type} illustration">
    <rect width="220" height="140" fill="${sky}"/>
    <circle cx="182" cy="34" r="18" fill="${mid}" opacity="0.5"/>
    ${roof}
    <rect x="40" y="92" width="140" height="48" fill="${mid}"/>
    ${windows(2)}
    <rect x="140" y="104" width="24" height="36" fill="${dark}"/>
    <rect x="60" y="46" width="14" height="26" fill="${dark}"/>
  </svg>`;
}
