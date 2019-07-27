import { Pipe, PipeTransform } from '@angular/core';

import { FirestoreService } from '../../core/services/firestore.service';

@Pipe({
  name: 'borderAdd'
})
export class BorderAddPipe implements PipeTransform {

  constructor(
    private firestore: FirestoreService
  ) {}

  transform(value: any, ...args: any[]): any {
    
    const day = args[0][0];
    const user = args[0][1];
    
    return this.firestore.checkContainStudents(day, user);
  }

}
