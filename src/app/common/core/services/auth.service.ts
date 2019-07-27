import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators'

import { AuthDbService } from './auth-db.service';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  state: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AngularFireAuth,
    private db: AuthDbService,
    private shared: SharedService
  ) {
    this.state = auth.authState;
    
    auth.authState.subscribe((res) => {
      console.log(res);
    });
    
    this.onlineUserData().subscribe((res) => {
      if (!res) return;
      console.log(res.assignment, res.name);
    });
  }
  
  onlineUserData() {
    const users = this.db.users.snapshotChanges().pipe(
      map((db) => {
        return db.map((fire) => {
          const doc = fire.payload.doc;
          return { id: doc.id, ...doc.data() };
        })
      })
    )
    
    return this.auth.user.pipe(
      switchMap((state) => {
        return users.pipe(
          map((_users) => {
            if (state === null) return;
            return _users.filter(e => e.email === state.email).map((f) => {
              console.log();
              if (f['assignment'] === 'professor') {
                f['name'] = `${f['title']} ${f['firstname']} ${f['lastname']}`
                return f;
              } else {
                f['name'] = `${f['firstname']} ${f['lastname']}`
                return f;
              }
            })[0];
          })
        )
      })
    )
  }
  
  signup(data: any) {
    return this.auth.auth.createUserWithEmailAndPassword(data.email, data.password).then((state) => {
      data['uid'] = state.user.uid;
      this.db.createUser(data);
      return data;
    })
  }
  
  signin(data: any) {
    return this.auth.auth.signInWithEmailAndPassword(data.email, data.password).then(() => data)
  }
  
  signout() {
    return this.auth.auth.signOut().then(() => {
      this.router.navigate(['/']).then(() => {
        this.shared.openSnackbar('Successfully signed out.', 4000)
      });
    })
  }
  
  
}
