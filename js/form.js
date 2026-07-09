/* ═══════════════════════════════════════════════
   APLICACIÓN — flujo tipo Typeform (una pregunta
   a la vez) → Google Sheets (Apps Script)
   ═══════════════════════════════════════════════ */

// Pega aquí la URL del web app de Apps Script
// (ver apps-script/registro.gs para el código y pasos)
const SHEETS_ENDPOINT = "";

const form = document.getElementById("form-aplicar");
const estado = document.getElementById("form-estado");
const pasos = Array.from(form.querySelectorAll("[data-paso]"));
const fill = form.querySelector(".flujo-fill");
const modal = document.getElementById("modal-gracias");

let actual = 0;

// ── NAVEGACIÓN ENTRE PASOS ────────────────────
function mostrar(i) {
  actual = i;
  pasos.forEach((p, n) => p.classList.toggle("activa", n === i));
  fill.style.width = ((i + 1) / pasos.length) * 100 + "%";
  const campo = pasos[i].querySelector("input, textarea, select");
  if (campo) setTimeout(() => campo.focus(), 60);
  estado.textContent = "";
}

// valida solo los campos requeridos del paso actual
function pasoValido(i) {
  const campos = pasos[i].querySelectorAll("input, textarea, select");
  for (const c of campos) {
    if (!c.checkValidity()) {
      c.reportValidity();
      c.classList.add("invalido");
      return false;
    }
    c.classList.remove("invalido");
  }
  return true;
}

function siguiente() {
  if (!pasoValido(actual)) return;
  if (actual < pasos.length - 1) mostrar(actual + 1);
}

function atras() {
  if (actual > 0) mostrar(actual - 1);
}

form.querySelectorAll("[data-siguiente]").forEach((b) =>
  b.addEventListener("click", siguiente)
);
form.querySelectorAll("[data-atras]").forEach((b) =>
  b.addEventListener("click", atras)
);

// Enter avanza (menos en textarea, donde Enter = salto de línea)
form.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;
  if (e.target.tagName === "TEXTAREA") return;
  e.preventDefault();
  const esUltimo = actual === pasos.length - 1;
  if (esUltimo) form.requestSubmit();
  else siguiente();
});

mostrar(0);

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

  // valida el paso final antes de enviar
  if (!pasoValido(actual)) return;
  if (!form.checkValidity()) {
    estado.textContent = "COMPLETA TODOS LOS CAMPOS";
    return;
  }

  const boton = pasos[pasos.length - 1].querySelector("button[type=submit]");
  boton.disabled = true;
  estado.textContent = "ENVIANDO…";

  const datos = new URLSearchParams(new FormData(form));
  datos.append("fecha", new Date().toISOString());

  try {
    if (!SHEETS_ENDPOINT) {
      // sin endpoint todavía: cae a correo con los datos precargados
      const cuerpo = [...new FormData(form).entries()]
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join("\n");
      abrirGracias();
      setTimeout(() => {
        location.href =
          "mailto:contacto@twowaves.mx?subject=APLICACI%C3%93N%20MASTERMIND&body=" +
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
