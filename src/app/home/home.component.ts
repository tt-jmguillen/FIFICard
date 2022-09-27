import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
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
  images: string[] =[];

  constructor(
    private router: Router,
    private _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.carousel.cycle();
    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.router.navigate([element.main]);
      }
    });


  }

}
