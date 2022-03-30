import { EmailService } from './../services/email.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id?: string;
  card?: Card;
  activateRoute: ActivatedRoute;
  service: CardService;
  event: string | undefined;

  constructor(
    private _activateRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private _service: CardService,
    private _emailService: EmailService,
    private titleService: Title
  ) { 
    this.activateRoute = _activateRoute;
    this.service = _service;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });
  }

  loadCard(){
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      //console.log("CARD: " + JSON.stringify(data));
      this.event = this.card!.event;
      this.titleService.setTitle(this.card?.name!);
    });
  }

  
  checkIfLoggedIn(id: any): void {
    let userDetails: string = localStorage.getItem('user')!;
    console.log(userDetails);
    if(userDetails == null || userDetails.length < 0) this.appComponent.openLoginDialog(id);
    else window.location.href = "/order/" + id;
  }
}
