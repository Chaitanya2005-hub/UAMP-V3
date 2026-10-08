export interface Grievance {
  id: string;
  studentId: string;
  studentName?: string;
  category: string;
  description: string;
  status: 'PENDING' | 'RESOLVED';
  submittedDate: string;
  resolutionNotes?: string;
}
