import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (args[0] === 'asc') {
      return value.sort((a, b) => parseFloat(a.sponsor_cost) - parseFloat(b.sponsor_cost));
    } else if (args[0] === 'desc') {
      return value.sort((a, b) => parseFloat(b.sponsor_cost) - parseFloat(a.sponsor_cost));
    }
  }

}
