export type FeeStatus = 'PENDING' | 'PARTIAL' | 'PAID';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'DISAPPROVED';

export interface Fee {
  id: string;
  studentId: string;
  studentName?: string;
  erpId?: string;
  department?: string;
  totalAmount: number;
  paidAmount: number;
  status: FeeStatus;
  approvalStatus: ApprovalStatus;
  transactionId?: string;
  paymentDate?: string;
}
