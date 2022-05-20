import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-bestseller',
  templateUrl: './home-bestseller.component.html',
  styleUrls: ['./home-bestseller.component.scss']
})
export class HomeBestsellerComponent implements OnInit {

  service: CardService;
  bestsellerCards: Card[] = [];
  randomBestsellerCards: Card[] = [];
  temp: any;
  
  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit(): void {

    console.log(">>>>>loadBestseller1");
    this.loadBestseller();
    const wait1 = window.setTimeout(() => {
      console.log(">>>>>loadBestseller2");
      this.bestsellerCards.sort(() => Math.random() - 0.5)  
      this.randomBestsellerCards = this.bestsellerCards.slice(0,8) 
      console.log("randomBestsellerCards: " + JSON.stringify(this.randomBestsellerCards));
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
