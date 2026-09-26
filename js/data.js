// NovaNews - carga de datos de noticias desde JSON (con respaldo local)
// Ruta relativa según si la página está en la raíz o dentro de /pages/
var NOVANEWS_BASE = location.pathname.indexOf("/pages/") !== -1 ? "../" : "";

// Copia de respaldo: se usa solo si el fetch al JSON falla (por ejemplo, al abrir
// el sitio con doble clic en Chrome, que bloquea fetch() a archivos locales por CORS).
var NOVANEWS_FALLBACK = [
  {
    "id": "messi-despedida-seleccion",
    "categoria": "Deportes",
    "titulo": "Lionel Messi jugará su partido de despedida con la Selección Argentina el 6 de octubre",
    "resumen": "El astro rosarino cerrará su etapa con la Albiceleste ante Benín en el Estadio Monumental, en un homenaje que promete agotar localidades.",
    "fecha": "2026-09-26",
    "autor": "Redacción NovaNews · Deportes",
    "cuerpo": [
      "Lionel Messi disputará su último partido con la Selección Argentina el próximo 6 de octubre, en un encuentro de despedida que se jugará en el Estadio Monumental de Buenos Aires frente a la selección de Benín.",
      "La noticia se conoce después de que el propio Messi anunciara su retiro de la Albiceleste el 1 de septiembre, a través de una carta pública en sus redes sociales, tras la dolorosa derrota en la final del Mundial 2026 frente a España y el fallecimiento de su padre, Jorge Messi, en agosto.",
      "El presidente de la AFA prometió que Messi tendrá \"la despedida que se merece\", y se espera que el Monumental agote localidades para rendir homenaje a uno de los futbolistas más importantes de la historia de este deporte."
    ]
  },
  {
    "id": "ram-graficas-precio",
    "categoria": "Tecnología",
    "titulo": "La crisis mundial de la memoria RAM empieza a golpear el precio de las tarjetas gráficas",
    "resumen": "Analistas advierten alzas de hasta el 50% en la memoria DRAM durante el segundo semestre de 2026, y Nvidia y AMD ya preparan incrementos en sus próximas tarjetas gráficas.",
    "fecha": "2026-09-24",
    "autor": "Redacción NovaNews · Tecnología",
    "cuerpo": [
      "La industria de los computadores atraviesa una de sus crisis de suministro más fuertes de los últimos años: el precio de la memoria RAM podría subir entre un 40% y un 50% en el tercer trimestre de 2026, con un incremento adicional de entre 30% y 40% previsto para el cierre del año.",
      "La causa principal es el auge de la inteligencia artificial generativa: los grandes proveedores de nube están reservando contratos a largo plazo por más de la mitad de la producción mundial de memoria DRAM para sus centros de datos.",
      "Fabricantes como Nvidia y AMD ya advirtieron que sus próximas tarjetas gráficas reflejarán ese sobrecosto. Los analistas no esperan una normalización de precios antes de 2028."
    ]
  },
  {
    "id": "messi-gol-101",
    "categoria": "Deportes",
    "titulo": "Messi anota un golazo de tiro libre y llega a 101 goles con el Inter Miami",
    "resumen": "El astro argentino marcó de tiro libre en el empate 2-2 ante San Diego FC por la MLS, en un partido que también tuvo gol de Luis Suárez.",
    "fecha": "2026-09-21",
    "autor": "Redacción NovaNews · Deportes",
    "cuerpo": [
      "Lionel Messi volvió a hacer historia con el Inter Miami: en el empate 2-2 frente a San Diego FC, disputado en el Nu Stadium por la jornada 27 de la MLS 2026, el capitán argentino convirtió un golazo de tiro libre y llegó a su gol número 101 con las Garzas.",
      "El encuentro tuvo además el aporte de Luis Suárez, que también marcó para el conjunto de Miami, mientras que Anders Dreyer firmó un doblete para San Diego FC.",
      "Con este tanto, Messi continúa acortando distancias en la histórica carrera goleadora frente a Cristiano Ronaldo."
    ]
  },
  {
    "id": "ia-diagnosticos",
    "categoria": "Tecnología",
    "titulo": "Hospitales de la región inician pilotos de inteligencia artificial para apoyo diagnóstico",
    "resumen": "Clínicas y hospitales universitarios comienzan a probar modelos de IA como segunda opinión en la lectura de radiografías y otros exámenes.",
    "fecha": "2026-09-18",
    "autor": "Redacción NovaNews · Tecnología",
    "cuerpo": [
      "Varias instituciones de salud de la región iniciaron programas piloto para incorporar modelos de inteligencia artificial como apoyo en la lectura de imágenes diagnósticas.",
      "La herramienta funciona como una segunda lectura automática que resalta posibles hallazgos para que el especialista los confirme.",
      "El reto no es solo técnico sino regulatorio: definir la responsabilidad médica y proteger los datos de los pacientes."
    ]
  },
  {
    "id": "ia-datacenters-energia",
    "categoria": "Tecnología",
    "titulo": "El auge de la inteligencia artificial dispara la demanda de energía de los centros de datos",
    "resumen": "El crecimiento acelerado de la IA generativa obliga a las grandes tecnológicas a asegurar nuevas fuentes de energía para sus centros de datos.",
    "fecha": "2026-09-15",
    "autor": "Redacción NovaNews · Tecnología",
    "cuerpo": [
      "El entrenamiento de modelos de IA generativa requiere cada vez más energía, lo que ha llevado a varias tecnológicas a asegurar el suministro eléctrico de sus centros de datos.",
      "Este crecimiento también explica parte de la actual escasez de memoria y otros componentes.",
      "La infraestructura energética se está convirtiendo en un factor tan determinante para la IA como el desarrollo de los propios modelos."
    ]
  },
  {
    "id": "modelos-hibridos",
    "categoria": "Educación",
    "titulo": "Universidades adoptan modelos híbridos de enseñanza",
    "resumen": "Estudiantes destacan la flexibilidad del nuevo modelo combinado presencial y virtual implementado este semestre.",
    "fecha": "2026-09-12",
    "autor": "Redacción NovaNews · Educación",
    "cuerpo": [
      "Varias universidades reportan buenos resultados tras adoptar esquemas híbridos que combinan sesiones presenciales y encuentros virtuales.",
      "Los estudiantes valoran la flexibilidad de horarios y la posibilidad de repasar contenido grabado antes de las evaluaciones.",
      "Los docentes señalan que el reto principal es mantener el mismo nivel de participación que en un salón tradicional."
    ]
  },
  {
    "id": "becas-intercambio",
    "categoria": "Educación",
    "titulo": "Becas de intercambio abren convocatoria 2026-2",
    "resumen": "Estudiantes de pregrado podrán postularse hasta finales de mes para cursar un semestre en universidades aliadas en el exterior.",
    "fecha": "2026-09-10",
    "autor": "Redacción NovaNews · Educación",
    "cuerpo": [
      "La nueva convocatoria de becas de intercambio 2026-2 ya está abierta para estudiantes de pregrado que cumplan los requisitos académicos y de idioma.",
      "El proceso incluye postulación en línea, entrevista con el comité de relaciones internacionales y selección de universidad destino.",
      "Quienes resulten seleccionados podrán cursar un semestre en el exterior con reconocimiento de créditos."
    ]
  },
  {
    "id": "destinos-colombia",
    "categoria": "Turismo",
    "titulo": "Cinco destinos colombianos para visitar este semestre",
    "resumen": "Una guía rápida con los lugares favoritos de los viajeros según encuestas recientes de plataformas de turismo.",
    "fecha": "2026-09-08",
    "autor": "Redacción NovaNews · Turismo",
    "cuerpo": [
      "Las plataformas de turismo reportan un aumento en las búsquedas de destinos nacionales, con tendencia hacia planes de naturaleza y desconexión.",
      "Entre los más buscados están las zonas cafeteras, el Caribe insular, la región andina y rutas de senderismo cerca de los centros urbanos.",
      "Los operadores turísticos recomiendan reservar con antelación por el aumento en la ocupación hotelera."
    ]
  },
  {
    "id": "comercio-electronico",
    "categoria": "Comercio",
    "titulo": "Comercio electrónico crece un 18% en el último trimestre",
    "resumen": "Las plataformas locales reportan un aumento sostenido en ventas móviles, impulsado por medios de pago digitales.",
    "fecha": "2026-09-05",
    "autor": "Redacción NovaNews · Comercio",
    "cuerpo": [
      "El comercio electrónico local mantiene un ritmo de crecimiento sostenido, con un aumento del 18% en ventas durante el último trimestre.",
      "Las compras desde dispositivos móviles ya representan la mayoría de las transacciones, favorecidas por billeteras digitales y pagos con código QR.",
      "Las categorías de moda, tecnología y hogar concentran la mayor parte del crecimiento."
    ]
  }
];

var NovaNewsData = (function () {
  function cargar(callback) {
    fetch(NOVANEWS_BASE + "data/noticias.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (datos) {
        window.NOVANEWS_DATA = datos;
        callback(datos);
      })
      .catch(function (err) {
        console.warn("No se pudo cargar data/noticias.json (posible bloqueo CORS al abrir con file://). Se usan datos de respaldo.", err);
        window.NOVANEWS_DATA = NOVANEWS_FALLBACK;
        callback(NOVANEWS_FALLBACK);
      });
  }
  return { cargar: cargar };
})();
