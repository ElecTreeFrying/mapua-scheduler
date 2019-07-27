import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { ShowDayComponent } from '../../common/shared/componrnts/show-day/show-day.component';

import { FirestoreService } from '../../common/core/services/firestore.service';
import { AuthService } from '../../common/core/services/auth.service';
import { SharedService } from '../../common/core/services/shared.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  days: string[];
  weeks: string[];
  list: any;
  users: any;
  online: any;
  professor: any;
  isNoRipple: boolean = false;
  
  showDayComponent: MatDialogRef<ShowDayComponent>;
  
  constructor(
    private dialog: MatDialog,
    public firestore: FirestoreService,
    public auth: AuthService,
    private shared: SharedService,
  ) { }

  ngOnInit() {
    
    this.days = this.shared._days;
    this.weeks = this.shared.weeks;
    this.list = this.firestore.dataList();
    
    this.firestore.users.subscribe((res) => {
    
      this.users = res;
    });
    
    this.auth.onlineUserData().subscribe((res) => {
    
      this.online = res;
    });
    
    // this.firestore.testMe()
  }
  
  onSearch(user: any) {
    
    this.list = this.firestore.dataList(user.name);
  }
  
  counter = 0
  onSelect(item: any) {
    
    this.counter = 0;
    this.firestore.daySchedule(item, this.professor).subscribe((data) => {
      
      if (this.counter > 0) return;
      data.length !== 0
        ? this.dialog.open(ShowDayComponent, { data: {
          schedules: data,
          user: this.professor,
          option: false
        }})
        : this.shared.openSnackbar('No schedule queue.', 4000);
      
      data.length !== 0 ? this.counter++ : 0;
      
    });
  }

}
