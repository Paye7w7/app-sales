import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SaleDetail {
  product: string | null;
  quantity: number;
  subtotal: string;
  discount_percent: string;
  discount_amount: string;
  subtotal_with_discount: string;
}

export interface Sale {
  id: number;
  total: string;
  total_discount: string;
  created_at: string;
  details: SaleDetail[];
}

@Injectable({ providedIn: 'root' })
export class SaleService {
  private apiUrl = '/api/sales';
  constructor(private http: HttpClient) {}
  getSales(): Observable<Sale[]> { return this.http.get<Sale[]>(this.apiUrl); }
  deleteSale(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
