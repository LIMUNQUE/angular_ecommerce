# Guía Definitiva de Angular Moderno (v21) para Principiantes

¡Bienvenido al mundo de Angular! Esta guía está diseñada para que cualquier persona que esté aprendiendo el framework hoy mismo pueda entender cómo construir una aplicación escalable, profesional y moderna, sin agobiarse con técnicas del pasado.

---

## 1. ¿Cómo se relaciona todo? (El Flujo de la Aplicación)

Cuando abres tu aplicación en el navegador, Angular sigue una cadena de eventos muy clara:

1. **`main.ts`**: Es el punto de entrada. Aquí Angular arranca la aplicación (Bootstrap) usando nuestro componente principal (`App`) y la configuración global (`appConfig`).
2. **`app.config.ts`**: Aquí configuramos el "cerebro" de la app: habilitamos las rutas (`provideRouter`) y el motor de reactividad (`provideZonelessChangeDetection()`).
3. **`app.routes.ts`**: Es el mapa de navegación. Le dice a Angular qué componente mostrar dependiendo de la URL (ej. si vas a `/products/1`, carga el `ProductDetail`).
4. **`app.ts` (Componente Raíz)**: Es el "cascarón". En su HTML (`<app-navbar></app-navbar>` y `<router-outlet></router-outlet>`), pinta el menú de navegación y deja un espacio dinámico (`router-outlet`) donde Angular inyectará las páginas según la ruta.
5. **Servicios (`product.service.ts`)**: Son los proveedores de datos. Si un componente necesita una lista de productos, no la inventa, se la pide al servicio.

---

## 2. Conceptos Clave del Angular Moderno

Si acabas de empezar a aprender, concéntrate en estas 3 herramientas principales que hacen a Angular tan poderoso hoy en día:

### A. Componentes Standalone (Independientes)
Cada bloque de tu pantalla (un botón, una barra de navegación, una página entera) es un **Componente**.
Un componente tiene 3 partes (que pueden estar en el mismo archivo o separados):
- **La clase (TypeScript)**: La lógica y los datos.
- **La plantilla (HTML)**: Lo que el usuario ve.
- **Los estilos (CSS)**: El diseño.

En Angular moderno usamos el decorador `@Component`. Lo importante es el array `imports: []`. Si tu componente va a usar un formulario, importas `ReactiveFormsModule`. Si va a usar enlaces de rutas, importas `RouterLink`. Cada componente es autosuficiente.

### B. Signals (`signal()`)
Las **Signals** son "variables inteligentes". 
En un proyecto normal de JS, si cambias `let nombre = "Juan"` a `"Pedro"`, el HTML no se entera automáticamente.
En Angular, si haces:
```typescript
nombre = signal('Juan');
```
Y en tu HTML pones `<h1>{{ nombre() }}</h1>`, Angular conecta ambos. Cuando luego en tu código haces `this.nombre.set('Pedro')`, Angular actualiza instantáneamente solo ese `<h1>` en la pantalla, sin gastar recursos revisando toda la app. Es magia pura y muy rápida.

### C. Control de Flujo (`@if`, `@for`, `@defer`)
Para mostrar cosas condicionalmente en el HTML, Angular tiene su propia sintaxis:
- `@if (productoActivo()) { <p>¡Está disponible!</p> }`
- `@for (item of productos(); track item.id) { <li>{{ item.name }}</li> }`
- **`@defer`**: Si tienes una tabla de productos muy pesada, la envuelves en `@defer`. Angular cargará el resto de la página primero de forma súper rápida, y luego, en segundo plano (o cuando el usuario haga scroll), descargará el código de la tabla.

---

## 3. Entendiendo el Testing (Pruebas Unitarias)

En proyectos profesionales, nunca subimos código sin probarlo (Testing). Utilizamos **Vitest** (un motor de pruebas súper rápido). Las pruebas viven en archivos que terminan en `.spec.ts`.

### ¿Cómo están construidos los tests?
Miremos el test de nuestro componente principal (`app.spec.ts`):

