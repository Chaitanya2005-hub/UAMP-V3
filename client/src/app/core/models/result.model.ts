export interface Result {
  id: string;
  studentId: string;
  examId: string;
  examTitle?: string;
  score: number;
  totalMarks: number;
  percentage?: number;
  status: 'PASSED' | 'FAILED';
  securityWarnings: string[];
}
