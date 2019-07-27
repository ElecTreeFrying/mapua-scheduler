import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { AuthService } from '../../../core/services/auth.service';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-update-calendar',
  templateUrl: './update-calendar.component.html',
  styleUrls: ['./update-calendar.component.scss']
})
export class UpdateCalendarComponent implements OnInit {

  update: FormGroup;
  dates = []
  monthSchedule = [];
  number = 0;
  user: any;

  constructor(
    @Inject(FormBuilder) public fb: FormBuilder,
    private dialog: MatDialog,
    private auth: AuthService,
    private firestore: FirestoreService,
    private schared: SharedService
  ) {
    this.update = fb.group({
      'set1': fb.group({
        'month': [ 'May' ],
        // 'month': [ '' ],
        'start': [ '' ],
        'end': [ '' ],
      }),
      'set2': fb.group({
        'month': [ 'June' ],
        // 'month': [ '' ],
        'start': [ '' ],
        'end': [ '' ],
      }),
      'set3': fb.group({
        'month': [ 'July' ],
        // 'month': [ '' ],
        'start': [ '' ],
        'end': [ '' ],
      }),
      'set4': fb.group({
        'month': [ 'August' ],
        // 'month': [ '' ],
        'start': [ '' ],
        'end': [ '' ],
      }),
    })
  }

  ngOnInit() {
    this.dates = this.schared.dates;
    this.monthSchedule = this.schared.monthSchedule;
    
    this.update.valueChanges.subscribe((res) => {
    
      this.number =
        ( res.set1.end - res.set1.start ) + 4
        + ( res.set2.end - res.set2.start )
        + ( res.set3.end - res.set3.start )
        + ( res.set4.end - res.set4.start );

    });
    
    this.auth.onlineUserData().subscribe((res) => {
    
      this.user = res;
    });
  }
  
  onSubmit() {

    const updateForm = this.update.value;
    
    const set1 = updateForm['set1'].month;
    const set2 = updateForm['set2'].month;
    const set3 = updateForm['set3'].month;
    const set4 = updateForm['set4'].month;
    
    console.log('z');
    
    if (this.number !== 77 || set1 === '' || set2 === '' || set3 === '' || set4 === '') {
      this.schared.openSnackbar('Please try again.', 4000)
    } else {
      this.firestore.resetSchedule(false, updateForm, this.user);
      this.dialog.closeAll();
    }

  }

}
