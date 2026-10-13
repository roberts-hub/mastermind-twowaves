/* ═══════════════════════════════════════════════
   LISTA DE ESPERA — Two Waves Films
   Intro (loader) + reveals + captura de leads
   Envía nombre + correo + whatsapp → Google Sheets
   (Apps Script). Ver apps-script/lista.gs para activarlo.
   ═══════════════════════════════════════════════ */

// Pega aquí la URL del web app de Apps Script (termina en /exec)
const SHEETS_ENDPOINT = "";

/* ── PANTALLA DE CARGA ─────────────────────────
   fase 1: texto palabra por palabra → botón ENTRAR
   fase 2: logos rápidos sobre negro → entra el sitio */
const loader = document.getElementById("loader");
const intro = loader.querySelector(".loader-intro");
const introBtn = document.getElementById("intro-btn");
const glyphsLoader = loader.querySelectorAll(".glyph");
const PASO = 210; // ms por logo

document.body.classList.add("cargando");

// separa cada línea en palabras con delay en cascada (relativo a su línea)
const lineas = [...intro.querySelectorAll(".intro-linea")];
lineas.forEach((linea) => {
  const palabras = linea.textContent.trim().split(/\s+/);
  linea.textContent = "";
  palabras.forEach((palabra, i) => {
    const span = document.createElement("span");
    span.className = "palabra";
    span.textContent = palabra;
    span.style.setProperty("--d", i * 0.09 + "s");
    linea.appendChild(span);
  });
});

// las líneas entran una tras otra y se quedan apiladas
let t = 300;
lineas.forEach((linea, idx) => {
  const cascada = linea.children.length * 90 + 700;
  setTimeout(() => linea.classList.add("activa"), t);
  t += cascada - 250;
  if (idx === lineas.length - 1) {
    setTimeout(() => introBtn.classList.add("visible"), t + 600);
  }
});

// clic en ENTRAR → logos → sitio
introBtn.addEventListener("click", () => {
  intro.classList.add("fuera");
  loader.classList.add("fase-logos");

  glyphsLoader.forEach((g, i) => {
    setTimeout(() => {
      glyphsLoader.forEach((x) => x.classList.remove("activo"));
      g.classList.add("activo");
    }, 350 + i * PASO);
  });

  setTimeout(() => {
    loader.classList.add("fuera");
    document.body.classList.remove("cargando");
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("visto"));
  }, 350 + glyphsLoader.length * PASO + 420);
}, { once: true });

/* ── REVEALS AL HACER SCROLL ─────────────────── */
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

/* ═══════════════════════════════════════════════
   FORMULARIO DE CAPTURA
   ═══════════════════════════════════════════════ */
const form = document.getElementById("form-lista");
const estado = document.getElementById("form-estado");
const modal = document.getElementById("modal-gracias");

function valido() {
  let ok = true;
  form.querySelectorAll("input[required]").forEach((c) => {
    if (!c.checkValidity()) {
      c.classList.add("invalido");
      if (ok) c.reportValidity();
      ok = false;
    } else {
      c.classList.remove("invalido");
    }
  });
  return ok;
}

form.querySelectorAll("input").forEach((c) =>
  c.addEventListener("input", () => c.classList.remove("invalido"))
);

// ── POP-UP DE GRACIAS (logos rotando) ─────────
let rotacion = null;
function abrirGracias() {
  const glyphs = modal.querySelectorAll(".glyph");
  let g = 0;
  const girar = () => {
    glyphs.forEach((x) => x.classList.remove("activo"));
    glyphs[g % glyphs.length].classList.add("activo");
    g++;
  };
  girar();
  rotacion = setInterval(girar, 480);

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("abierto"));
  document.body.classList.add("cargando");
}

// ── ENVÍO ─────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!valido()) return;

  const boton = form.querySelector("button[type=submit]");
  boton.disabled = true;
  estado.textContent = "ENVIANDO…";

  const datos = new URLSearchParams(new FormData(form));
  datos.append("fecha", new Date().toISOString());

  try {
    if (!SHEETS_ENDPOINT) {
      // Sin endpoint todavía: cae a correo con los datos precargados.
      const cuerpo = [...new FormData(form).entries()]
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join("\n");
      abrirGracias();
      setTimeout(() => {
        location.href =
          "mailto:contacto@twowaves.mx?subject=NUEVO%20INTERESADO%20-%20LISTA%20DE%20ESPERA&body=" +
          encodeURIComponent(cuerpo);
      }, 400);
      return;
    }

    await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: datos,
    });

    abrirGracias();
  } catch {
    estado.textContent = "ERROR AL ENVIAR — INTENTA DE NUEVO";
    boton.disabled = false;
  }
});
