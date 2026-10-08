import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6 animate-fade-in max-w-6xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white font-heading">User Management Directory</h1>
          <p class="text-xs text-slate-500">Manage Students, Faculty, and Admin accounts</p>
        </div>

        <button (click)="showCreateModal = true" class="btn btn-primary font-bold shadow-md">
          <i class="fa-solid fa-user-plus"></i> Add New User Account
        </button>
      </div>

      <!-- User List Table -->
      <div class="uamp-card">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead class="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th class="p-3">User Profile</th>
                <th class="p-3">Username</th>
                <th class="p-3">ERP Roll ID</th>
                <th class="p-3">Role</th>
                <th class="p-3">Department</th>
                <th class="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <tr *ngFor="let u of users" class="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                <td class="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <img [src]="u.photoPath || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'" [alt]="u.fullName" class="w-8 h-8 rounded-full object-cover">
                  {{ u.fullName }}
                </td>
                <td class="p-3 font-mono">{{ u.username }}</td>
                <td class="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{{ u.erpId }}</td>
                <td class="p-3">
                  <span [ngClass]="{
                    'badge-success': u.role === 'STUDENT',
                    'badge-info': u.role === 'TEACHER',
                    'badge-warning': u.role === 'ADMIN'
                  }" class="badge">
                    {{ u.role }}
                  </span>
                </td>
                <td class="p-3 font-medium">{{ u.department }}</td>
                <td class="p-3 text-right">
                  <button (click)="deleteUser(u.id)" class="btn btn-outline btn-sm text-rose-500 border-rose-200 dark:border-rose-900">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add User Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Create New User Account</h3>
            <button (click)="showCreateModal = false" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form (ngSubmit)="createUser()" class="space-y-3 text-xs">
            <div>
              <label class="block font-bold mb-1">Full Name</label>
              <input type="text" [(ngModel)]="newFullName" name="newFullName" required class="form-control">
            </div>
            <div>
              <label class="block font-bold mb-1">Username</label>
              <input type="text" [(ngModel)]="newUsername" name="newUsername" required class="form-control">
            </div>
            <div>
              <label class="block font-bold mb-1">Role</label>
              <select [(ngModel)]="newRole" name="newRole" class="form-control">
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher / Faculty</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div>
              <label class="block font-bold mb-1">Department</label>
              <input type="text" [(ngModel)]="newDept" name="newDept" required class="form-control">
            </div>

            <div class="pt-3 flex items-center justify-end gap-2">
              <button type="button" (click)="showCreateModal = false" class="btn btn-outline btn-sm">Cancel</button>
              <button type="submit" class="btn btn-primary btn-sm font-bold">Create User</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class ManageUsersComponent implements OnInit {
  http = inject(HttpClient);

  users: User[] = [];
  showCreateModal: boolean = false;

  newFullName: string = '';
  newUsername: string = '';
  newRole: UserRole = 'STUDENT';
  newDept: string = 'Computer Science';

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<User[]>('http://localhost:3000/api/users').subscribe(res => {
      this.users = res;
    });
  }

  createUser(): void {
    this.http.post('http://localhost:3000/api/users', {
      fullName: this.newFullName,
      username: this.newUsername,
      role: this.newRole,
      department: this.newDept
    }).subscribe(() => {
      this.showCreateModal = false;
      this.newFullName = '';
      this.newUsername = '';
      this.loadUsers();
    });
  }

  deleteUser(id: string): void {
    this.http.delete(`http://localhost:3000/api/users/${id}`).subscribe(() => {
      this.loadUsers();
    });
  }
}
