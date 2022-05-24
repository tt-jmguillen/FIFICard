import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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
    this.loadEvent();
  }

  loadEvent(){
    this.service.getCard(this.cardId!).subscribe(val => {
      this.cardEvent = val.event!;
      console.log("1>>>>cardEvent: " + JSON.stringify(this.cardEvent));
      this.getEventCard();
    });
  }

 getEventCard(){
  this.service.getCardsByEvent(this.cardEvent?.trim()!).then(data => {
    this.randomCards = [];
    let ctr = 1;
    data.forEach(async card => {
             this.randomCards.push(card);  
             this.getImage(card);
             if(ctr == data.length){ 
               this.loadBatch(1);
             }
             ctr = ctr+1;
    });
  });
 }


 getImage(card: Card){
    this.temp = this.getAvailableURL(card.primary!).then(url => {
        this.randomCards.forEach(value => {
           if(card.id == value.id){
             card.imageUrl = url;
           }
        })
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
