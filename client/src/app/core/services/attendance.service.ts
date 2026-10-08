import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance, LiveCode } from '../models/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'http://localhost:3000/api';

  liveCode = signal<LiveCode | null>(null);

  constructor(private http: HttpClient) {}

  getTeacherQrCode(): Observable<LiveCode> {
    return this.http.get<LiveCode>(`${this.apiUrl}/teacher/qr-code`);
  }

  markStudentAttendance(code: string, qrToken?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/student/attendance/mark`, { code, qrToken });
  }

  getMyAttendanceHistory(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>(`${this.apiUrl}/student/attendance/my-history`);
  }
}
