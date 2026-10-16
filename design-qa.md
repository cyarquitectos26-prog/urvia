# ORBE — revisión del cambio visual

final result: passed

## Buscador del inicio al desplazarse

- La misma barra de búsqueda permanece anclada al recorrer todo el inicio, fuera del recorte del video. Se usa CSS sticky sin eventos de scroll ni copias del buscador.
- Comprobado en 1280 × 720, 820 × 900 y 390 × 844: margen superior de 16 px en escritorio y 12 px en tableta/móvil al bajar; sin desbordamiento horizontal. El diálogo queda centrado dentro de la ventana incluso con el video fuera de vista.
- Desde la barra anclada, buscar «Casa en La Molina por menos de US$400,000» abre Explorar con la consulta conservada y una propiedad coincidente. La barra del inicio desaparece al entrar en otra página. Consola sin errores ni advertencias.
- Exportación estática de 65 páginas y TypeScript correctos. ESLint del componente sin errores; conserva la advertencia existente sobre la imagen de la propiedad destacada. Capturas locales en la carpeta temporal `orbe-sticky-search-qa`.

## Alcance

Renovación de identidad, colores, composición, tipografía y superficies sobre la app existente, conforme a la aclaración del usuario. El feed previo continúa debajo del nuevo inicio. Las 19 rutas de página existentes están presentes y la compilación genera 64 páginas estáticas. Se conservan el estado local, las publicaciones previas, los guardados, las colecciones, los mensajes, las visitas, el inventario y los controles de City.

Comparación con el ZIP anterior: `components/app-state.tsx`, `lib/domain.ts`, `lib/providers/index.ts`, `types/index.ts`, las páginas de Explorar, Publicar y Mensajes y `components/scheduler.tsx` conservan su contenido funcional; solo se normalizó la marca cuando correspondía. No se modificaron las migraciones de Supabase.

## Fuentes y captura

- Referencia principal: captura Axle suministrada por el usuario, 885 × 645. Se utilizó la captura; la URL de MotionSites no estaba disponible durante la revisión.
- Identidad: `public/brand/orbe-brand-identity.png`, original aprobado, 1536 × 1024. Los SVG se trazaron desde sus píxeles y se aplanaron los colores.
- Concepto de adaptación: `work/orbe-home-concept.png`, generado antes de implementar. Se conserva también como entrega `outputs/orbe-concept.png`.
- Escena original: `public/images/orbe-urban-district.webp`, 1672 × 941, generada para ORBE; contiene arquitectura e iluminación, sin controles ni texto. La interfaz es HTML real. City mantiene su escena Three.js existente.
- Método de captura: navegador integrado de Codex, API CUA/Playwright y `tab.screenshot`, sobre `http://localhost:3000/`.
- Inspección final: la referencia Axle, el concepto y las capturas de escritorio, tamaño de referencia y móvil se abrieron con `view_image` en una misma revisión visual.
- Viewports comprobados: 1280 × 800, 885 × 645, 768 × 1024 y 390 × 844. El contenido no desborda horizontalmente. Las capturas de contenido entregadas por el canal integrado miden, respectivamente, 1265 × 791, 870 × 634, 753 × 1004 y 375 × 812; City mide 1280 × 800. La comparación visual contempla esta diferencia respecto al tamaño solicitado.

## Comparación visual

| Superficie | Referencia | Implementación y decisión |
| --- | --- | --- |
| Panel lateral | Tres bloques apilados, oscuros/claro/oscuro | Tres paneles; ancho de 145 px a 885 px de viewport. El contador y la afinidad usan los datos existentes. |
| Navegación | Píldoras con borde fino y selección oscura | Inicio, Explorar, ORBE City, Para ti y Agentes. Para ti abre Videos. El menú conserva Comprar, Alquilar, Mapa, Videos, Guardados, Mensajes, Panel, Preferencias y Publicar. |
| Marco principal | Gran panel de ciudad con esquinas de 26 px | Escena original de Lima en un marco de 25–28 px. Ocupa la primera altura visible; el feed se encuentra al desplazarse. |
| Jerarquía | Titular y acción en la parte inferior izquierda | Se conserva el titular inmobiliario anterior. CTA real a City, con vidrio translúcido y acento champán. |
| Controles flotantes | Botones de + y capas arriba a la derecha | + abre Publicar; capas muestra accesos a Mapa, City y el filtro de proyectos existente. |
| Identidad | Marca Axle y acento naranja | Logo aprobado ORBE trazado fielmente; azul petróleo, champán, marfil y grafito. El naranja queda para pantallas patrocinadas e interacción urbana. |
| Tarjeta secundaria | Comunidad pequeña en el extremo inferior derecho | Acceso a una propiedad existente de San Isidro con precio y foto reales dentro de la demo. |
| Responsive | Referencia solo de escritorio | En móvil se conserva la escena, búsqueda, titular y CTA; el panel lateral se transforma en navegación inferior y menú. |

