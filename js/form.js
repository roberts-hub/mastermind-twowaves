/* ═══════════════════════════════════════════════
   APLICACIÓN → GOOGLE SHEETS (Apps Script)
   ═══════════════════════════════════════════════ */

// Pega aquí la URL del web app de Apps Script
// (ver apps-script/registro.gs para el código y pasos)
const SHEETS_ENDPOINT = "";

const form = document.getElementById("form-aplicar");
const exito = document.getElementById("form-exito");
const estado = document.getElementById("form-estado");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    estado.textContent = "COMPLETA TODOS LOS CAMPOS";
    return;
  }

  const datos = new URLSearchParams(new FormData(form));
  datos.append("fecha", new Date().toISOString());

  const boton = form.querySelector("button");
  boton.disabled = true;
  estado.textContent = "ENVIANDO…";

  try {
    if (!SHEETS_ENDPOINT) {
      // sin endpoint todavía: cae a correo con los datos precargados
      const cuerpo = [...new FormData(form).entries()]
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join("\n");
      location.href =
        "mailto:contacto@twowaves.mx?subject=APLICACI%C3%93N%20MASTERMIND&body=" +
        encodeURIComponent(cuerpo);
      estado.textContent = "";
      boton.disabled = false;
      return;
    }

    await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: datos,
    });

    form.hidden = true;
    document.querySelectorAll(".aplicar .etiqueta, .aplicar .titulo, .aplicar-intro").forEach((el) => {
      if (!exito.contains(el)) el.hidden = true;
    });
    exito.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch {
    estado.textContent = "ERROR AL ENVIAR — INTENTA DE NUEVO";
    boton.disabled = false;
  }
});
