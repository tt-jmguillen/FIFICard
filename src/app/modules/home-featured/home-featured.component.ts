import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent implements OnInit {
  @Input() homeCardEvent?: string;

  service: CardService;
  cards: Card[] = [];
  randomCards: Card[] = [];
  displayCards: Card[] = [];
  page: number = 1;
  index: number;
  disablePrev: boolean;
  disableNext: boolean;
  temp: any;
  imageUrl: string[] = [];
  cardEvent: string;

  constructor(private _service: CardService) { 
    this.service = _service;
  }

  ngOnInit() {
    console.log(">>>>>loadEvent1");
    this.loadEvent();

    const wait2 = window.setTimeout(() => {
        console.log(">>>>>loadEvent2");
        //console.log("cards: " + JSON.stringify(this.cards));
        this.cards.sort(() => Math.random() - 0.5)  
        this.randomCards = this.cards.slice(0,12)   
        this.loadBatch(1);
    }, 15000);
  }

  loadEvent(){
    this.service.getCards().then(data => {
     
      this.cards = [];
      data.forEach(card => {
        if (card.event){
          //console.log("card.event: " + JSON.stringify(card.event));
          card.event.split(",").forEach(async event => {
            //console.log("event.trim(): " + event.trim() + "this.homeCardEvent?.trim(): " + this.homeCardEvent?.trim());
            if(event.trim() == this.homeCardEvent?.trim())
            { 
              console.log("card: " + JSON.stringify(card));
              let image = card!.primary;
              if(image){
                this.temp = await this.getAvailableURL(image).then(url => {
                  return url;
                });
              }
               //console.log("temp: " + JSON.stringify(this.temp));
               card.imageUrl  = this.temp; 
               this.cards.push(card);  
           }
          }) 
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

  loadBatch(_index: number){
    this.displayCards = [];
    if(_index==1){
      for(let i = 0; i <= 2; i++){
        this.displayCards.push(this.randomCards[i]);
        this.disablePrev = true;
        this.disableNext = (this.randomCards.length>2) ? false : true;
      }
    } else if(_index==2){
      for(let i = 3; i <= 5; i++){
        this.displayCards.push(this.randomCards[i]);
        this.disablePrev = false;
        this.disableNext = (this.randomCards.length>5) ? false : true;
      }
    } else if(_index==3){
      for(let i = 6; i <= 8; i++){
        this.displayCards.push(this.randomCards[i]);
        this.disablePrev = false;
        this.disableNext = (this.randomCards.length>8) ? false : true;
      }
    }else{
      for(let i = 9; i <= 11; i++){
        this.displayCards.push(this.randomCards[i]);
        this.disablePrev = false;
        this.disableNext = true;
      }
    }
  }

  leftClick(){
    this.page-=1;
    this.loadBatch(this.page);
  }

  
  rightClick(){
    this.page+=1;
    this.loadBatch(this.page);
  }



}
