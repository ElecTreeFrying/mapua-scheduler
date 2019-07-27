import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';
import { MatStudentModule } from '../../common/core/material-modules/mat-student.module';
import { SharedProfStudentModule } from '../../common/core/modules/shared-prof-student.module';

import { StudentComponent } from './student.component';

@NgModule({
  declarations: [
    StudentComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    StudentRoutingModule,
    MatStudentModule,
    SharedProfStudentModule,
  ]
})
export class StudentModule { }
