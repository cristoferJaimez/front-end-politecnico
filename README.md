# NovaNews

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

Prototipo funcional de un portal de noticias, desarrollado como proyecto del módulo **Front End** (Primer Bloque-Virtual – Front End B02) de la **Institución Universitaria Politécnico Grancolombiano**.

Sitio construido con **HTML, CSS y JavaScript puro** (sin frameworks ni librerías externas), con renderizado dinámico de contenido desde JSON, sistema de favoritos persistente y validación de formularios.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/cristoferJaimez/front-end-politecnico.git
cd front-end-politecnico
```

### 2. Levantar un servidor local

Por restricciones del navegador con `fetch()` bajo el protocolo `file://`, se recomienda servir el sitio con un servidor local en lugar de abrir los archivos `.html` directamente con doble clic.

Con Python instalado:

```bash
python -m http.server 5500
```

O con la extensión **Live Server** de VS Code (clic derecho sobre `index.html` → *Open with Live Server*).

### 3. Abrir en el navegador

```
http://localhost:5500
```

> Si abres los archivos directamente con doble clic, el sitio también funciona gracias a un contenido de respaldo embebido en JavaScript, pero **los favoritos no se comparten correctamente entre páginas bajo `file://`**. Usar el servidor local evita ese problema y es además el mismo comportamiento que tendrá el sitio una vez publicado (por ejemplo, en GitHub Pages).

## Funcionalidades

- **Inicio**: noticias destacadas cargadas dinámicamente desde `data/noticias.json`.
- **Listado de noticias**: buscador en vivo por texto y filtro por categoría.
- **Detalle de noticia**: página dinámica por `id` (`detalle.html?id=...`), con noticias relacionadas.
- **Favoritos**: marcar/desmarcar noticias como favoritas, persistidas en `localStorage` y visibles en una página dedicada.
- **Contacto**: formulario con validación de campos (nombre, correo con formato válido, mensaje) y mensajes de error/éxito.
- Diseño responsivo, estilo minimalista tipo SaaS (paleta índigo, botones tipo pill, navegación con iconos).

## Capturas de pantalla

**Inicio**
![Inicio](capturas/01_inicio.png)

**Listado de noticias**
![Listado](capturas/02_listado.png)

**Listado filtrado por categoría**
![Listado filtrado](capturas/03_listado_filtrado.png)

**Detalle de noticia**
![Detalle](capturas/04_detalle.png)

**Favoritos**
![Favoritos](capturas/05_favoritos.png)

**Contacto con validación**
![Contacto](capturas/06_contacto.png)

## Estructura del proyecto

```
NovaNews/
├── index.html                # Página de inicio
├── css/
│   └── styles.css            # Estilos globales del sitio
├── js/
│   ├── data.js                # Carga de datos (fetch + fallback embebido)
│   └── main.js                 # Lógica de renderizado, favoritos, filtros y validación
├── data/
│   └── noticias.json          # Fuente de datos de las noticias
├── capturas/                  # Screenshots del prototipo funcionando
└── pages/
    ├── listado.html            # Listado con buscador y filtro por categoría
    ├── detalle.html             # Detalle dinámico de una noticia
    ├── favoritos.html            # Noticias marcadas como favoritas
    └── contacto.html              # Formulario de contacto con validación
```

## Tecnologías

- HTML5 semántico
- CSS3 (variables, Flexbox, Grid)
- JavaScript (ES6+), sin frameworks
- `localStorage` para persistencia de favoritos
- Iconos SVG inline

## Equipo — Conjunto 15

- Cristofer Ramón Jaimez López
- Miguel Angel Agudelo Ospina
- Brayan Briceño Rojas

**Curso:** Primer Bloque-Virtual – Front End B02
**Docente:** John Olarte Ramos
**Institución:** Institución Universitaria Politécnico Grancolombiano

## Repositorio

[https://github.com/cristoferJaimez/front-end-politecnico.git](https://github.com/cristoferJaimez/front-end-politecnico.git)
