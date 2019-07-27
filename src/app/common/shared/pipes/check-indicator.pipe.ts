import { Pipe, PipeTransform } from '@angular/core';

import { FirestoreService } from '../../core/services/firestore.service';
import { map } from 'rxjs/operators'

@Pipe({
  name: 'checkIndicator'
})
export class CheckIndicatorPipe implements PipeTransform {

  constructor(
    private firestore: FirestoreService
  ) {}

  transform(value: any, ...sched: any[]): any {
    
    const _sched = sched[0][0];
    const option = sched[0][1];
    
    return this.firestore.checkIndicator(_sched).pipe(
      map((a) => a[option])
    );
  }

}
