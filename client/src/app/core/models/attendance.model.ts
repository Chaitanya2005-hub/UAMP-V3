export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  time?: string;
  subject?: string;
  status: 'PRESENT' | 'ABSENT';
}

export interface LiveCode {
  id?: string;
  code: string;
  qrDataUrl?: string;
  createdAt: number;
  expiresAt: number;
}
