import { Component, OnInit, Input } from '@angular/core';
import { EmployerDetailsService } from './../services/employer-details.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() display_footer_email: boolean;
  constructor(
    private employerDetailsService: EmployerDetailsService
  ) {}

  ngOnInit() {
    this.employerDetailsService.getFeatureFlags().subscribe((response) => {
      this.display_footer_email = response['display_footer_email'];
    });
  }
}