Desviaciones deliberadas: arquitectura residencial peruana original; textos y marca ORBE; métricas derivadas de los datos de la app; navegación ampliada para conservar todas las funciones; City conserva la avenida 3D anterior. El concepto sugería 30 propiedades, 6 distritos y 92% de afinidad; la app muestra los valores actuales (incluida una publicación previa) y las preferencias persistidas.

## Revisión de textos

URBA → ORBE; Para ti → Inicio. El titular “Tu próxima propiedad no se busca. Se descubre.” se mantiene en el inicio. El encabezado del feed pasa a “Tu universo inmobiliario.” para organizar la pantalla. “En vivo” se identifica como “Demo” en la actividad precargada. Los textos y campos de los formularios anteriores se mantienen.

## Correcciones materiales

1. Se ajustó el panel lateral a la proporción de la referencia a 885 px.
2. Se corrigieron nombres de distritos recortados en la columna del feed.
3. Se aplicó la identidad al CSS propio de City, que se carga después de los estilos globales.
4. Se corrigió el botón Publicar de la navegación móvil y se retiró el indicador de desarrollo de las capturas.
5. Se hicieron visibles las etiquetas de las siete etapas de publicación.
6. Se respetan movimiento reducido y foco visible; se aplicó la convención actual de Next.js para precargar la imagen principal.

## Comprobaciones

| Comprobación | Resultado |
| --- | --- |
| Identidad, contenido y ausencia de overlay de error | Pasó en el navegador integrado. |
| Consola | Sin errores de aplicación. Advertencia de `THREE.Clock` originada en React Three Fiber; no afecta el render. |
| Diseño responsive | Sin desbordamiento horizontal en los cuatro tamaños comprobados. |
| Búsqueda principal | Consulta “Casa en La Molina hasta US$400,000” → Explorar → 2 resultados, incluida la publicación previa. |
| Filtros móviles | Comprar, La Molina y precio máximo 400,000 → 2 resultados; apertura de ficha correcta. |
| Guardados | Guardar → recargar → continúa guardado; se restauró el estado previo al terminar la prueba. |
| Galería y agenda | Foto 1/3 → 2/3; modal de agenda abre con días y horarios; no se agregó una visita de prueba. |
| Publicación | Primera etapa → Continuar → Ubicación. Siete etiquetas visibles. |
| Páginas conservadas | Publicar, Mensajes, Agentes, Mapa, Dashboard y ficha contienen sus interfaces previas. |
| City | Búsqueda A12 → panel de la campaña previa; minimapa; recorrido automático → Pausar; vista 2D con 21 pantallas → volver a 3D. |
| TypeScript y producción | `next build` correcto, incluida comprobación de TypeScript y 64 páginas generadas. `npm run typecheck` también correcto. |
| ESLint | Sin errores. El lint completo informa advertencias de imágenes y elementos heredados; `eslint app components lib types --quiet` termina correctamente. |

Límites: los servicios externos continúan en los modos demo existentes. No se realizó una auditoría exhaustiva de todos los flujos ni una prueba en navegadores adicionales. No quedan defectos P0/P1/P2 identificados en las superficies revisadas.

## Evidencia entregada

Capturas en `outputs/`: `orbe-preview.png`, `orbe-reference-size.png`, `orbe-mobile.png`, `orbe-tablet.png`, `orbe-feed.png`, `orbe-explore.png`, `orbe-property.png`, `orbe-dashboard.png` y `orbe-city.png`. El concepto y este informe se entregan también en esa carpeta. El código fuente actualizado se empaqueta en `orbe-proptech-demo.zip`.

## Actualización del fondo — 11 de octubre de 2026

