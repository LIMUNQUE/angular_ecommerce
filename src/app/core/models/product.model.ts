/**
 * Interfaz que define la estructura de un Producto.
 * Utilizar interfaces en Angular (TypeScript) asegura el tipado estricto
 * y previene errores en tiempo de compilación.
 */
export interface Product {
  id?: string;          // Opcional al crear un nuevo producto
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}
