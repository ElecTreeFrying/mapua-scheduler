import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-show-students',
  templateUrl: './show-students.component.html',
  styleUrls: ['./show-students.component.scss']
})
export class ShowStudentsComponent implements OnInit {

  students: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public _data: any,
    private firestore: FirestoreService,
    private shared: SharedService
  ) { }

  ngOnInit() {
    
    this.firestore.getStudentsByGroup(this._data).subscribe((data) => {
    
      this.students = data;
    });
  }
  
  accept(data: any) {
    
    const id = data.students[0].groupname;
    this.firestore.acceptStudents(id, this._data, this.students);
  }
  
  rejectRemove(data: any, option: boolean) {
            
    const id = data.students[0].groupname;
    this.firestore.rejectRemoveStudents(id, this._data, option);
  }
  
}
