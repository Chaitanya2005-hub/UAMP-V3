import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { LoginComponent } from './features/auth/login/login.component';

// Student
import { StudentLayoutComponent } from './features/student/student-layout.component';
import { StudentDashboardComponent } from './features/student/dashboard/dashboard.component';
import { ExamListComponent } from './features/student/exam-list/exam-list.component';
import { ExamInterfaceComponent } from './features/student/exam-interface/exam-interface.component';
import { AttendanceComponent as StudentAttendanceComponent } from './features/student/attendance/attendance.component';
import { AdmitCardComponent as StudentAdmitCardComponent } from './features/student/admit-card/admit-card.component';
import { FeeDetailsComponent } from './features/student/fee-details/fee-details.component';
import { ResultsComponent } from './features/student/results/results.component';
import { GrievancesComponent } from './features/student/grievances/grievances.component';

// Teacher
import { TeacherLayoutComponent } from './features/teacher/teacher-layout.component';
import { TeacherDashboardComponent } from './features/teacher/dashboard/dashboard.component';
import { UploadQuestionsComponent } from './features/teacher/upload-questions/upload-questions.component';
import { MarkAttendanceComponent as TeacherMarkAttendanceComponent } from './features/teacher/mark-attendance/mark-attendance.component';
import { LiveProctoringComponent } from './features/teacher/live-proctoring/live-proctoring.component';
import { StudentProgressComponent } from './features/teacher/student-progress/student-progress.component';

// Admin
import { AdminLayoutComponent } from './features/admin/admin-layout.component';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users.component';
import { ScheduleExamComponent } from './features/admin/schedule-exam/schedule-exam.component';
import { ManageAdmitCardsComponent } from './features/admin/manage-admit-cards/manage-admit-cards.component';
import { AdminFeesComponent } from './features/admin/admin-fees/admin-fees.component';
import { ManageSubjectsComponent } from './features/admin/manage-subjects/manage-subjects.component';
import { LiveMonitoringComponent } from './features/admin/live-monitoring/live-monitoring.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Student Routes
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'STUDENT' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'exams', component: ExamListComponent },
      { path: 'exam-interface/:id', component: ExamInterfaceComponent },
      { path: 'attendance', component: StudentAttendanceComponent },
      { path: 'admit-card', component: StudentAdmitCardComponent },
      { path: 'fee-details', component: FeeDetailsComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'grievances', component: GrievancesComponent }
    ]
  },

  // Teacher Routes
  {
    path: 'teacher',
    component: TeacherLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'TEACHER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: TeacherDashboardComponent },
      { path: 'upload-questions', component: UploadQuestionsComponent },
      { path: 'mark-attendance', component: TeacherMarkAttendanceComponent },
      { path: 'live-proctoring', component: LiveProctoringComponent },
      { path: 'student-progress', component: StudentProgressComponent }
    ]
  },

  // Admin Routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'manage-users', component: ManageUsersComponent },
      { path: 'schedule-exam', component: ScheduleExamComponent },
      { path: 'manage-admit-cards', component: ManageAdmitCardsComponent },
      { path: 'fees', component: AdminFeesComponent },
      { path: 'manage-subjects', component: ManageSubjectsComponent },
      { path: 'live-monitoring', component: LiveMonitoringComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
