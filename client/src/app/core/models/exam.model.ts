export type ExamStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED';

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  subjectName?: string;
  examDate: string;
  startTime: string;
  durationMinutes: number;
  status: ExamStatus;
}
