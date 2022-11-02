import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coverageType'
})
export class CoverageTypePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let name: any;
    switch (value) {
      case 'both':
        name = 'Both';
        break;
      case 'healthOnly':
        name = 'Health Only';
        break;
      case 'dentalOnly':
        name = 'Dental Only';
        break;
    }
    return name;
  }

}
