import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-admin-manage-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">University Subjects & Course Directory</h1>
          <p class="text-xs text-slate-500">Manage department curriculum subjects & course codes</p>
        </div>

        <button (click)="showModal = true" class="btn btn-primary font-bold shadow-md">
          <i class="fa-solid fa-plus"></i> Add New Subject
        </button>
      </div>

      <!-- Table Card -->
      <div class="uamp-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">Course Code</th>
                <th class="p-3">Subject Name</th>
                <th class="p-3">Department</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let s of subjects" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ s.code }}</td>
                <td class="p-3 font-bold text-slate-900 dark:text-white">{{ s.name }}</td>
                <td class="p-3 font-medium">{{ s.department }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Subject Modal -->
      <div *ngIf="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Add Subject</h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form (ngSubmit)="createSubject()" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold mb-1">Subject Name</label>
              <input type="text" [(ngModel)]="newName" name="newName" required class="form-control" placeholder="e.g. Software Engineering">
            </div>
            <div>
              <label class="block font-bold mb-1">Subject Code</label>
              <input type="text" [(ngModel)]="newCode" name="newCode" required class="form-control" placeholder="e.g. CS305">
            </div>
            <div>
              <label class="block font-bold mb-1">Department</label>
              <input type="text" [(ngModel)]="newDept" name="newDept" required class="form-control" placeholder="e.g. Computer Science">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" (click)="showModal = false" class="btn btn-outline btn-sm">Cancel</button>
              <button type="submit" class="btn btn-primary btn-sm font-bold">Save Subject</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class ManageSubjectsComponent implements OnInit {
  http = inject(HttpClient);

  subjects: Subject[] = [];
  showModal: boolean = false;

  newName: string = '';
  newCode: string = '';
  newDept: string = 'Computer Science';

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.http.get<Subject[]>('http://localhost:3000/api/subjects').subscribe(res => {
      this.subjects = res;
    });
  }

  createSubject(): void {
    this.http.post('http://localhost:3000/api/subjects', {
      name: this.newName,
      code: this.newCode,
      department: this.newDept
    }).subscribe(() => {
      this.showModal = false;
      this.newName = '';
      this.newCode = '';
      this.loadSubjects();
    });
  }
}
