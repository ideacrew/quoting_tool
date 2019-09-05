import { Component } from '@angular/core';
@Component({
  selector: 'app-te',
  templateUrl: './te.component.html'
})
export class TotalEarningComponent {
  constructor() { }

  totalearnings: Object[] = [
    {
      image: 'assets/images/users/1.jpg',
      name: 'Andrew Simon',
      labelcolor: 'badge-light-info text-info',
      amount: '$2600'
    },
    {
      image: 'assets/images/users/2.jpg',
      name: 'Daniel Kristeen',
      labelcolor: 'badge-light-success text-success',
      amount: '$2300'
    },
    {
      image: 'assets/images/users/3.jpg',
      name: 'Dany John',
      labelcolor: 'badge-light-danger text-danger',
      amount: '$1200'
    },
    {
      image: 'assets/images/users/4.jpg',
      name: 'Chris gyle',
      labelcolor: 'badge-light-warning text-warning',
      amount: '$4400'
    },
    {
      image: 'assets/images/users/5.jpg',
      name: 'Jane Doe',
      labelcolor: 'badge-light-danger text-danger',
      amount: '$2500'
    }
  ];
}
