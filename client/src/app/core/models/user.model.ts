export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  erpId: string;
  year?: string;
  department: string;
  section?: string;
  photoPath?: string;
  approvalStatus?: 'APPROVED' | 'PENDING';
}
