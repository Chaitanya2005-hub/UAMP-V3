import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ActiveProctorSession {
  studentId: string;
  studentName: string;
  erpId: string;
  department: string;
  examId: string;
  warningCount: number;
  frame: string | null;
  currentQuestion: number;
  lastUpdated: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProctoringService {
  private apiUrl = 'http://localhost:3000/api/proctor';

  warningCount = signal<number>(0);
  isWebcamActive = signal<boolean>(false);
  mediaStream: MediaStream | null = null;
  securityLogs = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  async startWebcam(): Promise<MediaStream | null> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      this.isWebcamActive.set(true);
      return this.mediaStream;
    } catch (err) {
      console.warn('WebCam access declined or unavailable:', err);
      this.isWebcamActive.set(false);
      return null;
    }
  }

  stopWebcam(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.isWebcamActive.set(false);
  }

  incrementWarning(reason: string): number {
    const nextCount = this.warningCount() + 1;
    this.warningCount.set(nextCount);
    const timestamp = new Date().toLocaleTimeString();
    this.securityLogs.update(logs => [...logs, `[${timestamp}] Strike #${nextCount}: ${reason}`]);
    return nextCount;
  }

  resetWarnings(): void {
    this.warningCount.set(0);
    this.securityLogs.set([]);
  }

  sendFrameStream(examId: string, frameDataUrl: string | null, currentQ: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/stream`, {
      examId,
      frame: frameDataUrl,
      warningCount: this.warningCount(),
      currentQuestion: currentQ,
      status: this.warningCount() >= 3 ? 'TERMINATED_VIOLATION' : 'ACTIVE'
    });
  }

  getActiveSessions(): Observable<ActiveProctorSession[]> {
    return this.http.get<ActiveProctorSession[]>(`${this.apiUrl}/active-sessions`);
  }

  sendProctorWarning(studentId: string, message: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-warning`, { studentId, message });
  }

  clearProctorMessages(): Observable<any> {
    return this.http.post(`${this.apiUrl}/clear-messages`, {});
  }
}