```typescript
// 1. Importamos las herramientas de pruebas de Angular
import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

// 2. 'describe' agrupa un bloque de pruebas sobre algo específico.
describe('App Component', () => {
  
  // 3. 'beforeEach' se ejecuta ANTES de cada prueba. Aquí preparamos el entorno.
  beforeEach(async () => {
    // TestBed es un simulador de Angular. Le pasamos las configuraciones necesarias.
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])] // Simulamos el router para que no falle
    }).compileComponents();
  });

  // 4. 'it' es una prueba individual.
  it('debe crearse la aplicación', () => {
    // Creamos el componente en memoria
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // 'expect' es la aserción: Afirmamos que el componente existe (es verdadero)
    expect(app).toBeTruthy();
  });
});
```
Para el servicio (`product.service.spec.ts`), simplemente inyectamos el servicio y verificamos que sus métodos devuelvan los datos esperados de nuestro array estático.

---

## 4. TUTORIAL PASO A PASO: Cómo construir este E-Commerce desde Cero

Si quieres replicar este proyecto por tu cuenta para practicar, sigue estos exactos pasos en tu terminal y editor:

### Paso 1: Crear el proyecto
Abre tu terminal y usa el Angular CLI (debes tener NodeJS y pnpm instalados):
```bash
# Crea un proyecto nuevo con las últimas características
npx @angular/cli new mi-tienda --package-manager=pnpm --style=css --routing=true
```
*(Durante la instalación, elige la opción por defecto. En Angular moderno, todo es Standalone por defecto).*

### Paso 2: Configurar Zoneless
Angular 21 crea el proyecto con Zone.js por defecto por retrocompatibilidad. Para hacerlo puramente moderno (Zoneless):
1. Abre `src/app/app.config.ts`.
2. Cambia `provideZoneChangeDetection` por `provideZonelessChangeDetection()`.

### Paso 3: Crear el modelo de datos
Crea un archivo manual en `src/app/core/models/product.model.ts`:
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}
```

### Paso 4: Crear el Servicio de Productos
En la terminal, genera el servicio que manejará los datos:
```bash
npx ng generate service core/services/product
```
Abre el archivo generado (`product.service.ts`), inyecta un array estático de productos y crea métodos que devuelvan `Observable<Product[]>` usando `of()` de la librería `rxjs`, tal como lo hicimos en este proyecto.

### Paso 5: Crear el Componente del Navbar (Core)
```bash
npx ng generate component core/components/navbar
```
Abre `navbar.ts`. En el array de `imports: []`, añade `RouterLink`.
En `navbar.html`, crea una barra de navegación sencilla. Usa `routerLink="/"` para el logo y `routerLink="/products/new"` para crear un producto.

### Paso 6: Crear los Componentes de Pantalla (Features)
Genera las 3 pantallas principales:
```bash
npx ng generate component features/products/product-list
npx ng generate component features/products/product-detail
npx ng generate component features/products/product-form
```

### Paso 7: Configurar las Rutas
Abre `src/app/app.routes.ts` y conecta las URLs con tus nuevos componentes:
```typescript
import { Routes } from '@angular/router';
import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductForm } from './features/products/product-form/product-form';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'products/new', component: ProductForm },
  { path: 'products/:id', component: ProductDetail }, // Ruta dinámica (recibe un ID)
  { path: '**', redirectTo: '' } // Si pone una URL que no existe, lo manda al inicio
];
```

### Paso 8: Programar la Lista de Productos (`product-list`)
Abre `product-list.ts`:
1. Importa e inyecta el servicio: `private productService = inject(ProductService);`
2. Crea una Signal: `products = signal<Product[]>([]);`
3. En el `ngOnInit()`, llénarla suscribiéndote al servicio: 
   `this.productService.getProducts().subscribe(data => this.products.set(data));`
4. En `product-list.html`, usa `@for (p of products(); track p.id)` para dibujar tarjetas HTML por cada producto. 
5. *(Extra)*: Envuelve toda la lista en un bloque `@defer { ... } @placeholder { <div>Cargando...</div> }` para optimizar su carga.

### Paso 9: Conectar la App Principal
Abre `src/app/app.ts`. Borra todo el código HTML de prueba que trae Angular por defecto y déjalo así:
```html
<app-navbar></app-navbar> <!-- Tu menú superior -->
<main class="container">
  <router-outlet></router-outlet> <!-- Aquí Angular pinta las páginas dinámicamente -->
</main>
```
*(No olvides asegurarte de que `Navbar` y `RouterOutlet` estén en el array de `imports: []` del componente).*

### Paso 10: Ejecutar y probar
¡Listo! Levanta tu servidor local:
```bash
pnpm run start
```
Ahora tienes una base profesional, modular, reactiva (con Signals) y súper optimizada lista para seguir creciendo. ¡El límite es tu imaginación!
