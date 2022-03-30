import { Component, Input, OnInit } from '@angular/core';
import { timeStamp } from 'console';
import { arrayRemove } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { delay } from 'rxjs';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { Page } from 'src/app/stickers/stickers.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.scss']
})
export class SuggestionListComponent implements OnInit {
  @Input() cardId?: string;
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
   
    this.loadEvent();;

    const wait2 = window.setTimeout(() => {
        //console.log("3>>>>>loadBatch");
        //console.log("cards: " + JSON.stringify(this.cards));
        this.cards.sort(() => Math.random() - 0.5)  
        this.randomCards = this.cards.slice(0,12)   
        this.loadBatch(1);
    }, 15000);
  }

  loadEvent(){
    this.service.getCard(this.cardId!).subscribe(val => {
      this.cardEvent = val.event!;
      //console.log("1>>>>cardEvent: " + JSON.stringify(this.cardEvent));
    });

    this.service.getCards().then(data => {
      //console.log("2>>>>>loadEvent");
      this.cards = [];
      data.forEach(card => {
        if (card.event){
          card.event.split(",").forEach(async event => {
            if(event.trim() == this.cardEvent)
            { 
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
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
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
