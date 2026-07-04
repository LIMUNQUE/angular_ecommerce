import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

/**
 * Servicio centralizado para gestionar las peticiones HTTP de Productos.
 * Al usar @Injectable({ providedIn: 'root' }), Angular crea un singleton 
 * disponible en toda la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Inyección de dependencias moderna con `inject()`. 
  // Sustituye a tener que declararlo en el constructor.
  private http = inject(HttpClient);
  
  // URL base apuntando a nuestro json-server local
  private readonly apiUrl = 'http://localhost:3000/products';

  /**
   * Obtiene todos los productos de la base de datos mockeada.
   * Maneja el asincronismo mediante Observables de RxJS.
   * CORS es manejado automáticamente por el json-server, que expone 
   * cabeceras `Access-Control-Allow-Origin: *`.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  /**
   * Obtiene un producto por su identificador.
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo producto y lo envía al servidor.
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Actualiza un producto existente.
   */
  updateProduct(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  /**
   * Elimina un producto por su id.
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
