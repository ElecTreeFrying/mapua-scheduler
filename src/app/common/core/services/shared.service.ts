import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig
} from '@angular/material';
import * as Chance from 'chance';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private infinite = 99999999999;

  days = [ 'Su Sunday', 'M Monday', 'T Tuesday', 'W Wednesday', 'Th Thursday', 'F Friday', 'S Saturday' ];
  _days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
  
  schedule = { 'Sunday': [ 'Su' ], 'Monday': [ 'MWF', 'MW', 'M' ], 'Tuesday': [ 'TThS', 'TTh', 'T' ], 'Wednesday': [ 'MWF', 'MW', 'WF', 'W' ], 'Thursday': [ 'TThS', 'TTh', 'ThS', 'Th' ], 'Friday': [ 'MWF', 'WF', 'F' ], 'Saturday': [ 'TThS', 'ThS', 'S' ] };
  
  weeks = [ 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11'  ];

  monthConfig = [
    { month: 'May', start: 20, end: 31 },
    { month: 'June', start: 1, end: 30 },
    { month: 'July', start: 1, end: 31 },
    { month: 'August', start: 1, end: 4 }
  ]
  
  dates = [ 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31 ];
  
  daysSchedule = [ 'MWF', 'TThS', 'MW', 'WF', 'TTh', 'Su', 'M', 'T', 'W', 'Th', 'F', 'S' ];
  
  monthSchedule = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  
  times = [
    {
      name: '1.5 hr schedule',
      group: [ '0 7:30 - 9:00',  '1 9:00 - 10:30',  '2 10:30 - 12:00',  '3 12:00 - 1:30',  '4 1:30 - 3:00',  '5 3:00 - 4:30',  '6 4:30 - 6:00',  '7 6:00 - 7:30',  '8 7:30 - 9:00 (n)' ]
    }, {
      name: '3 hrs schedule',
      group: [ '0 7:30 - 10:30', '1 9:00 - 12:00', '2 10:30 - 1:30', '3 12:00 - 3:00', '4 1:30 - 4:30', '5 3:00 - 6:00', '6 4:30 - 7:30', '7 6:00 - 9:00' ]
    }, {
      name: '4.5 hrs schedule',
      group: [ '0 7:30 - 12:00', '1 12:00 - 4:30', '2 4:30 - 9:00' ]
    }
  ];
  
  timeId = [
    { time: '7:30 - 9:00', id: 0 },
    { time: '9:00 - 10:30', id: 1 },
    { time: '10:30 - 12:00', id: 2 },
    { time: '12:00 - 1:30', id: 3 },
    { time: '1:30 - 3:00', id: 4 },
    { time: '3:00 - 4:30', id: 5 },
    { time: '4:30 - 6:00', id: 6 },
    { time: '6:00 - 7:30', id: 7 },
    { time: '7:30 - 9:00 (n)', id: 8 },
    
    { time: '7:30 - 10:30', id: 1 },
    { time: '9:00 - 12:00', id: 2 },
    { time: '10:30 - 1:30', id: 3 },
    { time: '12:00 - 3:00', id: 4 },
    { time: '1:30 - 4:30', id: 5 },
    { time: '3:00 - 6:00', id: 6 },
    { time: '4:30 - 7:30', id: 7 },
    { time: '6:00 - 9:00', id: 8 },
    
    { time: '7:30 - 12:00', id: 1 },
    { time: '12:00 - 4:30', id: 2 },
    { time: '4:30 - 9:00', id: 3 },
  ]

  constructor(
    private snack: MatSnackBar,
  ) { }
  
  openSnackbar(message: string, duration: number = this.infinite) {
    
    const config = new MatSnackBarConfig();
    config.horizontalPosition = 'center';
    config.verticalPosition = 'bottom';
    config.duration = duration;
    
    this.snack.open(message, '', config)
  }
  
  checkRoute(assignment: string) {
    return assignment === 'professor' ? 'scheduler' : 'student-preview';
  }
  
  get generate(): string[] {
    return _.times(50, () => {
      const chance = new Chance();
      return chance.geohash({ length: 20 });
    });
  }
  
  get snackBarInstance() {
    return this.snack._openedSnackBarRef;
  }
  
  dismissSnackbar() {
    
    this.snack.dismiss();
  }
  
}
