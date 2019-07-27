import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProfessorRoutingModule } from './professor-routing.module';
import { MatProfessorModule } from '../../common/core/material-modules/mat-professor.module';
import { SharedProfStudentModule } from '../../common/core/modules/shared-prof-student.module';

import { ProfessorComponent } from './professor.component';
import { AddScheduleComponent } from '../../common/shared/componrnts/add-schedule/add-schedule.component';
import { ShowScheduleComponent } from '../../common/shared/componrnts/show-schedule/show-schedule.component';
import { UpdateScheduleComponent } from '../../common/shared/componrnts/update-schedule/update-schedule.component';
import { UpdateCalendarComponent } from '../../common/shared/componrnts/update-calendar/update-calendar.component';
import { ShowStudentsComponent } from '../../common/shared/componrnts/show-students/show-students.component';

import { CheckIndicatorStudentsPipe } from '../../common/shared/pipes/check-indicator-students.pipe';

@NgModule({
  declarations: [
    ProfessorComponent,
    AddScheduleComponent,
    ShowScheduleComponent,
    UpdateScheduleComponent,
    UpdateCalendarComponent,
    ShowStudentsComponent,
    
    CheckIndicatorStudentsPipe,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProfessorRoutingModule,
    MatProfessorModule,
    SharedProfStudentModule,
  ],
  entryComponents: [
    AddScheduleComponent,
    ShowScheduleComponent,
    UpdateScheduleComponent,
    UpdateCalendarComponent,
    ShowStudentsComponent,
  ]
})
export class ProfessorModule { }
