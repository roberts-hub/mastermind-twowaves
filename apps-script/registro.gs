/**
 * MASTERMIND — Two Waves Films
 * Recibe aplicaciones del formulario y las guarda en Google Sheets.
 *
 * CÓMO ACTIVARLO (5 min):
 * 1. Crea un Google Sheet nuevo llamado "Aplicaciones Mastermind".
 * 2. En el Sheet: Extensiones → Apps Script.
 * 3. Borra el código de ejemplo y pega este archivo completo.
 * 4. Implementar → Nueva implementación → tipo "Aplicación web":
 *      - Ejecutar como: Tú
 *      - Acceso: Cualquier persona
 * 5. Autoriza los permisos y copia la URL del web app.
 * 6. Pega esa URL en js/form.js → SHEETS_ENDPOINT.
 */

var COLUMNAS = ["fecha", "nombre", "correo", "lada", "celular", "instagram", "portafolio", "negocio", "tema"];

function doPost(e) {
  var hoja = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // encabezados la primera vez
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS.map(function (c) { return c.toUpperCase(); }));
  }

  var fila = COLUMNAS.map(function (campo) {
    return (e.parameter[campo] || "").toString().trim();
  });

  hoja.appendRow(fila);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
