/* ═══════════════════════════════════════════════
   MASTERMIND — TWO WAVES FILMS
   Carga + reveals. Nada más.
   ═══════════════════════════════════════════════ */

// ── REGISTRO ──────────────────────────────────
// Pega aquí la URL pública de tu form de Typeform
// (ej. "https://twowaves.typeform.com/to/AbC123")
const TYPEFORM_URL = "";

document.querySelectorAll("[data-typeform]").forEach((el) => {
  if (TYPEFORM_URL) {
    el.href = TYPEFORM_URL;
    el.target = "_blank";
    el.rel = "noopener";
  } else {
    // sin Typeform: formulario nativo de la página
    el.href = "aplicar.html";
  }
});

// ── PANTALLA DE CARGA ─────────────────────────
// logos rápidos sobre negro, luego entra el sitio
const loader = document.getElementById("loader");
const glyphs = loader.querySelectorAll(".glyph");
const PASO = 210; // ms por logo

document.body.classList.add("cargando");

glyphs.forEach((g, i) => {
  setTimeout(() => {
    glyphs.forEach((x) => x.classList.remove("activo"));
    g.classList.add("activo");
  }, i * PASO);
});

const totalCarga = glyphs.length * PASO + 420;

setTimeout(() => {
  loader.classList.add("fuera");
  document.body.classList.remove("cargando");
  // dispara los reveals del hero
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("visto"));
}, totalCarga);

// ── REVEALS AL HACER SCROLL ───────────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visto");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("body > :not(.hero) .reveal").forEach((el) => observer.observe(el));
