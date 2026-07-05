/* ============================================================
   SALMAS · by CJ — Street Western
   Lógica de animaciones
   ------------------------------------------------------------
   Este archivo controla:
     1) Scroll Reveal  → secciones que aparecen al hacer scroll
     2) Header dinámico → fondo sólido al desplazarse
   ============================================================ */

/* ============================================================
   PANTALLA DE CARGA — estrella del logo
   Se muestra al abrir cada página y al navegar a otra interna.
   Failsafe por tiempo: nunca bloquea el contenido.
   ============================================================ */
(function () {
  const getLoader = () => document.getElementById("pageLoader");
  const ocultar = () => { const l = getLoader(); if (l) l.classList.add("is-hidden"); };
  const mostrar = () => { const l = getLoader(); if (l) l.classList.remove("is-hidden"); };

  const MIN_MS = 600;   // mínimo visible para que se aprecie la estrella

  // Ocultar cuando el DOM esté listo (respetando el tiempo mínimo)
  const revelar = () => setTimeout(ocultar, MIN_MS);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revelar);
  } else {
    revelar();
  }
  // Failsafe absoluto: nunca dejamos la pantalla bloqueada
  setTimeout(ocultar, 3500);

  // Mostrar el loader al navegar a otra página interna (cubre el salto)
  const armarLinks = () => {
    document.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;                       // ancla misma página
      if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return;     // externo / especial
      if (a.target === "_blank") return;                                 // nueva pestaña
      if (href.indexOf(".html") === -1 && href.charAt(href.length - 1) !== "/") return;
      a.addEventListener("click", (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // abrir en pestaña
        mostrar();
      });
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armarLinks);
  } else {
    armarLinks();
  }
})();

