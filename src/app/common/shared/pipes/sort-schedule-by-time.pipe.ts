import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

import { SharedService } from '../../core/services/shared.service';

@Pipe({
  name: 'sortScheduleByTime'
})
export class SortScheduleByTimePipe implements PipeTransform {

  constructor(
    private shared: SharedService
  ) {}

  transform(value: any[], ...args: any[]): any {
    
    const timeId: any[] = this.shared.timeId;
    
    const data = value.map((val) => {
      val['_time'] = timeId.filter(e => e.time === val.time)[0].id;
      return val;
    });
    
    return _.sortBy(data, [ a => a['_time'] ])
  }

}
