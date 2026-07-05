// ============================================================
// SALMAS · by CJ — Servidor estático de preview
// ------------------------------------------------------------
// Uso:  node server.js   →   http://localhost:5173
//
// Lee la configuración desde variables de entorno (.env) y expone
// SOLO los valores públicos al navegador a través de /config.js.
// Los secretos reales (pagos, base de datos) JAMÁS deben enviarse
// al cliente; vivirían aquí en el servidor y se usarían en rutas
// de backend, nunca en /config.js.
// ============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;

/* ---------- Cargador de .env (sin dependencias) ----------
   Si existe un archivo .env, lee sus líneas KEY=VALUE y las
   mete en process.env (sin pisar lo que ya esté definido). */
function cargarEnv() {
  const ruta = path.join(ROOT, ".env");
  if (!fs.existsSync(ruta)) return;
  const lineas = fs.readFileSync(ruta, "utf8").split("\n");
  for (const linea of lineas) {
    const limpia = linea.trim();
    if (!limpia || limpia.startsWith("#")) continue;
    const i = limpia.indexOf("=");
    if (i === -1) continue;
    const clave = limpia.slice(0, i).trim();
    let valor = limpia.slice(i + 1).trim();
    valor = valor.replace(/^["']|["']$/g, "");
    if (!(clave in process.env)) process.env[clave] = valor;
  }
}
cargarEnv();

const PORT = process.env.PORT || 5173;

const CONFIG_PUBLICA = {
  whatsapp: process.env.WHATSAPP_NUMERO || "521234567890",
};

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

const ALLOWED_EXTENSIONS = [".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".svg"];

// Validar que la ruta resulta dentro de ROOT
function esRutaSegura(ruta) {
  const absoluta = path.resolve(ruta);
  const raiz = path.resolve(ROOT);
  return absoluta.startsWith(raiz);
}

// Headers de seguridad para todas las respuestas
function agregarHeadersSeguridad(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://wa.me",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self' https://wa.me"
  ].join("; ");

  res.setHeader("Content-Security-Policy", csp);
}

http
  .createServer((req, res) => {
    agregarHeadersSeguridad(res);

    let urlPath = decodeURIComponent(req.url.split("?")[0]);

    if (urlPath.includes("..")) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 - Acceso denegado");
      return;
    }

    if (urlPath === "/config.js") {
      const js = "window.SALMAS_CONFIG = " + JSON.stringify(CONFIG_PUBLICA) + ";";
      res.writeHead(200, { "Content-Type": TYPES[".js"] });
      res.end(js);
      return;
    }

    if (urlPath === "/") urlPath = "/index.html";
    const filePath = path.join(ROOT, urlPath);

    if (!esRutaSegura(filePath)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 - Acceso denegado");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 - Tipo de archivo no permitido");
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 - Recurso no encontrado");
        return;
      }
      res.writeHead(200, { "Content-Type": TYPES[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("Preview en http://localhost:" + PORT));
