import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `<router-outlet></router-outlet>`,
})
export class LandingComponent { }

const routes: Routes = [
  { path: '', component: LandingComponent, children: [
    { path: '', loadChildren: './signin/signin.module#SigninModule' },
    { path: 'register', loadChildren: './registration/registration.module#RegistrationModule' }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