El usuario solicitó reemplazar la escena generada del inicio por un clip del video de Lima suministrado. Se revisó el video completo mediante una hoja de contacto cada 12 segundos y el inicio mediante fotogramas cada segundo. Se eligió la toma aérea de edificios al atardecer entre 00:10,4 y 00:19,4. La disolvencia final de 0,6 segundos conecta el cierre con el comienzo; el loop resultante dura 8,36 segundos.

- Archivo servido: `public/videos/orbe-lima-background.mp4`, 3.640.345 bytes (3,64 MB), H.264 yuv420p, 1920 × 1080, cadencia nominal de 25 fps. Audio eliminado; CRF 24, preset slow y faststart. El archivo original suministrado pesa 208.432.624 bytes y no se incorpora a la web.
- Poster real: `public/images/orbe-lima-poster.webp`, 1920 × 1080, 231.212 bytes. Sustituye también la imagen durante la carga y con movimiento reducido.
- Superficies modificadas: `components/orbe-gateway.tsx` y los estilos del fondo en `app/orbe.css`. Se mantienen búsqueda, capas, Publicar, acceso a City, propiedad destacada y feed.
- Corrección detectada en QA: el transform usado para centrar la búsqueda recortaba su modal fijo. Se sustituyó por centrado con márgenes en escritorio y posición equivalente en tablet. El diálogo vuelve a mostrarse completo y el botón Cerrar funciona.
- Entorno de revisión: `http://localhost:3000/`, navegador integrado de Codex mediante CUA/Playwright, escritorio 1280 × 720 y móvil 390 × 844. Sin Browser plugin separado; se utilizó el navegador integrado disponible.

| Comprobación | Resultado |
| --- | --- |
| Identidad, contenido y overlay | Inicio ORBE correcto; titular, controles y feed presentes; sin overlay de error. |
| Reproducción | Video decodificado a 1920 × 1080, `readyState: 4`, `muted: true`, `loop: true`, `paused: false`; tiempo avanza. |
| Pausar/reanudar | El botón pausa y conserva exactamente el tiempo 1,707174 s entre comprobaciones; Reproducir reanuda. Repetido en móvil. |
| Fuera de pantalla | Al desplazarse al final, fondo fuera de vista y `paused: true`; volver arriba reanuda. |
| Movimiento reducido | Emulación del navegador seguida de recarga: `paused: true`, tiempo 0 y `readyState: 0`. Reproducir inicia bajo petición. Emulación retirada al terminar. |
| Búsqueda y capas | Capas abre los accesos anteriores; búsqueda abre completa y Cerrar la cierra, tanto en escritorio como en móvil. |
| Responsive | Sin desbordamiento horizontal en ambos tamaños; titular, CTA y controles legibles. |
| Consola | Sin errores de aplicación. Única advertencia: Motion informa del movimiento reducido habilitado durante esa prueba. |
| Código | Compilación de producción con 64 páginas y TypeScript correctos; `tsc --noEmit` y ESLint del componente sin errores. |

Evidencia actual: `outputs/orbe-video-preview.png` y `outputs/orbe-video-mobile.png`. Las capturas anteriores documentan el diseño previo. La plantilla de navegación, las páginas y el estado local permanecen conservados. La pausa al ocultar pestaña está implementada mediante `visibilitychange`; no se simuló por separado ese evento. No se comprobaron navegadores adicionales ni redes lentas físicas.

### Ampliación a cinco clips

Por petición del usuario, el fondo ahora contiene cinco tomas diferentes del video original: ciudad al atardecer (00:10,8–00:16,0), Miraflores de noche (00:21,6–00:26,8), centro histórico (01:09,6–01:14,8), edificios y malecón (02:08,0–02:13,2) y panorama costero (05:29,8–05:35,0). Se revisaron cinco fotogramas por toma y se ajustaron los tramos para excluir los cortes internos del original.

El resultado actual sustituye el clip de una sola escena: **22,00 s, 1920 × 1080, 25 fps, 8.204.396 bytes**, H.264 yuv420p, sin audio. Cada clip fuente dura 5,2 s; los cinco fundidos duran 0,8 s e incluyen la unión de la última escena con la primera. Se inspeccionaron fotogramas anteriores, intermedios y posteriores a cada transición en `work/lima-video-review/montage-transitions.jpg`: aparecen mezclas graduales entre las cinco vistas, sin pantallas negras. La fuente original y la resolución se conservan. La codificación usa CRF 25, preset slow, maxrate 3M, bufsize 6M y faststart.

