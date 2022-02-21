import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';

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
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  event?: string;
  search?: string;

  caption: string = ''
  service: CardService;
  activateRoute: ActivatedRoute;

  cards: Card[] = [];
  displayCards: Card[] = [];
  pages: Page[] = [];
  index: number;
  batchLimit: number = 40;
  batchCount: number = 0;
  batchShowing: string = '';
  disablePrev: boolean;
  disableNext: boolean;


  constructor(
    private _service: CardService,
    private _activateRoute: ActivatedRoute
  ){ 
    this.service = _service;
    this.activateRoute = _activateRoute;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];

      if(this.event){
        if (this.event! != 'All'){
          this.caption! = this.event;
          this.loadEvent(this.event);
        }
        else{
          this.loadAll();
        }
      }
      else if(this.search){
        this.caption! = "Search: " + this.search;
        this.loadSearch(this.search);
      }
      else{
        this.loadAll();
      }
    });
  }

  loadAll(){
    this.service.getCards().then(data => {
      this.cards = data;
      this.initializeBatch();
      this.loadBatch(1);
    });
  }

  loadEvent(_event: string){
    this.service.getCards().then(data => {
      data.forEach(card => {
        console.log(card.event);
        if (card.event){
          card.event.split(",").forEach(event => {
            if (event.trim() == _event){
              this.cards.push(card);
            }
          })
        }
      });
      this.initializeBatch();
      this.loadBatch(1);
    });
  }

  loadSearch(_search: string){
    this.service.getCards().then(data => {
      data.forEach(card => {
        if (card.name!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.description!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.event!.includes(_search)){
          this.cards.push(card);
        }
        else if(card.recipient!.includes(_search)){
          this.cards.push(card);
        }
      });
      this.initializeBatch();
      this.loadBatch(1);
    });
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
