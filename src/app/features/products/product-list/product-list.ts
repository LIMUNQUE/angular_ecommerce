import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  
  // Usamos signals para manejar el estado de manera reactiva y moderna
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    // Manejo de asincronismo consumiendo el Observable del servicio
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.error.set('No se pudieron cargar los productos. Asegúrate de que json-server esté corriendo.');
        this.loading.set(false);
      }
    });
  }

  deleteProduct(id: string | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // Actualizamos la lista localmente
          this.products.update(list => list.filter(p => p.id !== id));
        },
        error: (err) => {
          console.error('Error deleting product', err);
          alert('Error al eliminar el producto');
        }
      });
    }
  }
}
