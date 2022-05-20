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

    console.log(">>>>>loadBestseller1");
    this.loadBestseller();
    const wait1 = window.setTimeout(() => {
      console.log(">>>>>loadBestseller2");
      this.bestsellerCards.sort(() => Math.random() - 0.5)  
      this.randomBestsellerCards = this.bestsellerCards.slice(0,8) 
    }, 15000);

  }


  loadBestseller(){
    this.service.getCards().then(data => {
      this.bestsellerCards = [];
      data.forEach(async card => {
         if (card.bestseller){
               let image = card!.primary;
              if(image){
                this.temp = await this.getAvailableURL(image).then(url => {
                  return url;
                });
              }
               card.imageUrl  = this.temp; 
               this.bestsellerCards.push(card);  
         }
      });
    });
  }

  getAvailableURL(image: string): Promise<string>{
    return new Promise((resolve, rejects) => {
      this.service.getImageURL(image + environment.imageSize.small).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        });
      });
    });
  }

}
