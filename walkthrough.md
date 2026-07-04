# Implementación del Hello World de E-commerce en Angular

Hemos transformado el proyecto base en una tienda online funcional que demuestra las características clave de Angular, siguiendo buenas prácticas.

## Cambios Realizados

### 1. Entorno y Mock Backend
- **json-server**: Instalado y configurado mediante `db.json` para servir una API RESTful completa en `http://localhost:3000/products`.
- Esto nos permite simular asincronismo y llamadas de red con Angular `HttpClient`, además de resolver CORS de manera nativa y transparente.

### 2. Estructura y Servicios
- Se creó `ProductService` en la carpeta Core para aislar y centralizar las operaciones HTTP (GET, POST, PUT, DELETE).
- Utilización de **RxJS Observables** en el servicio para manejar las solicitudes de manera reactiva.
- Configuración global del cliente HTTP mediante `provideHttpClient()` en `app.config.ts`.

### 3. Componentes y UI Modernos
- Construcción de `Navbar` estático y enrutado.
- Creación de `ProductList` (Catálogo), `ProductDetail` (Vista individual) y `ProductForm` (Para agregar/editar).
- **Rendimiento con `@defer`**: La grilla de productos y el detalle individual se cargan de forma diferida en la UI usando la sintaxis `@defer`, con un `@placeholder` (skeleton loaders) que mejora la experiencia del usuario mientras se resuelven las peticiones asíncronas.
- **Signals**: Se emplearon `signal()` para manejar el estado local de los componentes (`products()`, `loading()`, `error()`) lo cual reemplaza el uso antiguo de variables estándar y mejora el rendimiento del change detection de Angular.
- **Formularios Reactivos**: Implementación de validaciones complejas (requerido, longitud, min/max y patrones de URL) utilizando `ReactiveFormsModule` en `ProductForm`.

### 4. Enrutamiento
Configurado en `app.routes.ts`:
- `/` -> Catálogo.
- `/products/new` -> Crear producto.
- `/products/:id` -> Ver detalle (Ruta dinámica).
- `/products/edit/:id` -> Editar producto (Ruta dinámica).

### 5. Testing
- Implementación de **Pruebas Unitarias** básicas para `ProductService` usando `HttpTestingController` y `Vitest`, demostrando cómo interceptar y validar llamadas HTTP en Angular.

## Ejecución Manual

> [!TIP]
> Para probar la aplicación completamente, abre dos terminales en la carpeta raíz del proyecto:

1. **Terminal 1 (Backend Mock)**: 
   ```bash
   pnpm run backend
   ```
2. **Terminal 2 (Frontend Angular)**:
   ```bash
   pnpm run start
   ```

Luego, abre tu navegador en `http://localhost:4200` y navega por la tienda. Podrás agregar nuevos productos y ver cómo persisten temporalmente en tu `db.json`.

## Verificación de Tests

Puedes ejecutar los tests en cualquier momento con:
```bash
pnpm run test
```
