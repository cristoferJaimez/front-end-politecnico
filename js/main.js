// NovaNews - script principal
// Entrega 2: renderizado dinámico desde JSON + favoritos (localStorage) + validación de formulario

/* ---------------------------------------------------
   Utilidades de fecha (evita líos de zona horaria con Date())
--------------------------------------------------- */
var MESES_CORTOS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
var MESES_LARGOS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

function partesFecha(fechaISO) {
  var partes = (fechaISO || "").split("-");
  return { anio: partes[0], mes: parseInt(partes[1], 10) - 1, dia: parseInt(partes[2], 10) };
}
function formatFechaCorta(fechaISO) {
  var p = partesFecha(fechaISO);
  if (isNaN(p.dia) || !MESES_CORTOS[p.mes]) return fechaISO || "";
  return p.dia + " " + MESES_CORTOS[p.mes];
}
function formatFechaLarga(fechaISO) {
  var p = partesFecha(fechaISO);
  if (isNaN(p.dia) || !MESES_LARGOS[p.mes]) return fechaISO || "";
  return p.dia + " de " + MESES_LARGOS[p.mes] + " de " + p.anio;
}

/* ---------------------------------------------------
   Favoritos: módulo compartido (localStorage)
--------------------------------------------------- */
var NovaNewsFav = (function () {
  var STORAGE_KEY = "novanews_favoritos";

  function leer() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
      return [];
    }
  }

  function guardar(lista) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (err) {
      /* localStorage no disponible: se ignora silenciosamente */
    }
  }

  function esFavorito(id) {
    return leer().indexOf(id) !== -1;
  }

  function alternar(id) {
    var lista = leer();
    var idx = lista.indexOf(id);
    if (idx === -1) {
      lista.push(id);
    } else {
      lista.splice(idx, 1);
    }
    guardar(lista);
    return idx === -1; // true = quedó marcado como favorito
  }

  function listar() {
    return leer();
  }

  return { esFavorito: esFavorito, alternar: alternar, listar: listar };
})();

function actualizarBotonFav(btn, esFavorito) {
  btn.classList.toggle("is-fav", esFavorito);
  btn.setAttribute("aria-pressed", esFavorito ? "true" : "false");
  var label = btn.querySelector(".fav-label");
  if (label) {
    label.textContent = esFavorito ? "Quitar de favoritos" : "Agregar a favoritos";
  }
}

function initFavButtons(root) {
  var scope = root || document;
  scope.querySelectorAll(".js-fav").forEach(function (btn) {
    var id = btn.dataset.favId;
    if (!id || btn.dataset.favBound) return;
    btn.dataset.favBound = "1";
    actualizarBotonFav(btn, NovaNewsFav.esFavorito(id));
    btn.addEventListener("click", function () {
      var ahora = NovaNewsFav.alternar(id);
      actualizarBotonFav(btn, ahora);
      document.dispatchEvent(new CustomEvent("novanews:fav-changed", { detail: { id: id, favorito: ahora } }));
    });
  });
}

document.addEventListener("novanews:fav-changed", function () {
  if (document.getElementById("favoritos-lista")) renderFavoritosPage();
});

/* ---------------------------------------------------
   Tarjeta de noticia: HTML reutilizable
--------------------------------------------------- */
function hrefDetalle(id) {
  return NOVANEWS_BASE + "pages/detalle.html?id=" + encodeURIComponent(id);
}

function tarjetaHTML(n) {
  return (
    '<div class="ph-img"><svg class="icon"><use href="#i-image"></use></svg>' + n.categoria + "</div>" +
    '<button class="icon-btn card-fav-btn js-fav" data-fav-id="' + n.id + '" aria-label="Agregar a favoritos">' +
    '<svg class="icon"><use href="#i-heart"></use></svg></button>' +
    '<div class="card-body">' +
    '<span class="badge"><svg class="icon icon-sm"><use href="#i-tag"></use></svg>' + n.categoria + "</span>" +
    "<h3>" + n.titulo + "</h3>" +
    "<p>" + n.resumen + "</p>" +
    '<div class="card-foot">' +
    '<span class="meta-row"><svg class="icon icon-sm"><use href="#i-calendar"></use></svg>' + formatFechaCorta(n.fecha) + "</span>" +
    '<a href="' + hrefDetalle(n.id) + '" class="btn ghost">Ver más <svg class="icon icon-sm"><use href="#i-arrow-right"></use></svg></a>' +
    "</div></div>"
  );
}

function pintarTarjetas(cont, lista) {
  cont.innerHTML = "";
  lista.forEach(function (n) {
    var art = document.createElement("article");
    art.className = "card";
    art.innerHTML = tarjetaHTML(n);
    cont.appendChild(art);
  });
  initFavButtons(cont);
}

/* ---------------------------------------------------
   Home: noticias destacadas
--------------------------------------------------- */
function renderDestacadas(datos) {
  var cont = document.getElementById("destacadas-lista");
  if (!cont) return;
  pintarTarjetas(cont, datos.slice(0, 4));
}