// Esperamos a que el DOM esté listo antes de tocar elementos.
document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1) SCROLL REVEAL con IntersectionObserver
     ----------------------------------------------------------
     ¿Qué es IntersectionObserver?
     Es una API nativa del navegador que "vigila" elementos y nos
     avisa cuando entran o salen del área visible (viewport), SIN
     escuchar el evento 'scroll' constantemente. Esto es mucho más
     eficiente (no bloquea el hilo principal) y por eso es la forma
     profesional de hacer animaciones de aparición.

     Flujo:
       - Seleccionamos todos los elementos con la clase .reveal
       - El observer detecta cuándo cada uno entra en pantalla
       - Al entrar, le añadimos la clase .is-visible
       - El CSS (.reveal -> .reveal.is-visible) hace la transición
         de opacidad + desplazamiento de abajo hacia arriba.
  ========================================================== */

  const elementosReveal = document.querySelectorAll(".reveal");

  // --- Opciones del observer ---
  const opcionesObserver = {
    root: null,           // null = usamos el viewport del navegador
    rootMargin: "0px",    // margen extra alrededor del viewport
    // threshold: qué porcentaje del elemento debe verse para activar.
    // 0.15 = se activa cuando el 15% del elemento es visible.
    // Súbelo (ej. 0.4) para que aparezca más tarde; bájalo para antes.
    threshold: 0.15,
  };

  // --- Función que se ejecuta cada vez que un elemento cruza el umbral ---
  const alIntersectar = (entradas, observador) => {
    entradas.forEach((entrada) => {
      // isIntersecting es true cuando el elemento entró en pantalla.
      if (entrada.isIntersecting) {

        // Soporte para retardo escalonado opcional:
        // si el elemento tiene data-delay="200", esperamos 200ms.
        // Útil en el Hero para que los textos aparezcan en cascada.
        const retardo = entrada.target.dataset.delay || 0;

        setTimeout(() => {
          entrada.target.classList.add("is-visible");
        }, retardo);

        // Dejamos de observar el elemento: la animación ocurre una
        // sola vez. Si quieres que se repita cada vez que entra/sale,
        // comenta la línea de abajo y añade un 'else' que quite la clase.
        observador.unobserve(entrada.target);
      }
    });
  };

  // --- Creamos el observer y lo aplicamos a cada elemento ---
  const observer = new IntersectionObserver(alIntersectar, opcionesObserver);
  elementosReveal.forEach((el) => observer.observe(el));

  /* NOTA sobre VELOCIDAD de la animación:
     La duración NO se controla aquí, se controla en el CSS con la
     variable --reveal-speed (en :root de style.css). Por defecto 0.9s.
     - Más lento / elegante:  --reveal-speed: 1.4s;
     - Más rápido / ágil:     --reveal-speed: 0.5s;
     La curva de suavizado está en --ease-soft (también en :root). */


  /* ==========================================================
     2) HEADER DINÁMICO
     ----------------------------------------------------------
     Cambiamos el fondo del header de transparente a 'Negro Lavado'
     sólido cuando el usuario hace scroll, para que el logo CJ siempre
     se lea bien sobre cualquier sección.

     Usamos un listener de 'scroll' optimizado con requestAnimationFrame
     para no recalcular en cada pixel y mantener 60fps.
  ========================================================== */

  const header = document.getElementById("header");

  // A partir de cuántos píxeles de scroll activamos el fondo sólido.
  // Súbelo si quieres que tarde más en oscurecerse.
  const UMBRAL_SCROLL = 60;

  let ticking = false; // evita ejecutar la lógica más de una vez por frame

  const actualizarHeader = () => {
    if (window.scrollY > UMBRAL_SCROLL) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      // requestAnimationFrame sincroniza el cambio con el repintado
      // del navegador → animación fluida sin saturar el hilo principal.
      window.requestAnimationFrame(actualizarHeader);
      ticking = true;
    }
  });

  // Ejecutamos una vez al cargar por si la página inicia ya scrolleada
  // (por ejemplo, al recargar a mitad de página o llegar con un #ancla).
  actualizarHeader();


  /* ==========================================================
     3) MENÚ HAMBURGUESA (móvil)
     ----------------------------------------------------------
     - El botón alterna la clase .is-open en sí mismo (barras → X)
       y en el overlay del menú (fade + deslizamiento suave).
     - Bloqueamos el scroll del fondo mientras el menú está abierto.
     - El menú se cierra al tocar un link o al presionar Escape.

     La VELOCIDAD y el efecto cascada de los links se controlan en el
     CSS (transition + transition-delay de .mobile-menu__links a).
  ========================================================== */

  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("mobileMenu");

  // Abre o cierra el menú según el estado recibido.
  const setMenu = (abierto) => {
    toggle.classList.toggle("is-open", abierto);
    menu.classList.toggle("is-open", abierto);
    // Accesibilidad: avisamos a lectores de pantalla.
    toggle.setAttribute("aria-expanded", abierto);
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    menu.setAttribute("aria-hidden", !abierto);
    // Evita que el contenido de atrás se desplace con el menú abierto.
    document.body.style.overflow = abierto ? "hidden" : "";
  };

  // Clic en la hamburguesa → invierte el estado actual.
  toggle.addEventListener("click", () => {
    const estaAbierto = menu.classList.contains("is-open");
    setMenu(!estaAbierto);
  });

  // Al tocar cualquier link del menú, lo cerramos.
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Tocar el fondo oscuro (fuera del panel) también cierra el menú.
  menu.addEventListener("click", (e) => {
    if (e.target === menu) setMenu(false);   // solo si se tocó el backdrop, no el panel
  });

  // Tecla Escape también cierra el menú.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });


  /* ==========================================================
     4) CONTACTO POR WHATSAPP
     ----------------------------------------------------------
     👉 CAMBIA AQUÍ TU NÚMERO (formato internacional, sin "+",
        sin espacios). Ejemplo México: 52 + 10 dígitos.
     El número se aplica automáticamente a TODOS los botones de
     WhatsApp de la página (footer, menú y botón flotante).
  ========================================================== */

  // El número viene de la config pública que inyecta el servidor
  // (window.SALMAS_CONFIG → ver server.js y .env). Si se abre el HTML
  // directo (sin servidor), usamos el valor de respaldo de abajo.
  const WHATSAPP_NUMERO =
    (window.SALMAS_CONFIG && window.SALMAS_CONFIG.whatsapp) || "521234567890";
  const WHATSAPP_MENSAJE = "Hola SALMAS 👋, me interesa una prenda de la colección.";

  // Lo aplicamos a cada elemento con la clase .js-wa.
  // Si el elemento trae un mensaje propio en data-msg (p. ej. una prenda
  // específica), usamos ese; si no, el mensaje general.
  document.querySelectorAll(".js-wa").forEach((el) => {
    const mensaje = el.dataset.msg || WHATSAPP_MENSAJE;
    el.setAttribute(
      "href",
      "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + encodeURIComponent(mensaje)
    );
  });


  /* ==========================================================
     5) MARQUEE EFFECTS — Stagger, Parallax, Hover Interactivity
     ----------------------------------------------------------
     - Asigna animation-delay escalonado a cada item del marquee
     - Implementa parallax en hover (imagen se mueve sola)
     - Cursor grab/grabbing para feedback interactivo
  ========================================================== */

  const marqueeItems = document.querySelectorAll(".marquee__item");

  // Solo activamos el tilt 3D en dispositivos con puntero fino (mouse) y sin
  // reduced-motion. En táctil sería ruido; respetamos la preferencia del SO.
  const puedeTilt =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (marqueeItems.length > 0) {
    marqueeItems.forEach((item, index) => {
      // Stagger: cada item entra con 60ms de diferencia (efecto cascada)
      item.style.animationDelay = `${index * 0.06}s`;

      if (!puedeTilt) return;

      const img = item.querySelector("img");
      // rAF para no saturar el hilo: agrupamos las lecturas/escrituras por frame
      let rafId = null;
      let pendiente = null;

      const aplicar = () => {
        rafId = null;
        if (!pendiente) return;
        const { px, py } = pendiente;

        // Tilt: el card gira siguiendo el cursor (rotateX vertical, rotateY horizontal)
        const rotateY = (px - 0.5) * 18;   // ±9° izquierda/derecha
        const rotateX = (0.5 - py) * 18;   // ±9° arriba/abajo
        // perspective() inline → cada card tiene su propio espacio 3D (robusto)
        item.style.transform =
          `perspective(900px) translateY(-12px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

        // Counter-parallax de la imagen: se mueve en sentido opuesto → profundidad
        if (img) {
          const moveX = (px - 0.5) * -26;
          const moveY = (py - 0.5) * -18;
          img.style.transform = `scale(1.14) translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
        }

        // Glare: el brillo radial sigue al cursor
        item.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
        item.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      };

      item.addEventListener("mousemove", (e) => {
        const rect = item.getBoundingClientRect();
        pendiente = {
          px: (e.clientX - rect.left) / rect.width,   // 0..1
          py: (e.clientY - rect.top) / rect.height,   // 0..1
        };
        if (rafId === null) rafId = requestAnimationFrame(aplicar);
      });

      // Reset suave al salir: limpiamos transforms inline → vuelve al reposo CSS
      item.addEventListener("mouseleave", () => {
        if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
        pendiente = null;
        item.style.transform = "";
        if (img) img.style.transform = "";
      });
    });
  }


  /* ==========================================================
     6) RATE LIMITING DE WHATSAPP (lado cliente)
     ----------------------------------------------------------
     Evita spam con validación mejorada. Si IndexedDB disponible,
     lo usa (más resistente). Si no, fallback a localStorage con
     validación adicional de integridad de datos.
  ========================================================== */

  const WA_MAX_CLICS = 5;
  const WA_VENTANA_MS = 60000;
  const WA_STORE = "salmas_wa_clics";
  let dbWA = null;

  // Inicializar IndexedDB (más seguro que localStorage)
  const inicializarDBWA = () => {
    return new Promise((resolve) => {
      if (typeof indexedDB === 'undefined') {
        resolve(false);
        return;
      }

      const request = indexedDB.open("SALMAS_WA", 1);

      request.onerror = () => resolve(false);
      request.onsuccess = () => {
        dbWA = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (e) => {
        try {
          e.target.result.createObjectStore("clics", { keyPath: "id", autoIncrement: true });
        } catch (_) {}
      };
    });
  };

  // Verificar permisos en IndexedDB
  const permitirEnvioWAIndexedDB = () => {
    return new Promise((resolve) => {
      if (!dbWA) {
        resolve(permitirEnvioWALocalStorage());
        return;
      }

      const ahora = Date.now();
      const transaction = dbWA.transaction(["clics"], "readwrite");
      const store = transaction.objectStore("clics");
      const request = store.getAll();

      request.onsuccess = () => {
        let marcas = (request.result || [])
          .filter(item => typeof item.ts === 'number' && ahora - item.ts < WA_VENTANA_MS)
          .map(item => item.ts)
          .sort((a, b) => a - b);

        if (marcas.length >= WA_MAX_CLICS) {
          const espera = Math.ceil((WA_VENTANA_MS - (ahora - marcas[0])) / 1000);
          resolve({ ok: false, espera });
          return;
        }

        store.add({ ts: ahora });
        // Limpiar registros viejos
        store.delete(IDBKeyRange.upperBound(ahora - WA_VENTANA_MS));
        resolve({ ok: true });
      };

      request.onerror = () => resolve(permitirEnvioWALocalStorage());
    });
  };

  // Fallback a localStorage con validación mejorada
  const permitirEnvioWALocalStorage = () => {
    const ahora = Date.now();
    let marcas = [];

    try {
      const stored = localStorage.getItem(WA_STORE);
      if (stored && typeof stored === 'string') {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          marcas = parsed
            .filter(t => typeof t === 'number' && ahora - t < WA_VENTANA_MS && t > 0)
            .sort((a, b) => a - b);
        }
      }
    } catch (_) {
      marcas = [];
    }

    if (marcas.length >= WA_MAX_CLICS) {
      const espera = Math.ceil((WA_VENTANA_MS - (ahora - marcas[0])) / 1000);
      return { ok: false, espera };
    }

    marcas.push(ahora);
    try {
      localStorage.setItem(WA_STORE, JSON.stringify(marcas.slice(-WA_MAX_CLICS)));
    } catch (_) {}

    return { ok: true };
  };

  const permitirEnvioWA = async () => {
    if (!dbWA) {
      const hasDB = await inicializarDBWA();
      if (!hasDB) return permitirEnvioWALocalStorage();
    }
    return permitirEnvioWAIndexedDB();
  };

  // Aviso flotante reutilizable (se crea una sola vez).
  let toastTimer;
  const mostrarToast = (texto) => {
    let toast = document.getElementById("toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = texto;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
  };

  // Delegación: cualquier clic en un botón .js-wa pasa por el control.
  document.addEventListener("click", async (e) => {
    const boton = e.target.closest(".js-wa");
    if (!boton) return;

    const r = await permitirEnvioWA();
    if (!r.ok) {
      e.preventDefault();
      mostrarToast(`Espera ${r.espera}s antes de enviar otro mensaje 🙏`);
    }
  });


  /* ==========================================================
     7) MODAL — ÚNETE AL DREAMER CLUB
     ----------------------------------------------------------
     Se abre una vez por sesión al entrar (tras el loader). Cierra
     con la X, el fondo, "No, gracias" o Escape. Al enviar un correo
     válido + consentimiento, cambia al estado de bienvenida.
  ========================================================== */
  const clubModal = document.getElementById("clubModal");
  if (clubModal) {
    const CLUB_KEY = "dreamer_club_modal";
    const emailInput = document.getElementById("clubEmail");

    const abrirClub = () => {
      clubModal.classList.add("is-open");
      clubModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (emailInput) setTimeout(() => emailInput.focus(), 320);
    };
    const cerrarClub = () => {
      clubModal.classList.remove("is-open");
      clubModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      try { sessionStorage.setItem(CLUB_KEY, "1"); } catch (_) {}
    };

    // Mostrar solo si no se vio en esta sesión
    let clubVisto = false;
    try { clubVisto = sessionStorage.getItem(CLUB_KEY) === "1"; } catch (_) {}
    if (!clubVisto) setTimeout(abrirClub, 1400);

    clubModal.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", cerrarClub)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && clubModal.classList.contains("is-open")) cerrarClub();
    });

    const clubForm = document.getElementById("clubForm");
    if (clubForm) {
      clubForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const consent = document.getElementById("clubConsent");
        const err = document.getElementById("clubError");
        const correo = ((emailInput && emailInput.value) || "").trim();
        const correoOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

        if (!correoOk) {
          err.textContent = "Escribe un correo válido.";
          err.hidden = false;
          if (emailInput) emailInput.focus();
          return;
        }
        if (!consent.checked) {
          err.textContent = "Necesitas aceptar la política de privacidad.";
          err.hidden = false;
          return;
        }
        err.hidden = true;

        // Éxito: cambiamos a la vista de bienvenida
        const join = document.getElementById("clubJoin");
        const success = document.getElementById("clubSuccess");
        if (join) join.hidden = true;
        if (success) success.hidden = false;
        try { sessionStorage.setItem(CLUB_KEY, "1"); } catch (_) {}
      });
    }
  }

});
