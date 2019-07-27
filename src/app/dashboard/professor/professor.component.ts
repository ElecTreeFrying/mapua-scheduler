import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { AddScheduleComponent } from '../../common/shared/componrnts/add-schedule/add-schedule.component';
import { ShowScheduleComponent } from '../../common/shared/componrnts/show-schedule/show-schedule.component';
import { UpdateCalendarComponent } from '../../common/shared/componrnts/update-calendar/update-calendar.component';
import { ShowDayComponent } from '../../common/shared/componrnts/show-day/show-day.component';

import { FirestoreService } from '../../common/core/services/firestore.service';
import { AuthService } from '../../common/core/services/auth.service';
import { SharedService } from '../../common/core/services/shared.service';

@Component({
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.scss']
})
export class ProfessorComponent implements OnInit {

  days: string[];
  weeks: string[];
  list: any;
  isNoRipple: boolean = false;
  
  addScheduleComponent: MatDialogRef<AddScheduleComponent>;
  showScheduleComponent: MatDialogRef<ShowScheduleComponent>;
  updateCalendarComponent: MatDialogRef<UpdateCalendarComponent>;
  showDayComponent: MatDialogRef<ShowDayComponent>;
  
  constructor(
    private dialog: MatDialog,
    private firestore: FirestoreService,
    public auth: AuthService,
    private shared: SharedService,
  ) { }

  ngOnInit() {
    
    this.days = this.shared._days;
    this.weeks = this.shared.weeks;
    this.list = this.firestore.dataList();

    // this.firestore.testMe();
    // this.firestore.generate();
  }
  
  counter = 0
  onSelect(item: any) {
    
    this.counter = 0;
    this.firestore.daySchedule(item).subscribe((data) => {

      if (this.counter > 0) return;
      data.length !== 0
        ? this.dialog.open(ShowDayComponent, { data: {
          schedules: data,
          option: true
        }})
        : this.shared.openSnackbar('No schedule queue.', 4000);
      
        data.length !== 0 ? this.counter++ : 0;
      
    });
  }
  
  showSchedule() {
    
    var counter = 0;
    const obs = this.firestore.schedules.subscribe((data: any) => {

      data.length > 0 ? (() => {
        if (counter > 0) return;
        this.dialog.open(ShowScheduleComponent, { data: '' });
        counter++;
        obs.unsubscribe();
      })() : 0;
    });
  }
  
  addSchedule() {
    
    this.dialog.open(AddScheduleComponent, { data: '' })
  }
  
  updateCalendar() {
    
    this.dialog.open(UpdateCalendarComponent, { data: '' })
  }
  
}