Se actualizó la URL del video con `?v=5-clips` para que el navegador cargue el nuevo montaje. El caption ahora indica “Lima, Perú” y el buscador usa vidrio más oscuro para mantener contraste con las escenas de día. El poster sigue siendo un fotograma del inicio. Los controles de reproducción, búsqueda, capas y navegación permanecen.

Verificación en el navegador integrado: duración 22 s, resolución decodificada 1920 × 1080, `readyState: 4`, reproducción silenciosa; pausa mantiene el tiempo exacto 19,230067 s entre lecturas. Escritorio 1280 × 720 y móvil 390 × 844 sin desbordamiento horizontal. Se revisó la legibilidad en las tomas de día del malecón y la costa. Producción y TypeScript pasan con 64 páginas; ESLint del componente sin errores. Las capturas `outputs/orbe-video-preview.png` y `outputs/orbe-video-mobile.png` ahora muestran el montaje actualizado.

## Auditoría de acabado — 11 de octubre de 2026

Se revisaron las 19 rutas/plantillas existentes en escritorio 1280 × 720 y móvil 390 × 844. Se añadieron comprobaciones del inicio, feed, acceso y City en tablet 885 × 720, del inicio/feed/City a 320 × 844, y una captura final del feed a 1280 × 1000. Las plantillas dinámicas se comprobaron con el perfil de Mariana Torres, La Molina y el penthouse de San Isidro.

El desbordamiento de los paneles de distritos y tendencias está corregido: columna de 216 px, padding de 16 px, títulos semánticos, iconos fijos y filas con saltos de línea. Se corrigieron además el contador lateral, los encabezados y textos del panel derecho, el espacio entre precio/agente/botones del feed, los márgenes de los tres formularios de acceso, el precio dividido en la vista previa móvil de publicación, placeholders y textos secundarios de poco contraste, la etiqueta La Molina del mapa compacto y el solapamiento del logo con el buscador de City. La leyenda de City en tamaños menores tiene fondo oscuro para poder leerse sobre las pantallas de la escena. Las pestañas, videos y colecciones conservan el desplazamiento horizontal con barras visualmente discretas.

Se recorrieron los siete pasos de publicación, los seis de promoción y los cuatro de onboarding sin ejecutar sus acciones finales. Búsqueda desde el inicio con “Casa en La Molina” conduce a Explorar, aplica ambos filtros y devuelve cuatro resultados. El enlace “Ver todos los distritos” conduce a Explorar. El campo de mensajes permanece accesible al desplazarse hasta el final; los botones de conversación tienen nombres accesibles en móvil. Los campos de acceso tienen etiquetas y autocomplete adecuados.

Los estados finales medidos no presentan desbordamiento horizontal de página ni las señales de texto desbordado detectadas al inicio. También se inspeccionaron capturas para detectar solapamientos. Producción pasa con 64 páginas; `tsc --noEmit` y ESLint con `--quiet` pasan sin errores. Se mantienen las advertencias heredadas del lint completo, las integraciones demo, el estado local y el video de cinco clips.

Informe completo y evidencia: `outputs/orbe-layout-audit/audit.md`. Captura de la incidencia: `01-feed-before.png`. Captura final: `72-feed-desktop-final.png`. Los formularios se comparan en `15-login-desktop.png` y `70-login-desktop-after.png`; la vista previa móvil en `40-publish-preview-mobile.png` y `67-publish-preview-mobile-after.png`; City en `57-city-mobile.png`, `59-city-mobile-after.png`, `71-city-tablet-final.png` y `73-city-small-mobile-final.png`.

Alcance: revisión visual y de los estados enumerados en el navegador integrado. No se comprobó cada variante dinámica por separado, navegadores adicionales ni servicios externos. Esta revisión no es una certificación de accesibilidad.
# Búsqueda por mapa — 11 de octubre de 2026

## Acceso a videos: Para ti

- El acceso Proyectos de la navegación principal pasa a Para ti, con destino `/videos`. El menú móvil usa el mismo destino y la selección activa corresponde a la sección de videos.
- Comprobación en navegador integrado a 1280 × 720 y 390 × 844: Inicio → Para ti → Historias de la ciudad; el menú móvil cierra al navegar. Sin errores de consola ni desbordamiento horizontal en la comprobación móvil.
- Exportación de 65 páginas y ESLint del componente sin errores. El cambio enlaza a la experiencia de videos existente.

