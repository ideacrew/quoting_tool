import { Component, OnInit } from '@angular/core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomDateParserFormatter } from './custom_date_parser_formatter';
import Swal from 'sweetalert2';

@Component({
  providers: [{provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    localStorage.removeItem('employerDetails');
    this.detectBrowser();
  }

  detectBrowser() {
    const match = navigator.userAgent.search(/(?:MSIE|Trident\/.*; rv:)/);

    if (match !== -1) {
      this.showIEMessage();
    }
  }

  showIEMessage() {
    console.log('Internet Explorer Detected');
    Swal.fire({
      title: 'Unsupported Browser',
      text: 'Employer Quick Quote probably wont work great in Internet Explorer 11. We generally only support the recent versions of major browsers like Chrome, Firefox, Safari, and Edge.',
      icon: 'warning',
      showConfirmButton: false,
      showCancelButton: false,
      backdrop: true,
      allowOutsideClick: false
    });
  }
}
