import { Component, OnInit } from '@angular/core';
import { Sale, SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  loading = false;
  deletingId: number | null = null;
  pendingDeleteId: number | null = null;
  error = '';
  message = '';

  constructor(private saleService: SaleService) {}

  ngOnInit(): void { this.loadSales(); }

  loadSales(): void {
    this.loading = true;
    this.error = '';
    this.saleService.getSales().subscribe({
      next: (data) => { this.sales = data; this.loading = false; },
      error: () => { this.error = 'No se pudo cargar el historial de ventas.'; this.loading = false; }
    });
  }

  openDeleteModal(id: number): void {
    if (this.deletingId === null) this.pendingDeleteId = id;
  }

  cancelDelete(): void {
    if (this.deletingId === null) this.pendingDeleteId = null;
  }

  confirmDelete(): void {
    const id = this.pendingDeleteId;
    if (id === null || this.deletingId !== null) return;

    this.deletingId = id;
    this.error = '';
    this.message = '';
    this.saleService.deleteSale(id).subscribe({
      next: (response) => {
        this.message = response.message;
        this.deletingId = null;
        this.pendingDeleteId = null;
        this.loadSales();
      },
      error: () => {
        this.error = 'No se pudo eliminar la venta.';
        this.deletingId = null;
      }
    });
  }
}
