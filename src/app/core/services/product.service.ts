import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Servicio centralizado para gestionar Productos en memoria.
 * Esta versión simplificada no utiliza HttpClient ni base de datos externa,
 * facilitando el aprendizaje de RxJS (Observables) de forma básica.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  // Base de datos simulada en memoria
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop Pro 15',
      price: 1299.99,
      description: 'Portátil de alto rendimiento para profesionales creativos.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'Auriculares Noise Cancelling',
      price: 249.50,
      description: 'Auriculares inalámbricos con cancelación de ruido activa superior.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: '3',
      name: 'Smartwatch V3',
      price: 199.00,
      description: 'Reloj inteligente con monitor de salud y batería de larga duración.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
    }
  ];

  /**
   * Obtiene todos los productos de la memoria.
   * `of()` crea un Observable a partir de los datos.
   */
  getProducts(): Observable<Product[]> {
    return of([...this.mockProducts]);
  }

  /**
   * Obtiene un producto por su identificador.
   */
  getProductById(id: string): Observable<Product> {
    const product = this.mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return of({...product});
  }

  /**
   * Crea un nuevo producto y lo añade al array.
   */
  createProduct(product: Product): Observable<Product> {
    const newProduct = {
      ...product,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockProducts.push(newProduct);
    return of(newProduct);
  }

  /**
   * Actualiza un producto existente.
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    this.mockProducts[index] = { ...product, id };
    return of(this.mockProducts[index]);
  }

  /**
   * Elimina un producto por su id.
   */
  deleteProduct(id: string): Observable<void> {
    this.mockProducts = this.mockProducts.filter(p => p.id !== id);
    return of(void 0);
  }
}
