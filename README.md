# MASTERMIND — Two Waves Films

Landing page para el mastermind presencial de Two Waves Films.
1 día. 20 lugares. Guadalajara, MX. Solo por aplicación.

## Estructura

```
index.html               landing (loader + hero + evento + hosts + aplicar + footer)
aplicar.html             formulario nativo de aplicación
css/estilo.css           sistema de diseño (modo oscuro, Archivo + IBM Plex Mono, grano)
js/main.js               pantalla de carga, reveals y link de registro
js/form.js               envío del formulario a Google Sheets
apps-script/registro.gs  código para el web app de Google Apps Script
```

## Correr local

Cualquier servidor estático sirve. Por ejemplo:

```
npx serve .
```

## Conectar Typeform

En `js/main.js`, pega la URL pública del form en la constante `TYPEFORM_URL`:

```js
const TYPEFORM_URL = "https://twowaves.typeform.com/to/XXXXXX";
```

Mientras esté vacía, el botón APLICAR lleva al formulario nativo
(`aplicar.html`). El Typeform se conecta a Google Sheets desde el panel
de Typeform (Connect → Google Sheets).

## Formulario nativo → Google Sheets

`aplicar.html` envía a un web app de Google Apps Script. Los pasos están
en [apps-script/registro.gs](apps-script/registro.gs): crear un Sheet,
pegar ese código en Extensiones → Apps Script, implementar como
aplicación web y pegar la URL resultante en `js/form.js` →
`SHEETS_ENDPOINT`. Mientras el endpoint esté vacío, el formulario cae a
un correo precargado a contacto@twowaves.mx (no se pierde ninguna
aplicación).

## Sistema de diseño

- Fondo `#0e0e0d` · texto hueso `#e7e2d6` · greige `#b0a595` · lino `#e5e0d5` · punto rojo `#c0392b`
- Tipografías: Archivo (display) + IBM Plex Mono (texto técnico)
- Grano cinematográfico vía SVG turbulence
- Isotipo "T·" con punto rojo, en SVG inline
