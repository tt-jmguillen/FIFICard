import { getDownloadURL } from '@angular/fire/storage';
import { EmailService } from './../services/email.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';
import { AppComponent } from '../app.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id?: string;
  card: Card;
  activateRoute: ActivatedRoute;
  service: CardService;
  event: string | undefined;
  elementEvent: string;

  constructor(
    private _activateRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private _service: CardService,
    private _emailService: EmailService,
    private titleService: Title,
    private router: Router
  ) { 
    this.activateRoute = _activateRoute;
    this.service = _service;
  }

  ngOnInit(): void {
    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.elementEvent = element.event;
      }
    });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });
  }

  loadCard(){
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.event = this.card!.event;
      this.titleService.setTitle(this.card?.name!);
    });
  }

  
  checkIfLoggedIn(id: any): void {
    let userDetails: string = localStorage.getItem('user')!;
    if(userDetails == null || userDetails.length < 0) {
      this.appComponent.openLoginDialog(id);
    }
    else {
      this.router.navigate(['/order', id]);
    }
  }
}
