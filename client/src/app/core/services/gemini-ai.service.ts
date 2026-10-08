import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

export interface AiQuestionResponse {
  source: 'GEMINI_API' | 'FALLBACK_GENERATOR';
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class GeminiAiService {
  private apiUrl = 'http://localhost:3000/api/teacher';

  constructor(private http: HttpClient) {}

  generateQuestions(examId: string, count: number, topicFocus: string, difficultyLevel: string): Observable<AiQuestionResponse> {
    return this.http.post<AiQuestionResponse>(`${this.apiUrl}/auto-generate-questions`, {
      examId,
      count,
      topicFocus,
      difficultyLevel
    });
  }
}
