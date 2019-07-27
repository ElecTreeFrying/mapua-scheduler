import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatProfessorModule } from '../material-modules/mat-professor.module';

import { ShowDayComponent } from '../../shared/componrnts/show-day/show-day.component';
import { AddStudentsComponent } from '../../shared/componrnts/add-students/add-students.component';

import { SortSchedulePipe } from '../../shared/pipes/sort-schedule.pipe';
import { SortDaySchedulePipe } from '../../shared/pipes/sort-day-schedule.pipe';
import { SortScheduleByTimePipe } from '../../shared/pipes/sort-schedule-by-time.pipe';
import { BorderAddPipe } from '../../shared/pipes/border-add.pipe';

import { CheckIndicatorPipe } from '../../shared/pipes/check-indicator.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatProfessorModule
  ],
  declarations: [
    ShowDayComponent,
    AddStudentsComponent,
    
    SortDaySchedulePipe,
    SortScheduleByTimePipe,
    SortSchedulePipe,
    BorderAddPipe,
    CheckIndicatorPipe,
  ],
  exports: [
    SortDaySchedulePipe,
    SortScheduleByTimePipe,
    SortSchedulePipe,
    BorderAddPipe,
  ],
  entryComponents: [
    ShowDayComponent,
    AddStudentsComponent,
  ]
})
export class SharedProfStudentModule { }
