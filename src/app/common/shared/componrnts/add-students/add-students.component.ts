import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA
} from '@angular/material';

import { FirestoreService } from '../../../core/services/firestore.service';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-add-students',
  templateUrl: './add-students.component.html',
  styleUrls: ['./add-students.component.scss']
})
export class AddStudentsComponent implements OnInit {
  
  studentForm: FormGroup;
  student: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(FormBuilder) public fb: FormBuilder,
    private firestore: FirestoreService,
    private shared: SharedService,
  ) {
    this.studentForm = fb.group({
      'groupname': '',
      'student': this.fb.array([ this.newStudent(), this.newStudent(), this.newStudent() ]),
      'purpose': '',
    })
  }
 
  ngOnInit() {
  }
  
  newStudent(): FormGroup {
    return this.fb.group({
      'firstname': '',
      'lastname': '',
    })
  }
  
  get formData() {
    return <FormArray>this.studentForm.get('student')
  }
  
  addStudent() {
    
    this.student = this.studentForm.get('student') as FormArray;
    
    if (this.student.length > 9) {
      this.shared.openSnackbar('Maximum number of student reached.', 3000)
      return;
    }
    
    this.student.push(this.newStudent());
  }
  
  onSubmit() {
    
    const data = this.studentForm.value;
    
    const update = {
      ...data,
      pushId: this.data.pushId,
      status: '',
      indicator: 'orange',
      date: this.data.date,
      day: this.data.day,
      month: this.data.month,
      professor: this.data.user.name
    };

    this.shared.openSnackbar(`Successfully added ${data.groupname}.`, 3000);
    this.firestore.addStudent(update);
  }
  
  onEnter(event: any) {
    if(event.keyCode == 13) {
      this.onSubmit();
    }
  }

}
