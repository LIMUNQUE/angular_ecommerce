# Guía de Estudio: Angular Moderno (v21) para Desarrollo Profesional

Bienvenido a esta guía detallada. Este documento fue creado específicamente para que un desarrollador Junior pueda entender a fondo cómo está construido este proyecto de e-commerce "Hello World", por qué se tomaron ciertas decisiones arquitectónicas y qué características modernas de Angular se están utilizando.

---

## 1. Arquitectura y Estructura de Carpetas

En aplicaciones profesionales, el código no se pone al azar. Se divide por responsabilidades para que el proyecto sea escalable. En este proyecto utilizamos una variación de la arquitectura **Core/Feature/Shared**:

```text
src/app/
├── core/                   # Cosas globales que se cargan UNA vez en toda la app.
│   ├── components/         # Componentes estructurales (Navbar, Footer, Layout).
│   ├── models/             # Interfaces (tipados estrictos de TypeScript).
│   └── services/           # Servicios singleton (ej. ProductService).
├── features/               # Lógica de negocio agrupada por dominio.
│   └── products/           # Dominio de "productos".
│       ├── product-list/
│       ├── product-detail/
│       └── product-form/
├── app.ts                  # Componente raíz (Shell).
├── app.routes.ts           # Configuración de rutas principales.
└── app.config.ts           # Configuración global (Zoneless, HttpClient, Router).
```

**¿Por qué hacerlo así?**
Si mañana agregas un módulo de `usuarios` o `facturas`, simplemente creas nuevas carpetas dentro de `features/`. El `core/` se mantiene limpio solo con lo esencial para que la app arranque.

---

## 2. Características de Angular Moderno (Zoneless y Standalone)

Angular ha cambiado drásticamente en sus últimas versiones. Aquí tienes lo más destacado que usamos:

### A. Componentes Standalone (Sin `NgModule`)

Si ves el código de cualquier componente (ej. `navbar.ts`), notarás que el decorador `@Component` tiene un array llamado `imports: []`.
Ya no existen los archivos `app.module.ts`. Ahora cada componente es independiente y debe importar explícitamente lo que necesita (ej. `RouterLink`, `ReactiveFormsModule`). Esto hace que el código sea más predecible y fácil de "vaguear" (lazy load).

### B. Signals (`signal()`)

En `product-list.ts`, en lugar de hacer `products: Product[] = [];`, hicimos:

```typescript
products = signal<Product[]>([]);
```

**Signals** son la nueva forma reactiva de Angular para saber exactamente cuándo cambia un dato. En lugar de revisar toda la aplicación para ver si algo cambió (Change Detection tradicional), Angular sabe exactamente qué pedazo del HTML actualizar cuando haces `this.products.set(nuevaData)`. Es muchísimo más rápido.

### C. Zoneless (Sin Zone.js)

Tradicionalmente, Angular usaba una librería llamada `zone.js` para "magicamente" detectar cuándo hacias un clic o llegaba una petición HTTP, y así actualizar la pantalla. En `app.config.ts` usamos `provideZonelessChangeDetection()`. Esto elimina `zone.js` por completo, haciendo que la aplicación cargue más rápido y consuma menos memoria. Con Zoneless, Angular confía en las **Signals** para actualizar la vista.

### D. Control de Flujo Integrado (`@if`, `@for`, `@defer`)

Ya no usamos los viejos `*ngIf` o `*ngFor`. Angular ahora tiene una sintaxis propia directamente en el HTML:

- `@if (condicion) { ... }`: Más limpio e intuitivo.
- `@for (item of items; track item.id)`: Mucho más rápido. El `track` es obligatorio porque le dice a Angular cómo identificar cada elemento de forma única, evitando re-renderizar listas enteras.
- **`@defer`**: _Esta es una de las joyas de Angular moderno_. En `product-list.html` envolvemos la lista en `@defer`. Esto significa que el código de esa sección se carga de manera perezosa (Lazy Loading) separándolo del bundle principal. El `@placeholder` muestra una estructura falsa ("Skeleton") mientras carga.

---

## 3. Inyección de Dependencias Moderna (`inject`)

En el pasado, inyectábamos servicios dentro del `constructor()`. Ahora la buena práctica profesional es usar la función `inject()`:

```typescript
// Antes:
constructor(private productService: ProductService) {}

// Ahora (Moderno y Profesional):
private productService = inject(ProductService);
```

**¿Por qué?** Facilita la herencia de clases (no lidias con `super()`), mantiene el constructor limpio y permite crear funciones reutilizables fuera del componente que también pueden inyectar dependencias.

---

## 4. Manejo de Asincronismo y API con HTTP

Para hacer peticiones a servidores, Angular provee `HttpClient` (habilitado con `provideHttpClient()` en `app.config.ts`).

En `product.service.ts`, los métodos retornan **Observables** de `RxJS`:

```typescript
getProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.apiUrl);
}
```

Un Observable es como una promesa pero mucho más poderosa: permite cancelar peticiones, reintentar si hay errores y manejar flujos de datos continuos.
En el componente nos "suscribimos" (`.subscribe()`) para escuchar cuando el servidor nos responda.

**El Backend Mock (json-server)**:
Usamos `json-server` en el puerto 3000 porque en el mundo real, los equipos de Frontend a menudo no pueden esperar a que Backend termine las APIs. `json-server` lee nuestro `db.json` y automáticamente crea rutas (GET, POST, PUT, DELETE), manejando además los dolores de cabeza del CORS (el bloqueo de seguridad del navegador cuando llamas a otro puerto).

---

## 5. Rutas (Routing) Dinámicas

En `app.routes.ts` definimos la navegación. Lo más interesante es la ruta dinámica:
`{ path: 'products/:id', component: ProductDetail }`

El `:id` es un comodín. Si el usuario va a `/products/123`, Angular carga `ProductDetail`.
Dentro del componente, usamos `ActivatedRoute` para extraer ese `123`:

```typescript
const id = this.route.snapshot.paramMap.get('id');
```

---

## 6. Formularios Reactivos (Reactive Forms)

En `product-form.ts` creamos el formulario en TypeScript, no en el HTML. Esto es "Reactive Forms".

```typescript
this.productForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(3)]],
});
```

**¿Por qué es profesional?**

- Permite escribir validaciones complejas de forma programática.
- Facilita hacer pruebas unitarias del formulario sin necesidad de renderizar el HTML.
- Es inmutable y reactivo.

---

## 7. Comandos Útiles (Angular CLI)

Aquí tienes los comandos del `Angular CLI` (Interfaz de Línea de Comandos) que utilizamos, y que usarás en tu día a día:

| Comando                                | Descripción                                                                                                                                                      |
| :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ng serve` (o `npm start`)             | Levanta el servidor de desarrollo local con recarga en vivo.                                                                                                     |
| `ng build`                             | Compila la aplicación, optimizando, minificando el código y eliminando lo que no se usa ("Tree Shaking"), dejándolo en la carpeta `dist/` listo para producción. |
| `ng test`                              | Ejecuta las pruebas unitarias (Vitest/Karma).                                                                                                                    |
| `ng generate component carpeta/nombre` | Crea automáticamente los archivos de un componente (.ts, .html, .css) y genera su código base. (_Atajo: `ng g c nombre`_).                                       |
| `ng generate service carpeta/nombre`   | Genera un servicio inyectable. (_Atajo: `ng g s nombre`_).                                                                                                       |

---
