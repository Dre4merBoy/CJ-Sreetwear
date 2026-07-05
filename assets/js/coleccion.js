/* ============================================================
   SALMAS · by CJ
   Página de colección (plantilla dinámica)
   ============================================================ */

// Sanitizar HTML para prevenir XSS
function escaparHTML(texto) {
  const mapa = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(texto).replace(/[&<>"']/g, char => mapa[char]);
}

const COLECCIONES = {
  "dreamer-club": {
    indice: "01",
    nombre: "Dreamer Club",
    desc: "El origen del movimiento. Siluetas oversize lavadas, tipografía western y el monograma CJ. La pieza que lo empezó todo.",
    banner: "../assets/img/dream.png",
    productos: [
      { img: "../assets/img/productos/c1-1.png", nombre: "Dreamer Club Raglan",     corte: "Raglan · manga larga",     tela: "Algodón peinado 220g", color: "Crema / Negro",  tallas: "XS – XL", precio: "$749" },
      { img: "../assets/img/productos/c1-3.png", nombre: "Dreamer Oversize Tee",     corte: "Oversize · caída amplia",  tela: "Algodón pesado 240g",  color: "Negro Lavado",   tallas: "S – XXL", precio: "$699" },
      { img: "../assets/img/productos/c1-4.png", nombre: "Dreamer Baby Tee",         corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",  color: "Oatmeal",        tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c1-2.png", nombre: "Club Thorn Tee",           corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",  color: "Cherry Oscuro",  tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c1-5.png", nombre: "Off Shoulder Long Sleeve", corte: "Hombros descubiertos",     tela: "Punto rib 200g",       color: "Cherry Oscuro",  tallas: "XS – L",  precio: "$749" },
    ],
  },

  "dark-bloom": {
    indice: "06",
    nombre: "Dark Bloom",
    desc: "Rosas marchitas, cruces y el monograma CJ sobre Cherry Oscuro. Lo gótico hecho prenda.",
    banner: "../assets/img/col-01-dark-bloom.png",
    productos: [
      { img: "../assets/img/productos/c1-1.png", nombre: "Dark Bloom Raglan",        corte: "Raglan · manga larga",     tela: "Algodón peinado 220g",       color: "Crema / Negro",   tallas: "XS – XL", precio: "$749" },
      { img: "../assets/img/productos/c1-2.png", nombre: "Thorn Baby Tee",           corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Cherry Oscuro",   tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c1-3.png", nombre: "Wilt Oversize Tee",        corte: "Oversize · caída amplia",  tela: "Algodón pesado 240g",        color: "Negro Lavado",    tallas: "S – XXL", precio: "$699" },
      { img: "../assets/img/productos/c1-4.png", nombre: "Dreamer Baby Tee",         corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Oatmeal",         tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c1-5.png", nombre: "Off Shoulder Long Sleeve", corte: "Hombros descubiertos",     tela: "Punto rib 200g",             color: "Cherry Oscuro",   tallas: "XS – L",  precio: "$749" },
    ],
  },

  "tokyo-dreams": {
    indice: "05",
    nombre: "Tokyo Dreams",
    desc: "Montañas, bambú y kanji. Serenidad japandi en tonos Crema, Oatmeal y Mocha.",
    banner: "../assets/img/col-02-tokyo-dreams.png",
    productos: [
      { img: "../assets/img/productos/c2-1.png", nombre: "Hikari Baby Tee",          corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Crema",          tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c2-2.png", nombre: "Shizuka Baby Tee",         corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Negro Lavado",   tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c2-3.png", nombre: "Fuji Oversize Tee",        corte: "Oversize · caída amplia",  tela: "Algodón pesado 240g",        color: "Oatmeal",        tallas: "S – XXL", precio: "$699" },
      { img: "../assets/img/productos/c2-4.png", nombre: "Wake Baby Tee",            corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Mocha",          tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c2-5.png", nombre: "Kaze Henley Long Sleeve",  corte: "Henley · manga larga",     tela: "Punto waffle 210g",          color: "Crema",          tallas: "S – XL",  precio: "$749" },
    ],
  },

  "broken-cherry": {
    indice: "04",
    nombre: "Broken Cherry",
    desc: "Sakura desgarrada y lunas crecientes. Belleza fragmentada en flor.",
    banner: "../assets/img/col-03-broken-cherry.png",
    productos: [
      { img: "../assets/img/productos/c3-1.png", nombre: "Sakura Off Shoulder",      corte: "Hombros descubiertos",     tela: "Punto rib 200g",             color: "Cherry Oscuro",  tallas: "XS – L",  precio: "$749" },
      { img: "../assets/img/productos/c3-2.png", nombre: "Broken Baby Tee",          corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Crema",          tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c3-3.png", nombre: "Sakura Oversize Tee",      corte: "Oversize · caída amplia",  tela: "Algodón pesado 240g",        color: "Negro Lavado",   tallas: "S – XXL", precio: "$699" },
      { img: "../assets/img/productos/c3-4.png", nombre: "Tsuki Baby Tee",           corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Cherry Oscuro",  tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c3-5.png", nombre: "Hana Long Sleeve",         corte: "Manga larga · fringe",     tela: "Punto rib 200g",             color: "Oatmeal",        tallas: "S – XL",  precio: "$799" },
    ],
  },

  "dreamer-west": {
    indice: "02",
    nombre: "Dreamer West",
    desc: "Desierto, polvo y actitud. Gráficos crudos, alas y cruces para el oeste reinterpretado.",
    banner: "../assets/img/col-04-metal-heart.png",
    productos: [
      { img: "../assets/img/productos/c4-1.png", nombre: "Angel Wings Long Sleeve",  corte: "Manga larga · oversize",   tela: "Algodón pesado 240g",        color: "Negro Lavado",   tallas: "S – XXL", precio: "$799" },
      { img: "../assets/img/productos/c4-2.png", nombre: "Metal Baby Tee",           corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Crema",          tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c4-3.png", nombre: "Cross Oversize Tee",       corte: "Oversize · caída amplia",  tela: "Algodón pesado 240g",        color: "Cherry Oscuro",  tallas: "S – XXL", precio: "$699" },
      { img: "../assets/img/productos/c4-4.png", nombre: "Thorn Baby Tee",           corte: "Baby tee · ajustado",      tela: "Algodón lavado 180g",        color: "Negro",          tallas: "XS – L",  precio: "$549" },
      { img: "../assets/img/productos/c4-5.png", nombre: "Raglan Metal Long Sleeve", corte: "Raglan · manga larga",     tela: "Algodón peinado 220g",       color: "Crema / Negro",  tallas: "XS – XL", precio: "$749" },
    ],
  },

  "dreamer-vision": {
    indice: "03",
    nombre: "Dreamer Vision",
    desc: "Calma y claridad. Pants, sets y esenciales depurados en Crema, Oatmeal y Mocha.",
    banner: "../assets/img/col-05-japandi-essence.png",
    productos: [
      { img: "../assets/img/productos/c5-1.png", nombre: "Wide Leg Pant",        corte: "Wide leg · tiro alto",    tela: "French terry 320g",   color: "Crema",         tallas: "XS – XL", precio: "$899" },
      { img: "../assets/img/productos/c5-2.png", nombre: "Wide Leg Print Pant",  corte: "Wide leg · tiro alto",    tela: "French terry 320g",   color: "Negro Lavado",  tallas: "XS – XL", precio: "$949" },
      { img: "../assets/img/productos/c5-3.png", nombre: "Wide Leg Pant",        corte: "Wide leg · tiro alto",    tela: "French terry 320g",   color: "Mocha",         tallas: "XS – XL", precio: "$899" },
      { img: "../assets/img/productos/c5-4.png", nombre: "Jogger",              corte: "Jogger · puño elástico",  tela: "French terry 320g",   color: "Oatmeal",       tallas: "XS – XL", precio: "$849" },
      { img: "../assets/img/productos/c5-5.png", nombre: "Jogger Print",        corte: "Jogger · puño elástico",  tela: "French terry 320g",   color: "Negro Lavado",  tallas: "XS – XL", precio: "$899" },
      { img: "../assets/img/productos/c5-set1.png", nombre: "Sunset Set",       corte: "Set · top + pant",        tela: "French terry 320g",   color: "Crema",         tallas: "XS – XL", precio: "$1,399" },
      { img: "../assets/img/productos/c5-set2.png", nombre: "Cherry Set",       corte: "Set · top + jogger",      tela: "French terry 320g",   color: "Cherry Oscuro", tallas: "XS – XL", precio: "$1,399" },
      { img: "../assets/img/productos/c5-set3.png", nombre: "Midnight Set",     corte: "Set · top + jogger",      tela: "French terry 320g",   color: "Negro Lavado",  tallas: "XS – XL", precio: "$1,399" },
      { img: "../assets/img/productos/c5-accesorios.png", nombre: "Accesorios CJ", corte: "Caps & Bags",          tela: "Twill / gamuza sintética", color: "Varios",   tallas: "Única",   precio: "desde $399" },
    ],
  },
};

/* ---------- Render ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // 1) Leer y validar parámetro ?c= contra lista blanca
  const slug = new URLSearchParams(window.location.search).get("c");
  const coleccionesValidas = Object.keys(COLECCIONES);

  if (!slug || !coleccionesValidas.includes(slug)) {
    window.location.href = "index.html";
    return;
  }

  const data = COLECCIONES[slug];

  // 2) Título y header (con textContent para evitar XSS)
  document.title = `DREAMER · ${escaparHTML(data.nombre)}`;
  document.getElementById("colIndice").textContent = data.indice;
  document.getElementById("colNombre").textContent = data.nombre;
  document.getElementById("colDesc").textContent = data.desc;
  document.getElementById("colBanner").style.backgroundImage = `url("${escaparHTML(data.banner)}")`;

  // 3) Construir grid de prendas de forma segura
  const grid = document.getElementById("prodGrid");
  data.productos.forEach((p) => {
    const msg = `Hola SALMAS 👋, me interesa: ${escaparHTML(p.nombre)} (${escaparHTML(data.nombre)}) — color ${escaparHTML(p.color)}.`;

    const card = document.createElement("article");
    card.className = "prod reveal";

    // Media
    const mediaDiv = document.createElement("div");
    mediaDiv.className = "prod__media";
    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.nombre;
    img.loading = "lazy";
    mediaDiv.appendChild(img);

    // Body
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "prod__body";

    const h3 = document.createElement("h3");
    h3.className = "prod__name";
    h3.textContent = p.nombre;

    const ul = document.createElement("ul");
    ul.className = "prod__specs";

    const specs = [
      { label: "Corte", valor: p.corte },
      { label: "Tela", valor: p.tela },
      { label: "Color", valor: p.color },
      { label: "Tallas", valor: p.tallas }
    ];

    specs.forEach(spec => {
      const li = document.createElement("li");
      const span = document.createElement("span");
      span.textContent = spec.label;
      const b = document.createElement("b");
      b.textContent = spec.valor;
      li.appendChild(span);
      li.appendChild(b);
      ul.appendChild(li);
    });

    bodyDiv.appendChild(h3);
    bodyDiv.appendChild(ul);

    // Footer
    const footDiv = document.createElement("div");
    footDiv.className = "prod__foot";

    const priceSpan = document.createElement("span");
    priceSpan.className = "prod__price";
    priceSpan.textContent = p.precio;

    const link = document.createElement("a");
    link.className = "btn btn--whatsapp prod__buy js-wa";
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("data-msg", msg);

    const icon = document.createElement("span");
    icon.className = "wa-icon";
    icon.setAttribute("aria-hidden", "true");

    const linkText = document.createTextNode(" Pedir");

    link.appendChild(icon);
    link.appendChild(linkText);

    footDiv.appendChild(priceSpan);
    footDiv.appendChild(link);

    bodyDiv.appendChild(footDiv);

    card.appendChild(mediaDiv);
    card.appendChild(bodyDiv);

    grid.appendChild(card);
  });
});
