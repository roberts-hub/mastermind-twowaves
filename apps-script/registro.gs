/**
 * MASTERMIND — Two Waves Films
 * Base de datos de aplicaciones: recibe el formulario de aplicar.html,
 * guarda cada solicitud como fila en Google Sheets y avisa por correo.
 *
 * CÓMO ACTIVARLO (5 min, una sola vez):
 * 1. Crea un Google Sheet nuevo llamado "Aplicaciones Mastermind"
 *    (con la cuenta donde quieras la base de datos).
 * 2. En el Sheet: Extensiones → Apps Script.
 * 3. Borra el código de ejemplo y pega este archivo completo.
 * 4. Ajusta NOTIFICAR con los correos que deben recibir el aviso.
 * 5. Implementar → Nueva implementación → tipo "Aplicación web":
 *      - Ejecutar como: Tú
 *      - Quién tiene acceso: Cualquier persona
 * 6. Autoriza los permisos que pida (hoja de cálculo + enviar correo)
 *    y copia la URL del web app (termina en /exec).
 * 7. Pega esa URL en js/form.js → SHEETS_ENDPOINT y sube el cambio.
 *
 * Para probar sin el sitio: pega la URL /exec en el navegador con
 * ?nombre=Prueba&correo=test@test.com al final — debe crear una fila
 * en el Sheet y mandarte el correo de aviso.
 */

// correos que reciben el aviso de cada nueva solicitud
var NOTIFICAR = ["contacto@twowaves.mx"];

// columnas de la base de datos (mismo orden en el Sheet)
var COLUMNAS = ["fecha", "nombre", "correo", "lada", "celular", "instagram", "portafolio", "negocio", "tema"];

var ETIQUETAS = {
  fecha: "Fecha",
  nombre: "Nombre",
  correo: "Correo",
  lada: "Lada",
  celular: "Celular",
  instagram: "Instagram",
  portafolio: "Portafolio",
  negocio: "¿Dónde está tu negocio hoy?",
  tema: "Tema que más le interesa",
};

function doPost(e) {
  return registrar(e);
}

// permite probar pegando la URL /exec?nombre=... en el navegador
function doGet(e) {
  return registrar(e);
}

function registrar(e) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // encabezados la primera vez
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(function (c) { return (ETIQUETAS[c] || c).toUpperCase(); }));
    hoja.setFrozenRows(1);
  }

  var datos = {};
  COLUMNAS.forEach(function (campo) {
    datos[campo] = ((e && e.parameter && e.parameter[campo]) || "").toString().trim();
  });
  if (!datos.fecha) datos.fecha = new Date().toISOString();

  // fila nueva en la base de datos
  hoja.appendRow(COLUMNAS.map(function (c) { return datos[c]; }));

  // aviso por correo a los fundadores
  try {
    var cuerpo = COLUMNAS.map(function (c) {
      return (ETIQUETAS[c] || c) + ": " + (datos[c] || "—");
    }).join("\n");
    cuerpo += "\n\nVer todas las aplicaciones:\n" + SpreadsheetApp.getActiveSpreadsheet().getUrl();

    MailApp.sendEmail({
      to: NOTIFICAR.join(","),
      subject: "Nueva aplicación al Mastermind — " + (datos.nombre || "sin nombre"),
      body: cuerpo,
    });
  } catch (err) {
    // si el correo falla, la fila ya quedó guardada — no se pierde nada
  }

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
