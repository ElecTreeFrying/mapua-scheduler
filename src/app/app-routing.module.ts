import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntryGuard, ExitGuard } from './common/core/services/route-guard.service';

const routes: Routes = [
  { path: '', loadChildren: './landing/landing.module#LandingModule', canActivate: [ ExitGuard ] },
  { path: 'scheduler', loadChildren: './dashboard/professor/professor.module#ProfessorModule', canActivate: [ EntryGuard ] },
  { path: 'student-preview', loadChildren: './dashboard/student/student.module#StudentModule', canActivate: [ EntryGuard ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
