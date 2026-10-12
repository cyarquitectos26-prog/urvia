# ORBE — red social inmobiliaria para Perú

Web publicada: [ORBE](https://cyarquitectos26-prog.github.io/) · [Mapa](https://cyarquitectos26-prog.github.io/map/).

Primera versión navegable de un marketplace de descubrimiento inmobiliario. El feed, los perfiles de agentes y City conectan propiedades con contenido social y pantallas digitales identificadas como patrocinadas cuando corresponde.

## Actualización visual ORBE

La renovación aplica la identidad aprobada de ORBE y la composición de Axle: tres paneles laterales, navegación en píldoras, un fondo urbano de Lima y superficies de vidrio. El feed previo continúa debajo de la nueva vista inicial. Las rutas, formularios, controles de City, datos y persistencia existentes se conservan. Para ti enlaza a la sección de videos en `/videos`.

El logo se trazó desde la imagen suministrada, sin cambiar su geometría. `public/brand/` contiene el original y las variantes SVG principal, horizontal, clara, oscura, monocroma e icono. Colores: azul petróleo `#193247`, champán `#C5A477`/`#D3A676`, marfil `#F7F5F2` y grafito `#101318`. Motion anima la entrada y el menú; se respeta la preferencia de movimiento reducido. El inicio usa video real de Lima; ORBE City conserva su escena 3D interactiva.

### Video del inicio

`public/videos/orbe-lima-background.mp4` reemplaza la imagen generada en el inicio. Contiene **cinco clips distintos** extraídos del archivo suministrado `YTDown.com_YouTube_Media_5Yd-y6FVkMg_Lima-Peru-in-4K-Incredible-Scenes-Hidden-Gems_001_1080p.mp4`:

| Escena | Tramo del original |
| --- | --- |
| Ciudad al atardecer | 00:10,8–00:16,0 |
| Miraflores de noche | 00:21,6–00:26,8 |
| Centro histórico | 01:09,6–01:14,8 |
| Edificios junto al malecón | 02:08,0–02:13,2 |
| Costa y panorama urbano | 05:29,8–05:35,0 |

Cada toma dura 5,2 segundos antes de los solapamientos. Disolvencias de **0,8 segundos** unen todas las escenas y el cierre con el inicio del loop. Resultado: **22 segundos, 1920 × 1080, 25 fps, H.264, sin audio, 8,20 MB** (8.204.396 bytes). Se conserva la resolución original; la compresión usa CRF 25, límite de bitrate de 3 Mbps y MP4 con faststart. El montaje se entrega en un solo archivo para reproducir las transiciones con un único decodificador.

El fotograma `public/images/orbe-lima-poster.webp` se muestra antes de la reproducción. Hay control de pausa/reproducción, una capa de contraste para los textos y pausa automática al salir del inicio de la pantalla o cambiar de pestaña. Con movimiento reducido, el fondo permanece fijo hasta que el usuario pulsa reproducir. No se carga el video completo original de 208 MB.

El almacenamiento mantiene la clave heredada `urba-demo-v1` para conservar todas las publicaciones, colecciones y acciones previas en este navegador.

## Ejecutar

Requiere **Node.js 20.9 o superior** (recomendado 24).

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Para validar: `npm run typecheck`, `npm run lint`, `npm run build`.

## Rutas

| Ruta | Función |
| --- | --- |
| `/` | Landing y feed social |
| `/explore`, `/map`, `/videos`, `/city` | Descubrimiento |
| `/property/[slug]`, `/district/[slug]` | Detalles públicos |
| `/agents`, `/agent/[username]` | Agentes y seguimiento |
| `/collections`, `/messages` | Guardados y conversaciones |
| `/publish` | Publicación paso a paso |
| `/dashboard`, `/dashboard/promote`, `/dashboard/promote/create` | Panel y campañas |
| `/auth/login`, `/auth/register`, `/auth/forgot-password` | Acceso demo |
| `/onboarding` | Preferencias para personalizar compatibilidad |

## Exportar para GitHub Pages

`npm run build:pages` genera la web estática en `out/`, con 65 páginas, imágenes sin un servidor de optimización, enlaces a directorios y `.nojekyll`. La exportación está preparada para el dominio raíz `https://cyarquitectos26-prog.github.io/`; `ORBE_PAGES_URL` permite ajustar los metadatos a otro dominio raíz. `npm run dev` conserva el modo de desarrollo habitual.

Para publicar, subir el contenido de `out/` al repositorio de la web y seleccionar su rama `main`, carpeta raíz, como fuente de GitHub Pages. El repositorio del código fuente y el de archivos compilados pueden mantenerse separados. No se exportan los datos almacenados en el navegador local.

Las propiedades precargadas mantienen sus rutas. En la versión estática, las publicaciones creadas después del despliegue abren `/property/published/?slug=…`, una página que lee el estado local del navegador. Así se pueden abrir y recargar fichas nuevas sin necesitar un servidor. Los guardados, mensajes, visitas, campañas y publicaciones continúan siendo funciones demo almacenadas por navegador; no son un backend compartido.

## Arquitectura

- `app/`: rutas App Router, metadata y estilos.
- `components/`: shell, tarjetas, billboards, mapa, agenda, formularios y estado de la demo.
- `components/city3d/`: escena React Three Fiber aislada, controles, pantallas interactivas, clips silenciosos y alternativa editorial 2D.
- `lib/city/`: inventario espacial de Central Avenue (21 pantallas), selección de contenido y medición local de viewability.
- `components/ui/`: primitivos compatibles con la convención de shadcn/ui; Tailwind v3 está configurado junto con tokens CSS propios.
- `types/`: modelos de dominio sin `any`.
- `lib/data/mock.ts`: 30 propiedades coherentes de Lima y contenido relacionado.
- `lib/domain.ts`: búsqueda, compatibilidad, precios y score de promociones, deterministas.
- `lib/providers/`: interfaces y mocks para búsqueda IA, mapa, auth, promociones, visitas, almacenamiento y pagos.
- `supabase/migrations/`: esquema PostgreSQL con RLS preparado para integración.
- `public/images/`: fotografía original generada para la propiedad principal y fotos de desarrollo.

El estado de guardados, colecciones, seguimiento, mensajes, visitas, propiedades creadas y campañas se conserva en `localStorage`. Todo ocurre en el navegador; no hay pagos ni mensajes externos. La ruta de Videos y los mapas compactos son experiencias visuales mock. `/map` usa un mapa geográfico interactivo real con inventario demo. La estimación de precio es referencial y se basa solo en los datos demo.

## Búsqueda por mapa

`/map` integra Leaflet 1.9.4 y calles de OpenStreetMap, con atribución visible. El mapa se carga en un componente separado solo en el navegador. Muestra todas las propiedades que cumplen los filtros, incluidas las publicaciones locales; agrupa los marcadores cercanos y permite ampliar, mover, localizar desde la lista, abrir una vista previa y acceder al detalle.

El mapa adopta la referencia visual oscura: fondo azul petróleo, calles y textos en tonos gris azulados, pines circulares champán con un halo suave y controles discretos en la esquina inferior derecha. Los precios permanecen debajo de cada pin. Las etiquetas de distrito usan sus coordenadas existentes, evitan solaparse y se ocultan al acercarse al nivel de calles. El tratamiento de color se aplica en CSS a las teselas existentes de OpenStreetMap; no requiere otro proveedor ni una nueva clave.

La búsqueda combina texto libre, distrito, operación, tipo, moneda, presupuesto y características reconocidas. Acepta nombres de distritos con o sin tildes. **Buscar en esta zona** limita el inventario al área visible; limpiar o cambiar filtros restaura el encuadre del resultado. Un resultado vacío mantiene cero propiedades y cero pines, sin volver a mostrar el inventario completo.

Las coordenadas son referenciales y no corresponden a domicilios reales. Las nuevas publicaciones demo toman el centro del distrito seleccionado; las publicaciones anteriores con la coordenada fija heredada se ubican por distrito al leerlas, sin modificar su almacenamiento. Las agrupaciones incluyen todas las propiedades del resultado y se abren al ampliar. A máximo zoom, las propiedades que comparten ubicación se pueden elegir en una lista.

Las calles requieren conexión. Si el proveedor no responde, la lista, los filtros y los marcadores siguen disponibles con un aviso. `NEXT_PUBLIC_MAP_TILE_URL` y `NEXT_PUBLIC_MAP_ATTRIBUTION` permiten configurar otro proveedor. Para tráfico comercial sostenido, usar un proveedor con capacidad y condiciones adecuadas. Referencias: [Leaflet](https://leafletjs.com/) y [política de teselas de OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

## City 3D

`/city` muestra una avenida nocturna ficticia con 14 edificios y 21 pantallas. Usa las mismas propiedades, agentes, preferencias, guardados y campañas que el resto de la app. El anunciante puede seleccionar una de cinco pantallas premium en `/dashboard/promote/create`; la promoción creada aparece en su ubicación dentro de City. Un enlace como `/city?billboard=A12` enfoca una pantalla. Las impresiones locales exigen visibilidad en cámara, distancia y 1,2 segundos de exposición. El dashboard muestra esas métricas de sesión separadas de las cifras demo precargadas.

Controles: `W`/`↑` avanzar; `S`/`↓` retroceder; `A`/`←` y `D`/`→` desplazarse lateralmente; arrastrar para mirar; scroll para avanzar; botones táctiles en móvil. Hay recorrido automático, búsqueda/teletransporte, minimapa opcional, calidades Auto/Baja/Media/Alta y vista 2D manual o automática cuando no hay WebGL o baja el rendimiento. El sonido ambiental solo empieza si el usuario lo activa. Dos pantallas reproducen clips de seis segundos, creados desde fotos de las propiedades, en loop y sin audio. No son tours reales.

El modelo espacial contiene zona, edificio, fachada, identificador, formato, visibilidad estimada, orientación, posición y rotación. La segunda migración extiende `billboard_placements`, vincula promociones a pantallas y prepara eventos de servidor con RLS. No se ha ejecutado contra una base de datos. `CityZone`, `CitySeason`, `CityTakeover` y el catálogo de productos publicitarios preparan futuras zonas, semanas temáticas y patrocinios. Solo Central Avenue está construida. Cinco espacios reservados para campañas dejan al menos 16 pantallas orgánicas.

## Revisión de acabado visual

Se revisaron las 19 páginas de la demo en escritorio y móvil, con comprobaciones adicionales a 885 y 320 píxeles. Los paneles del feed tienen márgenes interiores y títulos contenidos; las tarjetas distribuyen precio, agente y botones según su ancho. Los formularios de acceso mantienen espacio interior, la vista previa de publicación usa una columna en móvil y City separa el logo del buscador. Las páginas, el estado local y el fondo de cinco clips se conservan.

El informe y las capturas de esta revisión están en `outputs/orbe-layout-audit/`. `design-qa.md` resume cobertura, comprobaciones y límites.

## Variables de entorno

Copiar `.env.example` a `.env.local` si se va a conectar servicios. `NEXT_PUBLIC_APP_NAME` permite cambiar la marca. `NEXT_PUBLIC_SITE_URL` sirve para OpenGraph. `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_MAPBOX_TOKEN` están reservadas para integraciones futuras; la aplicación no las necesita para ejecutar la demo. No incluir claves privadas en variables `NEXT_PUBLIC_`.

## Próximos pasos

1. Conectar Supabase Auth, Storage y tablas usando los proveedores existentes; probar RLS con varios roles.
2. Conectar coordenadas verificadas y un proveedor de mapas para producción, sustituir los clips promocionales por tours reales y registrar las métricas en el servidor.
3. Implementar backend de mensajería, visitas, moderación y métricas de campañas.
4. Conectar las preferencias de onboarding a recomendaciones de servidor, búsqueda IA real, colaboración en colecciones y checkout de promociones.
