import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

import { AddStudentsComponent } from '../add-students/add-students.component';
import { ShowStudentsComponent } from '../show-students/show-students.component';

@Component({
  selector: 'app-show-day',
  templateUrl: './show-day.component.html',
  styleUrls: ['./show-day.component.scss']
})
export class ShowDayComponent implements OnInit {

  day: any;
  scheduleQueue: any;
  daysSchedule: any;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private shared: SharedService
  ) { }

  ngOnInit() {
    
    this.scheduleQueue = this.data.schedules;
    this.daysSchedule = this.shared.daysSchedule;
  }
  
  consultation(sched: any) {

    sched['user'] = this.data.user;
    
    this.dialog.open(AddStudentsComponent, { data: sched });
  }
  
  onShowList(sched: any) {
    
    this.dialog.open(ShowStudentsComponent, { data: sched });
  }
  
}
