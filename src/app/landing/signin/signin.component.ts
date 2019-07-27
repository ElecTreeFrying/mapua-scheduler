import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { FirestoreService } from '../../common/core/services/firestore.service';
import { AuthService } from '../../common/core/services/auth.service';
import { AuthDbService } from '../../common/core/services/auth-db.service';
import { SharedService } from '../../common/core/services/shared.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  isShowIndicator: boolean = false;
  
  constructor(
    @Inject(FormBuilder) public fb: FormBuilder,
    private router: Router,
    private firestore: FirestoreService,
    private auth: AuthService,
    private authdb: AuthDbService,
    private shared: SharedService
  ) {
    this.signinForm = fb.group({
      'email': [ '' ],
      'password': [ '' ],
      'radio': [ '' ],
    })
  }

  ngOnInit() {
    // this.firestore.generate()
    // this.firestore.testMe()
  }
  
  onSubmit() {
    
    this.isShowIndicator = true;
    const form = this.signinForm.value;
    form['assignment'] = form['radio'] ? 'professor' : 'student';
    delete form['radio'];
    
    this.auth.signin(form).then((user) => {

      
      this.authdb.searchUserAssignment(user).subscribe((res) => {
      
        const route = this.shared.checkRoute(res);
        this.router.navigate(['/', route]).then(() => {
          this.shared.openSnackbar('Successfully signed in.', 4000);
        })
        localStorage.setItem('route', `/${route}`);
      });
      
      
    }).catch((e) => {
      
      this.isShowIndicator = false;
      const message = e.message;
      const code = e.code;
      
      this.shared.openSnackbar(code, 2000);
      setTimeout(() => {
        this.shared.openSnackbar(message, 10000);
      }, 2000);
    })
  }

}
