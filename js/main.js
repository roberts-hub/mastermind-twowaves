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
// fase 1: texto palabra por palabra → botón ENTRAR
// fase 2: logos rápidos sobre negro → entra el sitio
const loader = document.getElementById("loader");
const intro = loader.querySelector(".loader-intro");
const introBtn = document.getElementById("intro-btn");
const glyphs = loader.querySelectorAll(".glyph");
const PASO = 210; // ms por logo

document.body.classList.add("cargando");

// separa cada línea en palabras con delay en cascada
let delay = 0.2;
intro.querySelectorAll(".intro-linea").forEach((linea) => {
  const palabras = linea.textContent.trim().split(/\s+/);
  linea.textContent = "";
  palabras.forEach((palabra, i) => {
    const span = document.createElement("span");
    span.className = "palabra";
    span.textContent = palabra;
    span.style.setProperty("--d", delay + "s");
    delay += 0.09;
    linea.appendChild(span);
    if (i < palabras.length - 1) linea.appendChild(document.createTextNode(" "));
  });
  delay += 0.35; // pausa entre líneas
});
introBtn.style.setProperty("--d", delay + 0.3 + "s");

// clic en ENTRAR → logos → sitio
introBtn.addEventListener("click", () => {
  intro.classList.add("fuera");
  loader.classList.add("fase-logos");

  glyphs.forEach((g, i) => {
    setTimeout(() => {
      glyphs.forEach((x) => x.classList.remove("activo"));
      g.classList.add("activo");
    }, 350 + i * PASO);
  });

  setTimeout(() => {
    loader.classList.add("fuera");
    document.body.classList.remove("cargando");
    // dispara los reveals del hero
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("visto"));
  }, 350 + glyphs.length * PASO + 420);
}, { once: true });

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