## Preparación para GitHub Pages

- Publicación completada en `https://cyarquitectos26-prog.github.io/`, repositorio público de archivos compilados `cyarquitectos26-prog.github.io`, commit `7c63ce8`. Trabajo `pages-build-deployment` #1 completado correctamente en 29 segundos, desde `main` y la carpeta raíz, con HTTPS obligatorio.
- Comprobación del sitio público: inicio con video 1920 × 1080 reproduciéndose, imágenes cargadas; Miraflores devuelve tres fichas y sus mismos tres IDs en el mapa; búsqueda por zona activa el filtro; texto inexistente produce cero pines; limpiar restaura las 30 propiedades demo; una ficha precargada abre y recarga directamente sin errores de consola.
- Las capturas `pages-live-home.png` y `pages-live-map.png` están en la carpeta temporal `orbe-pages-qa`, fuera del repositorio.

- Exportación estática: 65 páginas, todos los recursos públicos y `.nojekyll`; comprobada con un servidor de archivos en `http://localhost:4173/` sin usar el servidor de Next.js.
- Inicio: imágenes cargadas y video 1920 × 1080 reproduciéndose, sin endpoint `/_next/image`. Navegación de Inicio a Mapa y de una vista previa a la ficha precargada funciona.
- Mapa: Miraflores devuelve tres propiedades; IDs de lista y pines coinciden, calles cargadas y vista previa correcta.
- Publicación: formulario completado con un registro de prueba únicamente en el origen local de QA; la ficha nueva abre la ruta estática con `slug` y conserva contenido al recargar.
- City: vista 3D y ajustes cargados con imágenes; se conserva la separación del shell con rutas que terminan en `/`. Three.js emite una advertencia de deprecación de su reloj desde la dependencia; no impide la escena.
- Build y ESLint pasan. El estado local de QA no forma parte de los archivos desplegados.

## Adaptación a la referencia oscura

- Fondo `#14202a`, textos de distrito `#aabecb`, marcadores `#d3a676` con halo, controles oscuros rectangulares y atribución visible. Las calles siguen siendo geográficas; su densidad y los precios añaden información respecto del mapa compacto de la referencia.
- Se mantienen los filtros, agrupaciones, todas las publicaciones locales, selección, fichas, teclado y búsqueda por área. No cambia el proveedor de teselas ni el almacenamiento local.
- Revisión en el navegador integrado mediante CUA: 1280 × 1000 y 390 × 844; sin desbordamiento horizontal, página no vacía, sin overlay del framework ni errores o advertencias de consola.
- Flujo comprobado: buscar Miraflores → ampliar su agrupación → seleccionar pin → vista previa; buscar área visible → lista y pines sincronizados; búsqueda inexistente → cero resultados y cero pines; limpiar → 31 propiedades (30 precargadas y una publicación local existente). En móvil, Espacio sobre un pin abre la ficha y los controles se mantienen accesibles junto a la vista previa.
- Compilación de 64 páginas, TypeScript y ESLint sin errores. Capturas y siete estados de comprobación se guardan fuera del repositorio, en la carpeta temporal `orbe-map-style-qa`.

- `/map`: Leaflet y calles reales; coordenadas demo referenciales, atribución visible y carga separada del resto de páginas.
- 31 propiedades locales representadas sin truncamiento; los IDs de las agrupaciones coinciden con los de la lista.
- Casa en La Molina hasta US$400000: 2 resultados; Miraflores en alquiler: 1; terreno en Pachacamac hasta US$200000 sin tildes: 2; texto «malecon»: 1.
- Buscar en la zona de Miraflores partiendo del inventario completo: 3 propiedades en lista y pines. Limpiar restaura las 31.
- Consulta inexistente: 0 resultados y 0 pines. Seleccionar desde la lista y desde un pin abre la vista previa; el enlace abre la ficha correcta.
- Marcadores con Enter y espacio; zoom, agrupaciones y vista ampliada; comprobación en 1280 × 1000 y 390 × 844 sin desbordamiento horizontal.
- Build de 64 páginas, TypeScript y ESLint sin errores. Inventario y coordenadas siguen siendo demo; las calles requieren conexión al proveedor.
