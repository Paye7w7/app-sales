import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Product, ProductService } from '../../services/product.service';

interface CartItem {
  product: Product;
  quantity: number;
  discount_percent: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  cart: CartItem[] = [];
  selectedProduct: Product | null = null;
  loading = true;
  saving = false;
  error = '';
  message = '';

  constructor(private productService: ProductService, private http: HttpClient) {}

  ngOnInit(): void { this.loadProducts(); }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => { this.products = products; this.loading = false; },
      error: () => { this.error = 'No se pudieron cargar los productos.'; this.loading = false; }
    });
  }

  addToCart(product: Product): void {
    this.error = '';
    this.message = '';
    const found = this.cart.find(item => item.product.id === product.id);
    if (found) {
      if (found.quantity >= product.stock) { this.error = 'Stock insuficiente.'; return; }
      found.quantity++;
    } else if (product.stock > 0) {
      this.cart.push({ product, quantity: 1, discount_percent: 0 });
    } else {
      this.error = 'Producto sin stock.';
    }
  }

  openProductModal(product: Product): void {
    this.selectedProduct = product;
  }

  closeProductModal(): void {
    this.selectedProduct = null;
  }

  addSelectedProductToCart(): void {
    const product = this.selectedProduct;
    if (!product) return;
    const alreadyInCart = this.cart.find(item => item.product.id === product.id);
    if ((alreadyInCart?.quantity || 0) >= product.stock) {
      this.error = 'Stock insuficiente.';
      return;
    }
    this.addToCart(product);
    this.closeProductModal();
  }

  removeFromCart(productId: number): void {
    this.cart = this.cart.filter(item => item.product.id !== productId);
  }

  clearCart(): void {
    if (!this.saving) this.cart = [];
  }

  changeQuantity(item: CartItem, value: number): void {
    const quantity = Number(value);
    item.quantity = Number.isInteger(quantity)
      ? Math.max(1, Math.min(quantity, item.product.stock)) : 1;
  }

  changeDiscount(item: CartItem, value: number): void {
    const percent = Number(value);
    item.discount_percent = Number.isFinite(percent)
      ? Math.round(Math.max(0, Math.min(10, percent)) * 100) / 100 : 0;
  }

  // Cálculo monetario en centavos (igual al backend).
  private priceCents(item: CartItem): number {
    return Math.round(Number(item.product.price) * 100);
  }

  private discountCents(item: CartItem): number {
    const subtotalCents = this.priceCents(item) * item.quantity;
    const percentHundredths = Math.round(item.discount_percent * 100);
    return Math.round(subtotalCents * percentHundredths / 10000);
  }

  getSubtotal(item: CartItem): number {
    return this.priceCents(item) * item.quantity / 100;
  }

  getDiscountAmount(item: CartItem): number {
    return this.discountCents(item) / 100;
  }

  getSubtotalWithDiscount(item: CartItem): number {
    return this.getSubtotal(item) - this.getDiscountAmount(item);
  }

  get totalDiscount(): number {
    return this.cart.reduce((sum, item) => sum + this.discountCents(item), 0) / 100;
  }

  get totalBeforeDiscount(): number {
    return this.cart.reduce((sum, item) => sum + this.priceCents(item) * item.quantity, 0) / 100;
  }

  get total(): number {
    return this.totalBeforeDiscount - this.totalDiscount;
  }

  createSale(): void {
    if (this.saving || this.cart.length === 0) return;
    this.error = '';
    this.message = '';
    this.saving = true;
    const payload = {
      user_id: 1,
      items: this.cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        discount_percent: item.discount_percent
      }))
    };
    this.http.post<{message:string; sale_id:number; total:string; total_discount:string}>('/api/sales', payload)
      .subscribe({
        next: response => {
          this.message = `Venta #${response.sale_id} registrada. Total: Bs ${response.total}. Descuento: Bs ${response.total_discount}`;
          this.cart = [];
          this.saving = false;
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) => {
          this.saving = false;
          this.error = err.error?.message || 'Error al registrar la venta.';
          this.loadProducts();
        }
      });
  }
}
