/* ═══════════════════════════════════════════════
   LISTA DE ESPERA — captura de leads
   Envía nombre + correo + whatsapp → Google Sheets
   (Apps Script). Ver apps-script/lista.gs para activarlo.
   ═══════════════════════════════════════════════ */

// Pega aquí la URL del web app de Apps Script (termina en /exec)
const SHEETS_ENDPOINT = "";

const form = document.getElementById("form-lista");
const estado = document.getElementById("form-estado");
const modal = document.getElementById("modal-gracias");

// ── REVEALS DE ENTRADA ────────────────────────
// Se muestran de inmediato al cargar (sin loader).
requestAnimationFrame(() => {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visto"));
});

// ── VALIDACIÓN SIMPLE ─────────────────────────
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
  document.body.classList.add("cargando"); // bloquea scroll de fondo
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
