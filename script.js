/* ===== CONFIG: replace with the real firm's details ===== */
const CONFIG = {
  short: "N SAND",                 // wordmark first part
  city: "Your City, India",        // e.g. "Pune, Maharashtra"
  address: "Your City, India",
  email: "hello@example.com",
  whatsapp: "919999999999",        // country code + number, no "+"
  instagram: "https://instagram.com/ca_nsand.co",
  formEndpoint: ""                 // e.g. Formspree URL. Empty = demo mode (nothing is sent)
};
document.documentElement.classList.remove("no-js");
document.querySelectorAll("[data-cfg]").forEach(e => e.textContent = CONFIG[e.dataset.cfg]);
const $ = id => document.getElementById(id);
$("mail").href = "mailto:" + CONFIG.email; $("mail").textContent = CONFIG.email;
$("wa").href = "https://wa.me/" + CONFIG.whatsapp; $("ig").href = CONFIG.instagram;
$("yr").textContent = new Date().getFullYear();

/* Sticky nav shadow + mobile menu */
const nav = $("nav"), burger = $("burger"), menu = $("menu");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), {passive:true});
const setMenu = o => { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); burger.setAttribute("aria-label", o ? "Close menu" : "Open menu"); };
burger.onclick = () => setMenu(!menu.classList.contains("open"));
menu.addEventListener("click", e => e.target.tagName === "A" && setMenu(false));
addEventListener("keydown", e => e.key === "Escape" && setMenu(false));

/* Reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:.12});
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* FAQ accordion (buttons are natively keyboard accessible; arrows move focus) */
const qs = [...document.querySelectorAll(".acc button")];
qs.forEach((b, i) => {
  b.onclick = () => { const o = b.getAttribute("aria-expanded") === "true"; b.setAttribute("aria-expanded", !o); $(b.getAttribute("aria-controls")).hidden = o; };
  b.onkeydown = e => { if (e.key === "ArrowDown") { e.preventDefault(); qs[(i+1)%qs.length].focus(); } if (e.key === "ArrowUp") { e.preventDefault(); qs[(i-1+qs.length)%qs.length].focus(); } };
});

/* Service "Learn more" preselects the form */
document.querySelectorAll("[data-svc]").forEach(a => a.addEventListener("click", () => $("service").value = a.dataset.svc));

/* Form validation. Never reports success unless a real endpoint confirms it. */
const form = $("form"), status = $("status");
form.addEventListener("submit", async e => {
  e.preventDefault(); status.className = "status"; status.textContent = "";
  let ok = true;
  const msgs = {name:"Please enter your full name.", email:"Please enter a valid email address.", phone:"Please enter a valid 10-digit phone number.", type:"Please choose a client type.", service:"Please choose a service.", consent:"Please accept to continue."};
  ["name","email","phone","type","service","consent"].forEach(n => {
    const f = form.elements[n]; let v = f.type === "checkbox" ? f.checked : f.value.trim();
    if (n === "email") v = v && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
    if (n === "phone") v = /^(\+91[\s-]?)?[6-9]\d{9}$/.test(f.value.replace(/[\s-]/g,"").replace(/^\+91/,"+91"));
    f.setAttribute("aria-invalid", !v); f.parentElement.querySelector(".err").textContent = v ? "" : msgs[n]; if (!v) ok = false;
  });
  if (!ok) return form.querySelector("[aria-invalid=true]").focus();
  if (!CONFIG.formEndpoint) { status.className = "status bad"; status.textContent = "Demo mode: no form service is connected, so nothing was sent. Please use the email or WhatsApp links."; return; }
  const btn = $("submit"); btn.disabled = true; status.textContent = "Sending…";
  try {
    const r = await fetch(CONFIG.formEndpoint, {method:"POST", headers:{Accept:"application/json"}, body:new FormData(form)});
    if (!r.ok) throw 0; status.className = "status ok"; status.textContent = "Thank you. Your enquiry has been sent."; form.reset();
  } catch { status.className = "status bad"; status.textContent = "Something went wrong. Please try again or contact us directly."; }
  btn.disabled = false;
});


   document.addEventListener("click", e => { if (!nav.contains(e.target)) setMenu(false); });

/* Legal placeholder modal */
const modal = $("modal");
document.querySelectorAll("[data-modal]").forEach(a => a.onclick = e => { e.preventDefault(); $("mt").textContent = a.dataset.modal; modal.showModal(); });
$("mc").onclick = () => modal.close();
