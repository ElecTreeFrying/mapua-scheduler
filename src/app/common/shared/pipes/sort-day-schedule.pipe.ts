import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDaySchedule'
})
export class SortDaySchedulePipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any {
    
    if (value === undefined || args[0] === undefined) {
      return;
    }

    if (args.length > 0) {

      const newArgs: any[] = args[0].map((item) => item.day);
      const union = value.filter(a => newArgs.includes(a));
      
      return union;
    }
    
    
  }

}
