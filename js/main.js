// NovaNews - script principal
// Entrega 1: maquetación interactiva (validación de formulario + favoritos con localStorage)

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

  cont.innerHTML = "";

  if (!datos.length) {
    if (vacio) vacio.hidden = false;
    return;
  }
  if (vacio) vacio.hidden = true;

  datos.forEach(function (n) {
    var art = document.createElement("article");
    art.className = "card";
    art.innerHTML =
      '<div class="ph-img"><svg class="icon"><use href="#i-image"></use></svg>' + n.categoria + "</div>" +
      '<button class="icon-btn card-fav-btn js-fav" data-fav-id="' + n.id + '" aria-label="Quitar de favoritos">' +
      '<svg class="icon"><use href="#i-heart"></use></svg></button>' +
      '<div class="card-body">' +
      '<span class="badge"><svg class="icon icon-sm"><use href="#i-tag"></use></svg>' + n.categoria + "</span>" +
      "<h3>" + n.titulo + "</h3>" +
      "<p>" + n.resumen + "</p>" +
      '<div class="card-foot">' +
      '<span class="meta-row"><svg class="icon icon-sm"><use href="#i-calendar"></use></svg>' + n.fecha + "</span>" +
      '<a href="detalle.html" class="btn ghost">Ver más <svg class="icon icon-sm"><use href="#i-arrow-right"></use></svg></a>' +
      "</div></div>";
    cont.appendChild(art);
  });

  initFavButtons(cont);
}

document.addEventListener("novanews:fav-changed", function () {
  if (document.getElementById("favoritos-lista")) renderFavoritosPage();
});

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

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initFavButtons(document);
  renderFavoritosPage();
});
