import { Routes } from '@angular/router';
import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductForm } from './features/products/product-form/product-form';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'products/new', component: ProductForm },
  { path: 'products/edit/:id', component: ProductForm },
  { path: 'products/:id', component: ProductDetail },
  { path: '**', redirectTo: '' }
];
