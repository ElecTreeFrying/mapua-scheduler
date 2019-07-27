import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RegistrationRoutingModule } from './registration-routing.module';
import { MatRegistrationModule } from '../../common/core/material-modules/mat-registration.module';

import { RegistrationComponent } from './registration.component';
import { CheckComponent } from './check/check.component';

@NgModule({
  declarations: [
    RegistrationComponent,
    CheckComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RegistrationRoutingModule,
    MatRegistrationModule
  ]
})
export class RegistrationModule { }
