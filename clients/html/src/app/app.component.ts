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
      this.showIENotSupportiveMessage = true;
      if (this.blockIEBrowser) {
        this.showIEMessage();
      }
    }
  }

  showIEMessage() {
    console.log('Internet Explorer Detected');
    Swal.fire({
      title: 'Unsupported Browser',
      html: `
        <div class="container" style="margin-top: 5px;">
          <div class="alert alert-success" role="alert">
            <h4 class="alert-heading"><strong>Your browser is not supported</strong></h4>
            <p>On June 01, 2020, HCB stopped supporting older versions of Internet Explorer. To use this website, please download the latest version of one of the compatible browsers below:</p>
            <br>
            <ul style="text-align: left;">
              <li><a href='https://www.microsoft.com/en-us/edge' target='_blank'>Microsoft Edge</a></li>
              <li><a href='https://www.google.com/chrome/' target='_blank'>Chrome</a></li>
              <li><a href='https://www.mozilla.org/en-US/firefox/' target='_blank'>Firefox</a></li>
              <li><a href='https://www.opera.com/download' target='_blank'>Opera</a></li>
            </ul>
            <hr>
            <p class="mb-0"><strong>Questions?</strong></p>
            <br>
            <p>Call customer service at 1-888-813-9220 (TTY: 711 for people who are deaf, hard of hearing, or speech disabled.) We’re available Monday through Friday, 8:00 a.m. to 6:00 p.m.</p>
          </div>
        </div>
      `,
      width: '1000px',
      showConfirmButton: false,
      showCancelButton: false,
      backdrop: true,
      allowOutsideClick: false
    });
  }
}
