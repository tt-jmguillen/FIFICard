import { Component, OnInit } from '@angular/core';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';

export class Page
{
  public index: number;
  public start: number;
  public end: number;
  public display: string;
  public showing: string;
  public selected: boolean;

  constructor(_index: number){
    this.index = _index;
  }
}

@Component({
  selector: 'app-sign-and-send-cards',
  templateUrl: './sign-and-send-cards.component.html',
  styleUrls: ['./sign-and-send-cards.component.scss']
})
export class SignAndSendCardsComponent implements OnInit {
  cardService: CardService;
  cards: Card[] = [];
  displayCards: Card[] = [];
  pages: Page[] = [];
  index: number;
  batchLimit: number = 36;
  batchCount: number = 0;
  batchShowing: string = '';
  disablePrev: boolean;
  disableNext: boolean;

  constructor(
    _cardService: CardService
  ) { 
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(){
    this.cardService.getSignAndSendCards().then(cards => {
      this.cards = cards;
      this.initializeBatch();
      this.loadBatch(1);
    })
  }

  initializeBatch(){
    if (this.cards.length > this.batchLimit){
      this.batchCount = Math.trunc(this.cards.length / this.batchLimit);
      if (this.batchCount < (this.cards.length / this.batchLimit)){
        this.batchCount++;
      }
    }
    else{
      this.batchCount = 1;
    }

    for(let i = 1; i <= this.batchCount; i++){
      let page: Page = new Page(i);
      page.end = i * this.batchLimit;
      if (page.end > this.cards.length)
        page.end = this.cards.length;
      if (this.cards.length > this.batchLimit)
        page.start = page.end - (this.batchLimit - 1);
      else
      page.start = 1;
      page.display = `Page ${i} of ${this.batchCount}`;
      page.showing = `Showing ${page.start} - ${page.end} to ${this.cards.length} items`;
      this.pages.push(page);
    }
  }

  loadBatch(_index: number){
    this.index = _index;
    this.pages.forEach(page => {
      if (page.index == this.index){
        page.selected = true;
        this.displayCards = [];
        for(let i = page.start - 1; i <= page.end - 1; i++){
          this.displayCards.push(this.cards[i]);
        }
        this.batchShowing = page.showing;
      }
      else{
        page.selected = false;
      }
    });
    if (this.index == 1){
      this.disablePrev = false;
      this.disableNext = true;
    }
    else if (this.index == this.batchCount){
      this.disablePrev = true;
      this.disableNext = false;
    }
    else{
      this.disablePrev = true;
      this.disableNext = true;
    }
  }

  changeSelected(event: any){
    this.loadBatch(+event.target.value);
  }

  clickNext(){
    this.loadBatch(this.index + 1);
  }

  clickPrev(){
    this.loadBatch(this.index - 1);
  }

}
