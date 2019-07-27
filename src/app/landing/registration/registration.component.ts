import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, take, debounceTime } from 'rxjs/operators';

import { AuthService } from '../../common/core/services/auth.service';
import { SharedService } from '../../common/core/services/shared.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  signupForm: FormGroup;
  current: string;
  option: string;
  isShow: boolean = true;
  isShowIndicator: boolean = false;
  
  constructor(
    @Inject(FormBuilder) public fb: FormBuilder,
    private router: Router,
    private afs: AngularFirestore,
    private auth: AuthService,
    private shared: SharedService,
  ) {
    this.signupForm = fb.group({
      'title': [ 'Engr.', [ Validators.required, Validators.minLength(2) ] ],
      'firstname': [ '', [ Validators.required, Validators.minLength(2) ] ],
      'lastname': [ '', [ Validators.required, Validators.minLength(2) ] ],
      'email': [ '', [ Validators.required, Validators.email ] ],
      'password': [ '', [ Validators.required, Validators.minLength(6) ] ],
      'confirm': [ '', [ Validators.required, this.confirmCheck.bind(this) ] ],
      'radio': [ true ],
      'code': [ '', [ Validators.required, Validators.minLength(20), Validators.maxLength(20) ], CustomValidator.accessCodeValid(this.afs) ],
    })
  }

  get titleErr() { return this.signupForm.get('title').errors; }
  get firstnameErr() { return this.signupForm.get('firstname').errors; }
  get lastnameErr() { return this.signupForm.get('lastname').errors; }
  get emailErr() { return this.signupForm.get('email').errors; }
  get passwordErr() { return this.signupForm.get('password').errors; }
  get confirmErr() { return this.signupForm.get('confirm').errors; }
  get radioErr() { return this.signupForm.get('radio').errors; }
  get codeErr() { return this.signupForm.get('code').errors; }
  get codeStat() { return this.signupForm.get('code').status; }

  ngOnInit() {
    this.option = 'professor';
    localStorage.setItem('reg-opt', this.option);
    
    this.signupForm.valueChanges.subscribe((res) => {
      this.isShow = res.radio;
      this.current = res['password'];
      
      this.option = res.radio ? 'professor' : 'student';
      localStorage.setItem('reg-opt', this.option);
    });
    
    this.signupForm.get('password').valueChanges.subscribe(() => {
      this.signupForm.patchValue({ confirm: '' });
    });
  }
  
  onRadioChange() {
    
    this.signupForm.patchValue({ code: '' });
  }
  
  onSubmit() {
    
    this.isShowIndicator = true;
    const form = this.signupForm.value;
    const check = form['radio'] ? 'professor' : 'student';
    
    form['assignment'] = check;
    delete form['radio'];
    delete form['repeat'];
    
    if (check === 'student') { delete form['title']; }
    
    this.auth.signup(form).then((user) => {
      
      const route = this.shared.checkRoute(user.assignment);
      this.signupForm.patchValue({ confirm: this.current })
      this.router.navigate(['/', route])
      localStorage.setItem('route', `/${route}`);
      this.shared.openSnackbar('Successfully created an account.', 4000);
    }).catch((e) => {
      
      this.isShowIndicator = false;
      this.signupForm.patchValue({
        password: '',
        confirm: '',
        code: ''
      })
      const message = e.message;
      const code = e.code;
      
      this.shared.openSnackbar(code, 2000);
      setTimeout(() => {
        this.shared.openSnackbar(message, 10000);
      }, 2000);
    });
  }
  
  private confirmCheck(control: AbstractControl): ValidationErrors | null {
    const condition = control.value === this.current;
    return condition ? null : { isNotMatched: true };
  }

}

export class CustomValidator {
  
  static accessCodeValid(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      if (!control.value) return null;
      const code = control.value.toLowerCase();
      const assignment = localStorage.getItem('reg-opt');
      
      return afs.collection('access-codes', (ref) => {
        return ref.where('key', '==', code)
          .where('isTaken', '==', false)
          .where('assignment', '==', assignment)
      })
        .valueChanges().pipe(
          debounceTime(500),
          take(1),
          map(arr => arr.length < 1 ? { isTaken: true } : null)
        );;
    }
  }

}
