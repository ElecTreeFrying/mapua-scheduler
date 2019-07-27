import { Pipe, PipeTransform } from '@angular/core';

import { FirestoreService } from '../../core/services/firestore.service';

@Pipe({
  name: 'checkIndicatorStudents'
})
export class CheckIndicatorStudentsPipe implements PipeTransform {

  constructor(
    private firestore: FirestoreService
  ) {}

  transform(value: any, ...sched: any[]): any {
    
    if (value === undefined) return;
    const _sched = sched[0][0];
    
    return this.firestore.checkIndicatorStudents(_sched, value);
  }

}