/* ---------------------------------------------------
   Listado: todas las noticias + filtros en vivo
--------------------------------------------------- */
function renderListado(datosCompletos) {
  var cont = document.getElementById("listado-lista");
  if (!cont) return;

  var inputBuscar = document.getElementById("buscar-input");
  var selectCategoria = document.getElementById("categoria-select");
  var vacio = document.getElementById("listado-vacio");

  function aplicarFiltros() {
    var texto = (inputBuscar && inputBuscar.value || "").trim().toLowerCase();
    var categoria = (selectCategoria && selectCategoria.value) || "todas";

    var filtradas = datosCompletos.filter(function (n) {
      var coincideTexto = !texto ||
        n.titulo.toLowerCase().indexOf(texto) !== -1 ||
        n.resumen.toLowerCase().indexOf(texto) !== -1;
      var coincideCategoria = categoria === "todas" || n.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });

    pintarTarjetas(cont, filtradas);
    if (vacio) vacio.hidden = filtradas.length !== 0;
  }

  if (inputBuscar) inputBuscar.addEventListener("input", aplicarFiltros);
  if (selectCategoria) selectCategoria.addEventListener("change", aplicarFiltros);

  aplicarFiltros();
}

/* ---------------------------------------------------
   Detalle: contenido completo de una noticia (?id=...)
--------------------------------------------------- */
function renderDetalle(datos) {
  var cont = document.getElementById("detalle-cuerpo");
  if (!cont) return;

  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  var noticia = datos.filter(function (n) { return n.id === id; })[0] || datos[0];

  var elCategoriaBreadcrumb = document.getElementById("detalle-breadcrumb-cat");
  var elCategoriaBadge = document.getElementById("detalle-categoria");
  var elTitulo = document.getElementById("detalle-titulo");
  var elFecha = document.getElementById("detalle-fecha");
  var elAutor = document.getElementById("detalle-autor");
  var elFav = document.getElementById("btn-fav-detalle");
  var elRelacionadas = document.getElementById("detalle-relacionadas");

  if (elCategoriaBreadcrumb) elCategoriaBreadcrumb.textContent = noticia.categoria;
  if (elCategoriaBadge) elCategoriaBadge.textContent = noticia.categoria;
  if (elTitulo) elTitulo.textContent = noticia.titulo;
  if (elFecha) elFecha.textContent = formatFechaLarga(noticia.fecha);
  if (elAutor) elAutor.textContent = noticia.autor || "Redacción NovaNews";
  if (elFav) {
    elFav.dataset.favId = noticia.id;
    var span = elFav.querySelector(".fav-label");
    if (span) span.textContent = "Agregar a favoritos";
  }

  cont.innerHTML = "";
  (noticia.cuerpo || [noticia.resumen]).forEach(function (parrafo) {
    var p = document.createElement("p");
    p.textContent = parrafo;
    cont.appendChild(p);
  });

  if (elRelacionadas) {
    elRelacionadas.innerHTML = "";
    datos
      .filter(function (n) { return n.id !== noticia.id; })
      .slice(0, 3)
      .forEach(function (n) {
        var div = document.createElement("div");
        div.className = "mini-item";
        div.innerHTML =
          '<div class="ph-img"><svg class="icon"><use href="#i-image"></use></svg></div>' +
          '<a href="' + hrefDetalle(n.id) + '"><span>' + n.titulo + "</span></a>";
        elRelacionadas.appendChild(div);
      });
  }
}

/* ---------------------------------------------------
   Página de Favoritos: render dinámico
--------------------------------------------------- */
function renderFavoritosPage() {
  var cont = document.getElementById("favoritos-lista");
  if (!cont) return;

  var vacio = document.getElementById("favoritos-vacio");
  var ids = NovaNewsFav.listar();
  var datos = (window.NOVANEWS_DATA || []).filter(function (n) {
    return ids.indexOf(n.id) !== -1;
  });

  if (!datos.length) {
    cont.innerHTML = "";
    if (vacio) vacio.hidden = false;
    return;
  }
  if (vacio) vacio.hidden = true;
  pintarTarjetas(cont, datos);
}

/* ---------------------------------------------------
   Formulario de contacto: validaciones básicas
--------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById("form-contacto");
  if (!form) return;

  var alertOk = document.getElementById("alert-ok");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var esValido = true;

    esValido = validarRequerido("nombre") && esValido;
    esValido = validarCorreo("correo") && esValido;
    esValido = validarRequerido("mensaje") && esValido;

    if (esValido) {
      alertOk.hidden = false;
      form.reset();
      limpiarErrores();
    } else {
      alertOk.hidden = true;
    }
  });

  function grupoDe(id) {
    var input = document.getElementById(id);
    return input ? input.closest(".form-group") : null;
  }

  function mostrarError(id, mostrar) {
    var grupo = grupoDe(id);
    if (!grupo) return;
    var msg = grupo.querySelector(".error-msg");
    grupo.classList.toggle("error", mostrar);
    if (msg) msg.hidden = !mostrar;
  }

  function validarRequerido(id) {
    var input = document.getElementById(id);
    var vacio = !input.value.trim();
    mostrarError(id, vacio);
    return !vacio;
  }

  function validarCorreo(id) {
    var input = document.getElementById(id);
    var valor = input.value.trim();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var invalido = !regex.test(valor);
    mostrarError(id, invalido);
    return !invalido;
  }

  function limpiarErrores() {
    form.querySelectorAll(".form-group.error").forEach(function (g) {
      g.classList.remove("error");
    });
    form.querySelectorAll(".error-msg").forEach(function (m) {
      m.hidden = true;
    });
  }
}

/* ---------------------------------------------------
   Arranque: carga el JSON y luego renderiza cada página
--------------------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  initContactForm();

  NovaNewsData.cargar(function (datos) {
    renderDestacadas(datos);
    renderListado(datos);
    renderDetalle(datos);
    renderFavoritosPage();
    initFavButtons(document);
  });
});
