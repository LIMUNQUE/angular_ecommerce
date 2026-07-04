import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe obtener la lista de productos (getProducts)', () => {
    const dummyProducts: Product[] = [
      { id: '1', name: 'Prod 1', price: 10, description: 'Desc 1', imageUrl: 'url1' },
      { id: '2', name: 'Prod 2', price: 20, description: 'Desc 2', imageUrl: 'url2' }
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    // Simulamos la respuesta de la petición HTTP interceptada
    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('debe obtener un producto por su id (getProductById)', () => {
    const dummyProduct: Product = { id: '1', name: 'Prod 1', price: 10, description: 'Desc 1', imageUrl: 'url1' };

    service.getProductById('1').subscribe(product => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('debe crear un nuevo producto (createProduct)', () => {
    const newProduct: Product = { name: 'Prod 3', price: 30, description: 'Desc 3', imageUrl: 'url3' };
    const returnedProduct: Product = { id: '3', ...newProduct };

    service.createProduct(newProduct).subscribe(product => {
      expect(product).toEqual(returnedProduct);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush(returnedProduct);
  });
});
