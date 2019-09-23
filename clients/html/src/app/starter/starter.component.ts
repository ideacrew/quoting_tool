import { Component, OnInit } from '@angular/core';

// We use the below service to get all data from the Rails backend
import { SampleService } from '../services/sample.service';

@Component({
  templateUrl: './starter.component.html',
  // We use the below provide the serive to the component
  providers: [SampleService]
})
export class StarterComponent implements OnInit {
  subtitle: any;

  constructor(private sampleService: SampleService) { }

  ngOnInit() {
    this.getWelcomeMessage();
  }

  // Calls on the sample service to get the message
  getWelcomeMessage() {
    this.sampleService.getMessage()
    .subscribe(
        message => {
          this.subtitle = message;
        },
        err => console.log(err)
      )
  }

}
