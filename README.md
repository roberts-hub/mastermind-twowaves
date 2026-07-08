# MASTERMIND — Two Waves Films

Landing page para el mastermind presencial de Two Waves Films.
1 día. 20 lugares. Guadalajara, MX. Solo por aplicación.

## Estructura

```
index.html        página única (loader + hero + evento + hosts + aplicar + footer)
css/estilo.css    sistema de diseño (modo oscuro, Archivo + IBM Plex Mono, grano)
js/main.js        pantalla de carga, reveals y link de registro
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

Mientras esté vacía, el botón APLICAR cae a `mailto:contacto@twowaves.mx`.
El Typeform se conecta a Google Sheets desde el panel de Typeform
(Connect → Google Sheets).

## Sistema de diseño

- Fondo `#0e0e0d` · texto hueso `#e7e2d6` · greige `#b0a595` · lino `#e5e0d5` · punto rojo `#c0392b`
- Tipografías: Archivo (display) + IBM Plex Mono (texto técnico)
- Grano cinematográfico vía SVG turbulence
- Isotipo "T·" con punto rojo, en SVG inline
