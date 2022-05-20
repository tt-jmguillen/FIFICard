import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  service: CardService;
  bestsellerCards: Card[] = [];
  cards: Card[] = [];
  randomBestsellerCards: Card[] = [];
  randomFeaturedBirthdayCards: Card[] = [];
  displayCards: Card[] = [];
  temp: any;
  page: number = 1;
  index: number;
  disablePrev: boolean;
  disableNext: boolean;

  constructor(
    private router: Router,
    private _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.router.navigate([element.main]);
      }
    });


  }

}
