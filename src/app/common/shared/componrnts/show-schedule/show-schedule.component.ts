import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { UpdateScheduleComponent } from '../update-schedule/update-schedule.component';

import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-show-schedule',
  templateUrl: './show-schedule.component.html',
  styleUrls: ['./show-schedule.component.scss']
})
export class ShowScheduleComponent implements OnInit {

  scheduleQueue: any;
  daysSchedule: any;
  
  updateScheduleComponent: MatDialogRef<UpdateScheduleComponent>;

  constructor(
    private dialog: MatDialog,
    private firestore: FirestoreService,
    private shared: SharedService
  ) { }

  ngOnInit() {
    
    this.firestore.schedules.subscribe((data: any) => {

      this.scheduleQueue = data;
    });
    
    this.daysSchedule = this.shared.daysSchedule;
  }
  
  updateSchedule(id: string) {

    this.updateScheduleComponent = this.dialog.open(UpdateScheduleComponent, { data: id });
  }
  
  removeSchedule(id: string) {
    this.firestore.removeSchedule = id;
    
    const obs = this.firestore.schedules.subscribe((data: any) => {

      data.length > 0 ? (() => {
        obs.unsubscribe();
      })() : 0;
    });
  }

}
