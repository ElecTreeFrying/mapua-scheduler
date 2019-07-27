import { Injectable } from '@angular/core';
import {
  Router,
  RoutesRecognized, ResolveStart, NavigationStart,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  CanActivateChild
} from '@angular/router';
import { map } from 'rxjs/operators'

import { AuthService } from './auth.service';
import { AuthDbService } from './auth-db.service';

@Injectable({ providedIn: 'root' })
export class EntryGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
    private authdb: AuthDbService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.router.events.pipe(
      map((_router) => {
        // console.log(_router);
        if (_router instanceof RoutesRecognized) {
          // console.log(_router.url);
        } else if (_router instanceof ResolveStart) {
          // console.log('z');
        }
      })
    ).subscribe(() => 0);

    return this.authService.state.pipe(
      map((state) => {
        state === null ? this.router.navigate(['/']) : this.authdb.searchUserAssignmentByEmail(state).subscribe((res) => {
          const route = res === 'professor' ? 'scheduler' : 'student-preview';
          this.router.navigate(['/', route])
        });
        return state !== null;
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

}

@Injectable({ providedIn: 'root' })
export class ExitGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
    private authdb: AuthDbService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.router.events.pipe(
      map((_router) => {
        // console.log(_router);
        if (_router instanceof RoutesRecognized) {
          // console.log('----------------');
          // console.log('exit');
          // console.log(_router.url.substring(1));
          // console.log('----------------\n\n\n\n');
        }
        return true;
      })
    ).subscribe(() => 0);
    
    return this.authService.state.pipe(
      map((state: any) => {
        state !== null
          ? this.authdb.searchUserAssignmentByEmail(state).subscribe((res) => {
            const route = res === 'professor' ? 'scheduler' : 'student-preview';
            this.router.navigate(['/', route])
          }) : 0;
        return state === null;
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

}

@Injectable({ providedIn: 'root' })
export class ComponentGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return this.router.url === sessionStorage.getItem('option')
    return this.router.events.pipe(
      map((_router) => {
          // console.log(_router);
        if (_router instanceof NavigationStart || _router instanceof RoutesRecognized) {
          return _router.url === localStorage.getItem('route');
        }
      })
    )
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }

}
