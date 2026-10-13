/* ===== EDIT ME: projects ===== */
// Placeholders only. Add "image" (e.g. "assets/images/p1.png") to show a real preview.
const PROJECTS = [];


/* ===== EDIT ME: security topics ===== */
const TOPICS = [
  ["Web Security", "Understanding how web apps fail: input validation, authentication, sessions, and common vulnerability classes such as those in the OWASP Top 10."],
  ["OSINT", "Collecting and analysing publicly available information responsibly, with attention to privacy and verification of sources."],
  ["Networking", "How data moves: TCP/IP, DNS, HTTP and TLS, and how to read traffic to understand what a system is really doing."],
  ["Linux", "Working comfortably in the shell: permissions, processes, services, and the tooling that security work depends on."],
  ["Security Research", "Reading advisories and papers, reproducing findings in safe lab environments, and documenting what was learned."],
  ["Ethical Hacking", "Testing systems only with permission, in labs or authorised scopes, with the goal of finding weaknesses so they can be fixed."]
];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* Projects */
const projectsGrid = $("#projects-grid");
if (projectsGrid) {
  projectsGrid.innerHTML = PROJECTS.map(p => `
    <article class="pcard reveal">
      <div class="pcard__img">${p.image ? `<img src="${esc(p.image)}" alt="Preview of ${esc(p.name)}" loading="lazy">` : ""}<span>preview</span></div>
      <div class="pcard__body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.desc)}</p>
        <p class="tech">${esc(p.tech)}</p>
        <div class="pcard__links">
          <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub <span class="arr" aria-hidden="true">→</span></a>
          <a href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">Live Demo <span class="arr" aria-hidden="true">→</span></a>
        </div>
      </div>
    </article>`).join("");
}

/* Security topics (hover, focus, or click) */
const panel = $("#topic-panel");
const list = $("#topics");
list.innerHTML = TOPICS.map((t, i) =>
  `<li role="presentation"><button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}"><small>0${i + 1}</small>${esc(t[0])}</button></li>`).join("");
function showTopic(i) {
  $$("button", list).forEach((b, k) => b.setAttribute("aria-selected", k === i));
  $("h3", panel).textContent = TOPICS[i][0];
  $("p", panel).textContent = TOPICS[i][1];
  panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
}
$$("button", list).forEach(b => {
  const go = () => showTopic(+b.dataset.i);
  b.addEventListener("mouseenter", go); b.addEventListener("focus", go); b.addEventListener("click", go);
});
showTopic(0);

/* Mobile nav */
const burger = $("#burger"), menu = $("#menu");
const setMenu = open => { menu.classList.toggle("open", open); burger.setAttribute("aria-expanded", open); };
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

/* Scroll: navbar blur, progress bar */
const nav = $("#nav"), bar = $("#progress");
function onScroll() {
  nav.classList.toggle("scrolled", scrollY > 10);
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + "%";
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* Active navigation */
const links = $$("a", menu);
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
links.forEach(a => { const s = $(a.getAttribute("href")); if (s) spy.observe(s); });

/* Scroll reveal */
const rv = $$(".reveal");
if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add("in"));

/* Terminal typing */
const term = $("#term");
const P = '<span class="p">fahreza@portfolio:~$</span> ';
const steps = [
  { cmd: "whoami", out: "fahreza" },
  { cmd: 'echo "Hello World"', out: "Hello, I'm Fahreza." }
];
const caret = '<span class="caret" aria-hidden="true"></span>';
async function runTerm() {
  let html = "";
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  for (const s of steps) {
    if (reduced) { html += `${P}${esc(s.cmd)}\n\n${esc(s.out)}\n\n`; continue; }
    for (let i = 1; i <= s.cmd.length; i++) { term.innerHTML = html + P + esc(s.cmd.slice(0, i)) + caret; await sleep(65); }
    await sleep(350);
    html += `${P}${esc(s.cmd)}\n\n`;
    for (let i = 1; i <= s.out.length; i++) { term.innerHTML = html + esc(s.out.slice(0, i)) + caret; await sleep(30); }
    html += esc(s.out) + "\n\n";
    await sleep(500);
  }
  term.innerHTML = html + P + caret;
}
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { o.disconnect(); runTerm(); } }, { threshold: .4 }).observe($(".term"));

/* Subtle cursor glow */
const glow = $("#cursor");
if (!reduced && matchMedia("(hover:hover)").matches) {
  addEventListener("pointermove", e => { glow.classList.add("on"); glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  document.addEventListener("pointerleave", () => glow.classList.remove("on"));
}

/* Contact form: no backend, opens the visitor's mail app.
   Change MAIL_TO to your real email. */
const MAIL_TO = "you@example.com";
const form = $("#form"), msg = $("#form-msg");
form.addEventListener("submit", e => {
  e.preventDefault();
  const d = new FormData(form);
  let ok = true;
  $$("input,textarea", form).forEach(f => {
    const bad = !f.value.trim() || (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle("invalid", bad); if (bad) ok = false;
  });
  if (!ok) { msg.textContent = "Please fill in every field with a valid email."; return; }
  const body = `${d.get("message")}\n\n— ${d.get("name")} (${d.get("email")})`;
  location.href = `mailto:${MAIL_TO}?subject=${encodeURIComponent("Portfolio message from " + d.get("name"))}&body=${encodeURIComponent(body)}`;
  msg.textContent = "Opening your email app to send the message.";
  form.reset();
});