import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener la lista de productos predeterminados', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBeGreaterThan(0);
    });
  });

  it('debe crear un nuevo producto', () => {
    const newProduct = { name: 'Test', price: 10, description: 'Test', imageUrl: 'url' };
    service.createProduct(newProduct).subscribe(product => {
      expect(product.id).toBeDefined();
      expect(product.name).toBe('Test');
    });
  });
});
