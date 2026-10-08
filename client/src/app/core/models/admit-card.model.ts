export type AdmitCardStatus = 'BLOCKED' | 'RELEASED';

export interface AdmitCard {
  id: string;
  studentId: string;
  studentName?: string;
  erpId?: string;
  department?: string;
  year?: string;
  status: AdmitCardStatus;
  issueDate?: string;
  remarks?: string;
}
