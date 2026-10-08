import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fee } from '../models/fee.model';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  private apiUrl = 'http://localhost:3000/api';

  myFeeStatus = signal<Fee | null>(null);

  constructor(private http: HttpClient) {}

  getMyFeeStatus(): Observable<Fee> {
    return this.http.get<Fee>(`${this.apiUrl}/fees/my-status`);
  }

  getAllFees(): Observable<Fee[]> {
    return this.http.get<Fee[]>(`${this.apiUrl}/admin/fees`);
  }

  editFee(studentId: string, totalAmount: number, paidAmount: number): Observable<Fee> {
    return this.http.post<Fee>(`${this.apiUrl}/admin/fees/edit`, {
      studentId,
      totalAmount,
      paidAmount
    });
  }

  approveFee(feeId: string, approvalStatus: 'APPROVED' | 'DISAPPROVED'): Observable<Fee> {
    return this.http.post<Fee>(`${this.apiUrl}/admin/fees/${feeId}/approve`, {
      approvalStatus
    });
  }
}
