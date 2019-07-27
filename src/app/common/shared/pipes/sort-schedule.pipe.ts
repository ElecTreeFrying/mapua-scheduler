import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortSchedule'
})
export class SortSchedulePipe implements PipeTransform {

  transform(value: any[], ...args: any[]): any {
    
    if (value === undefined) {
      return [];
    }
      
    const newValue = value.filter((val) => val['day'] === args[0]);
    
    return newValue;
  }

}
