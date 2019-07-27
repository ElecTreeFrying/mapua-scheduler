import { Inject, Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.scss']
})
export class UpdateScheduleComponent implements OnInit {

  updateForm: FormGroup;
  daysSchedule: string[];
  times: any[];
  scheduleQueue: any;
    
    
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(FormBuilder) public fb: FormBuilder,
    private firestore: FirestoreService,
    private shared: SharedService
  ) {
    this.updateForm = fb.group({
      'day': [ '', [ Validators.required ] ],
      'time': [ '', [ Validators.required ] ],
      'course': [ '', [ Validators.required ] ],
      'section': [ '', [ Validators.required ] ],
      'room': [ '', [ Validators.required ] ]
    });
  }
  
  get dayErr() { return this.updateForm.get('day').errors; }
  get timeErr() { return this.updateForm.get('time').errors; }
  get courseErr() { return this.updateForm.get('course').errors; }
  get sectionErr() { return this.updateForm.get('section').errors; }
  get roomErr() { return this.updateForm.get('room').errors; }
  
  ngOnInit() {
    this.scheduleQueue = this.firestore.schedules;
    this.daysSchedule = this.shared.daysSchedule;

    this.times = this.shared.times;
    this.times = this.shared.times.map((doc) => {
      
      const group = doc.group.map((_group) => {
        if (Number(_group.slice(0, 3).trim()) > 9) {
          return _group.slice(3);
        } else { return _group.slice(2); }
      });
      
      const group2 = doc.group.map((_group) => {
        if (Number(_group.slice(0, 3).trim()) > 9) {
          return _group.slice(0, 1);
        } else { return _group[0]; }
      });
      
      return { name: doc.name, group, group2, old: doc.group };
    });
    
    this.firestore.findSchedule(this.data).subscribe((res) => {
      
      this.updateForm.patchValue({
        day: res.day,
        time: res.time,
        course: res.course,
        section: res.section,
        room: res.room
      })
    });;
  }
  
  onSubmit() {

    if (this.updateForm.invalid) return;
    
    let schedule = this.updateForm.value;
    schedule['course'] = schedule['course'].toUpperCase();
    schedule['section'] = schedule['section'].toUpperCase();
    schedule['room'] = schedule['room'].toUpperCase();
    schedule.professor = '';
    schedule.label = `${schedule.day} / ${schedule.time}`;
    schedule.id = this.data

    this.firestore.updateSchedule = schedule;
    this.dialog.closeAll();
  }

}
