import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logo: string;

  constructor() { }

  ngOnInit(): void {
    this.logo = "/assets/images/logo_fibeigreetings.png";

    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.logo = element.logo;
      }
    });
    
  }

}
