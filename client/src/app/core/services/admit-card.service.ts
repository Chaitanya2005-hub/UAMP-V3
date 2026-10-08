import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdmitCard } from '../models/admit-card.model';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class AdmitCardService {
  private apiUrl = 'http://localhost:3000/api';

  myAdmitCard = signal<AdmitCard | null>(null);

  constructor(private http: HttpClient) {}

  getMyAdmitCard(): Observable<AdmitCard> {
    return this.http.get<AdmitCard>(`${this.apiUrl}/student/admit-card/me`);
  }

  getAllAdmitCards(): Observable<AdmitCard[]> {
    return this.http.get<AdmitCard[]>(`${this.apiUrl}/admin/admit-cards`);
  }

  updateAdmitCardStatus(studentId: string, status: 'BLOCKED' | 'RELEASED', remarks?: string): Observable<AdmitCard> {
    return this.http.post<AdmitCard>(`${this.apiUrl}/admin/admit-cards/${studentId}/status`, {
      status,
      remarks
    });
  }

  generateAdmitCardPdf(card: AdmitCard): void {
    const doc = new jsPDF();

    // University Header Banner
    doc.setFillColor(79, 70, 229); // Primary Indigo
    doc.rect(0, 0, 210, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('UNIVERSITY ASSESSMENT & MASTERY PORTAL', 105, 14, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('OFFICIAL EXAMINATIONS HALL TICKET / ADMIT CARD — ACADEMIC YEAR 2026', 105, 23, { align: 'center' });

    // Decorative Bar
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 32, 210, 4, 'F');

    // Student Details Frame
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 182, 75, 4, 4, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('CANDIDATE INFORMATION', 22, 57);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate Name: ${card.studentName || 'Student'}`, 22, 68);
    doc.text(`ERP Roll Number: ${card.erpId || 'N/A'}`, 22, 76);
    doc.text(`Department: ${card.department || 'Engineering'}`, 22, 84);
    doc.text(`Academic Year: ${card.year || '3rd Year'}`, 22, 92);
    doc.text(`Issue Date: ${card.issueDate || '2026-10-01'}`, 22, 100);
    doc.text(`Admit Card Status: ${card.status}`, 22, 108);

    // Photo Box Placeholder
    doc.setDrawColor(79, 70, 229);
    doc.rect(145, 53, 40, 50);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('VERIFIED', 165, 75, { align: 'center' });
    doc.text('CANDIDATE PHOTO', 165, 82, { align: 'center' });

    // Scheduled Examinations Table
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('SCHEDULED EXAMINATION PAPERS', 14, 133);

    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 138, 182, 10, 'F');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text('Subject Code', 20, 144);
    doc.text('Subject Name', 60, 144);
    doc.text('Date', 130, 144);
    doc.text('Session', 165, 144);

    // Table Rows
    const schedule = [
      { code: 'CS301', name: 'Database Management Systems', date: '2026-10-15', session: '10:00 AM' },
      { code: 'CS302', name: 'Artificial Intelligence & ML', date: '2026-10-07', session: '02:00 PM' },
      { code: 'CS303', name: 'Computer Networks & Security', date: '2026-10-20', session: '11:00 AM' }
    ];

    let y = 155;
    schedule.forEach((row, i) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(row.code, 20, y);
      doc.text(row.name, 60, y);
      doc.text(row.date, 130, y);
      doc.text(row.session, 165, y);
      doc.setDrawColor(241, 245, 249);
      doc.line(14, y + 3, 196, y + 3);
      y += 12;
    });

    // Important Proctoring Instructions
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(79, 70, 229);
    doc.text('IMPORTANT PROCTORING RULES & INSTRUCTIONS:', 14, 210);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('1. Candidates must enable WebCam access prior to starting online examinations.', 14, 218);
    doc.text('2. Strictly prohibited to switch tabs or minimize browser during active exam (3-Strike rule applies).', 14, 224);
    doc.text('3. Hall ticket is non-transferable and must be verified by proctor dashboard.', 14, 230);

    // Footer Seal & Signature
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Controller of Examinations', 150, 260);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('University Assessment & Mastery Portal', 150, 265);

    doc.save(`AdmitCard_${card.erpId || 'Student'}.pdf`);
  }
}
