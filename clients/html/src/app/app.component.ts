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
  showIENotSupportiveMessage = false;
  blockIEBrowser = false;

  ngOnInit() {
    localStorage.removeItem('employerDetails');
    this.detectBrowser();
  }

  onDismiss() {
    this.showIENotSupportiveMessage = false;
  }

  detectBrowser() {
    const match = navigator.userAgent.search(/(?:MSIE|Trident\/.*; rv:)/);

    if (match !== -1) {
      // this.showIENotSupportiveMessage = true;
      this.blockIEBrowser = true;
    }
  }
}
