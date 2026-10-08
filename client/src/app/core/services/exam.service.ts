import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Exam } from '../models/exam.model';
import { Question } from '../models/question.model';
import { Result } from '../models/result.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:3000/api';

  exams = signal<Exam[]>([]);
  activeExam = signal<Exam | null>(null);

  constructor(private http: HttpClient) {}

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams`).pipe(
      tap(data => this.exams.set(data))
    );
  }

  scheduleExam(examData: Partial<Exam>): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams/schedule`, examData).pipe(
      tap(() => this.getExams().subscribe())
    );
  }

  getQuestions(examId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/exams/${examId}/questions`);
  }

  submitExam(examId: string, answers: Record<string, string>, warningCount: number, securityLogs: string[]): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/exams/${examId}/submit`, {
      answers,
      warningCount,
      securityLogs
    });
  }

  getMyResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/my-results`);
  }

  getAllResults(): Observable<Result[]> {
    return this.http.get<Result[]>(`${this.apiUrl}/results/all`);
  }
}
