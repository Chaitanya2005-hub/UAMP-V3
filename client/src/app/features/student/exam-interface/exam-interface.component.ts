import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../core/services/exam.service';
import { ProctoringService } from '../../../core/services/proctoring.service';
import { Question } from '../../../core/models/question.model';
import { Result } from '../../../core/models/result.model';

@Component({
  selector: 'app-exam-interface',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 text-white flex flex-col justify-between select-none relative font-sans">
      
      <!-- Hidden Canvas for Proctoring WebCam Snapshots -->
      <canvas #snapshotCanvas width="320" height="240" class="hidden"></canvas>

      <!-- 2ND STRIKE HIGH-PRIORITY WARNING BANNER -->
      <div *ngIf="proctoringService.warningCount() === 2" 
           class="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 text-white py-3 px-6 text-center text-xs sm:text-sm font-extrabold flex items-center justify-center gap-3 animate-bounce shadow-xl z-50">
        <i class="fa-solid fa-triangle-exclamation text-lg animate-pulse"></i>
        <span>HIGH-PRIORITY SECURITY ALERT: 2 TAB SWITCH VIOLATIONS RECORDED. 1 MORE SWITCH WILL FORCE SUBMIT & TERMINATE EXAM IMMEDIATELY!</span>
      </div>

      <!-- 1ST STRIKE MODAL WARNING -->
      <div *ngIf="showModalWarning" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
        <div class="bg-slate-900 border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl shadow-rose-900/50">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center text-3xl mx-auto">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <h3 class="text-xl font-extrabold text-white">PROCTORING WARNING — STRIKE #1</h3>
            <p class="text-xs text-rose-300 font-semibold mt-1">Focus loss / Tab switch detected</p>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Switching tabs or minimizing your browser window is strictly prohibited during proctored examinations. This incident has been logged for faculty review.
          </p>
          <button (click)="dismissModalWarning()" class="w-full btn btn-primary py-3 font-bold bg-rose-600 hover:bg-rose-500">
            I Understand & Resume Examination
          </button>
        </div>
      <!-- DIRECT PROCTOR INTERVENTION WARNING MODAL -->
      <div *ngIf="incomingProctorWarning" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
        <div class="bg-slate-900 border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl shadow-amber-900/50">
          <div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto">
            <i class="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <h3 class="text-xl font-extrabold text-white">DIRECT PROCTOR INSTRUCTION</h3>
            <p class="text-xs text-amber-300 font-semibold mt-1">Live intervention from exam administrator</p>
          </div>
          <div class="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-amber-200 text-xs font-semibold leading-relaxed">
            "{{ incomingProctorWarning }}"
          </div>
          <button (click)="dismissProctorWarning()" class="w-full btn btn-primary py-3 font-bold bg-amber-600 hover:bg-amber-500 text-white">
            Acknowledge & Comply
          </button>
        </div>
      </div>

      <!-- Top Exam Navigation Bar -->
      <header class="bg-slate-900/90 border-b border-slate-800 px-6 py-4 flex items-center justify-between z-30 sticky top-0">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold">
            <i class="fa-solid fa-shield-halved text-xl"></i>
          </div>
          <div>
            <h1 class="text-base font-bold text-white leading-none">DBMS Mid-Semester Proctored Examination 2026</h1>
            <p class="text-xs text-slate-400 mt-1">Anti-Cheat Live WebCam Proctoring Active</p>
          </div>
        </div>

        <!-- Timer & Proctoring Status Badges -->
        <div class="flex items-center gap-4">
          
          <!-- Warning Strikes Counter -->
          <div [ngClass]="{
            'bg-slate-800 text-slate-300 border-slate-700': proctoringService.warningCount() === 0,
            'bg-amber-500/20 text-amber-400 border-amber-500/40': proctoringService.warningCount() === 1,
            'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse': proctoringService.warningCount() >= 2
          }" class="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Strikes: {{ proctoringService.warningCount() }} / 3</span>
          </div>

          <!-- Countdown Timer -->
          <div class="bg-indigo-950/80 border border-indigo-500/40 px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-indigo-300 flex items-center gap-2 shadow-inner">
            <i class="fa-solid fa-stopwatch text-indigo-400"></i>
            <span>{{ formatTimer(secondsRemaining) }}</span>
          </div>

          <!-- Submit Exam Button -->
          <button (click)="submitExam()" class="btn btn-danger btn-sm px-4">
            <i class="fa-solid fa-check-double"></i> Submit Exam
          </button>
        </div>
      </header>

      <!-- Main Examination Interface Content -->
      <main class="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        
        <!-- Left 3 Cols: Question & Options Display -->
        <div class="lg:col-span-3 space-y-6">
          
          <!-- Loading State -->
          <div *ngIf="isLoadingQuestions" class="bg-slate-900/80 border border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-2xl">
            <div class="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center text-2xl mx-auto animate-spin">
              <i class="fa-solid fa-spinner"></i>
            </div>
            <h3 class="text-base font-bold text-white">Loading Proctored Examination Question Paper...</h3>
            <p class="text-xs text-slate-400">Verifying security parameters & fetching question set from database</p>
          </div>

          <div *ngIf="!isLoadingQuestions && questions.length > 0 && currentQuestionIndex < questions.length" class="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <!-- Question Header -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
              <span class="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
              </span>
              <span class="text-xs font-mono text-slate-500">Weight: 10 Marks</span>
            </div>

            <!-- Question Text -->
            <h2 class="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {{ currentQuestion.questionText }}
            </h2>

            <!-- Options Grid -->
            <div class="space-y-3 pt-2">
              <button *ngFor="let opt of ['A', 'B', 'C', 'D']" 
                      (click)="selectAnswer(opt)"
                      [ngClass]="{
                        'bg-indigo-600/30 border-indigo-500 text-white shadow-lg shadow-indigo-600/20': selectedAnswers[currentQuestion.id] === opt,
                        'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600': selectedAnswers[currentQuestion.id] !== opt
                      }"
                      class="w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group">
                <span [ngClass]="{
                  'bg-indigo-600 text-white': selectedAnswers[currentQuestion.id] === opt,
                  'bg-slate-700 text-slate-300 group-hover:bg-slate-600': selectedAnswers[currentQuestion.id] !== opt
                }" class="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0">
                  {{ opt }}
                </span>
                <span class="text-sm font-medium">{{ getOptionText(currentQuestion, opt) }}</span>
              </button>
            </div>

            <!-- Question Navigation Footer -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-800">
              <button (click)="prevQuestion()" [disabled]="currentQuestionIndex === 0" 
                      class="btn btn-outline btn-sm text-slate-300 border-slate-700 disabled:opacity-30">
                <i class="fa-solid fa-arrow-left"></i> Previous
              </button>
              
              <div class="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none">
                <button *ngFor="let q of questions; let i = index" 
                        (click)="goToQuestion(i)"
                        [ngClass]="{
                          'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400': currentQuestionIndex === i,
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40': selectedAnswers[q.id] && currentQuestionIndex !== i,
                          'bg-slate-800 text-slate-400 border border-slate-700': !selectedAnswers[q.id] && currentQuestionIndex !== i
                        }"
                        class="w-7 h-7 rounded-lg text-xs transition-all flex items-center justify-center">
                  {{ i + 1 }}
                </button>
              </div>

              <button (click)="nextQuestion()" [disabled]="currentQuestionIndex === questions.length - 1"
                      class="btn btn-primary btn-sm disabled:opacity-30">
                Next <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>

          </div>

        </div>

        <!-- Right 1 Col: Live Proctoring WebCam Stream Container -->
        <div class="space-y-6">
          
          <div class="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-4">
            
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live WebCam Feed
              </h3>
              <span class="text-[10px] text-emerald-400 font-mono">ENCRYPTED STREAM</span>
            </div>

            <!-- Video Player -->
            <div class="proctor-video-box rounded-2xl overflow-hidden bg-black relative aspect-video border border-indigo-500/30 shadow-inner">
              <video #webcamVideo autoplay muted playsinline class="w-full h-full object-cover"></video>
              <div *ngIf="!proctoringService.isWebcamActive()" class="absolute inset-0 flex items-center justify-center bg-slate-950/90 text-xs text-rose-400 text-center p-4">
                <span>WebCam Disconnected or Access Denied</span>
              </div>
              <div class="proctor-live-badge">
                <span class="proctor-live-dot"></span> PROCTOR ACTIVE
              </div>
            </div>

            <!-- Proctoring Log Container -->
            <div class="space-y-2">
              <h4 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security Logs</h4>
              <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 h-32 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300">
                <p class="text-emerald-400">[00:00:01] Session initiated. WebCam verified.</p>
                <p class="text-slate-400">[00:00:02] Anti-Cheat focus listener active.</p>
                <p *ngFor="let log of proctoringService.securityLogs()" class="text-rose-400 font-semibold">
                  {{ log }}
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <!-- Footer Bar -->
      <footer class="p-3 text-center text-xs text-slate-500 bg-slate-900 border-t border-slate-800 z-30">
        UAMP Anti-Cheat Engine • 3-Strike Rule Enforced • Do Not Switch Tabs or Minimize Browser Window
      </footer>

    </div>
  `
})
export class ExamInterfaceComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  examService = inject(ExamService);
  proctoringService = inject(ProctoringService);

  @ViewChild('webcamVideo') webcamVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('snapshotCanvas') snapshotCanvasRef!: ElementRef<HTMLCanvasElement>;

  examId: string = 'ex-101';
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswers: Record<string, string> = {};

  isLoadingQuestions: boolean = true;
  secondsRemaining: number = 45 * 60; // 45 mins
  timerInterval: any;
  proctorStreamInterval: any;
  showModalWarning: boolean = false;
  incomingProctorWarning: string | null = null;

  get currentQuestion(): Question {
    return this.questions[this.currentQuestionIndex] || {
      id: 'q-default',
      examId: this.examId,
      questionText: 'Loading question paper...',
      optionA: 'Option A',
      optionB: 'Option B',
      optionC: 'Option C',
      optionD: 'Option D',
      correctAnswer: 'A'
    };
  }

  // 1. ATTACH TAB SWITCH & BLUR LISTENERS
  @HostListener('window:blur')
  onWindowBlur(): void {
    this.handleFocusViolation('Window focus lost / Tab switched');
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (document.hidden) {
      this.handleFocusViolation('Browser tab hidden / Minimized');
    }
  }

  ngOnInit(): void {
    this.proctoringService.resetWarnings();
    this.examId = this.route.snapshot.params['id'] || 'ex-101';
    this.isLoadingQuestions = true;

    this.examService.getQuestions(this.examId).subscribe({
      next: (qs) => {
        this.isLoadingQuestions = false;
        if (qs && qs.length > 0) {
          this.questions = qs;
        } else {
          this.questions = this.getDefaultQuestionPaper();
        }
      },
      error: () => {
        this.isLoadingQuestions = false;
        this.questions = this.getDefaultQuestionPaper();
      }
    });

    // Start WebCam
    this.initWebcam();

    // Start Timer
    this.timerInterval = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
      } else {
        this.submitExam();
      }
    }, 1000);

    // Periodic Stream to Backend (every 4 seconds)
    this.proctorStreamInterval = setInterval(() => {
      this.pushStreamSnapshot();
    }, 4000);
  }

  getDefaultQuestionPaper(): Question[] {
    return [
      {
        id: `q-sys-1`,
        examId: this.examId,
        questionText: 'Which relational database component guarantees ACID transactions through Two-Phase Locking (2PL)?',
        optionA: 'Query Execution Planner',
        optionB: 'Concurrency Control & Lock Manager',
        optionC: 'Buffer Pool Cache Manager',
        optionD: 'Redo Log File Writer',
        correctAnswer: 'B'
      },
      {
        id: `q-sys-2`,
        examId: this.examId,
        questionText: 'What is the primary operational benefit of B+ Tree indexing over standard Binary Search Trees in storage engines?',
        optionA: 'B+ Tree keeps all data records strictly inside interior nodes',
        optionB: 'Leaf nodes form a contiguous doubly-linked list enabling fast sequential range scans',
        optionC: 'B+ Tree disables disk I/O operations entirely',
        optionD: 'B+ Tree eliminates the requirement for primary key constraints',
        correctAnswer: 'B'
      },
      {
        id: `q-sys-3`,
        examId: this.examId,
        questionText: 'In natural language processing and neural networks, what mechanism calculates attention weights across input tokens?',
        optionA: 'Convolutional Pooling Operation',
        optionB: 'Self-Attention Softmax Mechanism',
        optionC: 'Recurrent Hidden Loop',
        optionD: 'Stochastic Gradient Descent',
        correctAnswer: 'B'
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.proctorStreamInterval) clearInterval(this.proctorStreamInterval);
    this.proctoringService.stopWebcam();
  }

  async initWebcam(): Promise<void> {
    const stream = await this.proctoringService.startWebcam();
    if (stream && this.webcamVideoRef) {
      this.webcamVideoRef.nativeElement.srcObject = stream;
    }
  }

  handleFocusViolation(reason: string): void {
    const strike = this.proctoringService.incrementWarning(reason);

    if (strike === 1) {
      // 1st Strike: Modal Warning
      this.showModalWarning = true;
    } else if (strike === 2) {
      // 2nd Strike: Banner active in template
      this.showModalWarning = false;
    } else if (strike >= 3) {
      // 3rd Strike: FORCE SUBMIT & TERMINATE
      alert('SECURITY VIOLATION TERMINATION: You have reached 3 Strike Tab-Switch violations. Your examination is being force submitted.');
      this.submitExam();
    }

    this.pushStreamSnapshot();
  }

  dismissModalWarning(): void {
    this.showModalWarning = false;
  }

  dismissProctorWarning(): void {
    this.incomingProctorWarning = null;
    this.proctoringService.clearProctorMessages().subscribe();
  }

  pushStreamSnapshot(): void {
    let frameUrl: string | null = null;
    if (this.snapshotCanvasRef && this.webcamVideoRef && this.proctoringService.isWebcamActive()) {
      const canvas = this.snapshotCanvasRef.nativeElement;
      const video = this.webcamVideoRef.nativeElement;
      const ctx = canvas.getContext('2d');
      if (ctx && video.videoWidth > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        frameUrl = canvas.toDataURL('image/jpeg', 0.5);
      }
    }

    this.proctoringService.sendFrameStream(this.examId, frameUrl, this.currentQuestionIndex + 1).subscribe(res => {
      if (res && res.messages && res.messages.length > 0) {
        const latest = res.messages[res.messages.length - 1];
        this.incomingProctorWarning = latest.text;
      }
    });
  }

  selectAnswer(option: string): void {
    if (this.currentQuestion) {
      this.selectedAnswers[this.currentQuestion.id] = option;
    }
  }

  getOptionText(q: Question, opt: string): string {
    if (opt === 'A') return q.optionA;
    if (opt === 'B') return q.optionB;
    if (opt === 'C') return q.optionC;
    if (opt === 'D') return q.optionD;
    return '';
  }

  goToQuestion(idx: number): void {
    this.currentQuestionIndex = idx;
    this.pushStreamSnapshot();
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.pushStreamSnapshot();
    }
  }

  prevQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.pushStreamSnapshot();
    }
  }

  submitExam(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.proctorStreamInterval) clearInterval(this.proctorStreamInterval);

    this.examService.submitExam(
      this.examId,
      this.selectedAnswers,
      this.proctoringService.warningCount(),
      this.proctoringService.securityLogs()
    ).subscribe((res: Result) => {
      this.proctoringService.stopWebcam();
      this.router.navigate(['/student/results']);
    });
  }

  formatTimer(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
