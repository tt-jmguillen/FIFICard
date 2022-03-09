import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';
import { Recipient } from '../models/recipient';
import { RecipientService } from '../services/recipient.service';

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
  serviceRecipient: RecipientService;
  activateRoute: ActivatedRoute;
  selectedRecipient: string = ''

  cards: Card[] = [];
  displayCards: Card[] = [];
  pages: Page[] = [];
  index: number;
  batchLimit: number = 40;
  batchCount: number = 0;
  batchShowing: string = '';
  disablePrev: boolean;
  disableNext: boolean;

  recipients: Recipient[] = [];

  constructor(
    private _service: CardService,
    private _serviceRecipient: RecipientService,
    private _activateRoute: ActivatedRoute
  ){ 
    this.service = _service;
    this.serviceRecipient = _serviceRecipient;
    this.activateRoute = _activateRoute;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];

      this.loadRecipients();
      this.selectedRecipient = 'All';

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

  onRecipientClick(recipient: Recipient){
    //console.log("onRecipientClick>:" + JSON.stringify(recipient));
    this.selectedRecipient = recipient.name;
    this.loadEvent(this.event!);
  }
  
  loadRecipients(){
    this.serviceRecipient.getRecipients().then(data => {
      this.recipients = data;
      this.initializeBatch();
      this.loadBatch(1);
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
      this.cards = [];
      data.forEach(card => {
        if (card.event){
          card.event.split(",").forEach(event => {
            console.log("event>>" + JSON.stringify(card));
            console.log("this.selectedRecipient>>" + JSON.stringify(this.selectedRecipient));
            if(event.trim() == _event){
                if (event.trim() == _event && this.selectedRecipient == 'All'){
                this.cards.push(card);
                }else if(event.trim() == _event && card.recipient!.includes(this.selectedRecipient)){
                  this.cards.push(card);
                }else if(event.trim() == _event && card.name!.includes(this.selectedRecipient)){
                  this.cards.push(card);
                }
           }else{
              if (_event == 'All' && this.selectedRecipient == 'All'){
              this.cards.push(card);
              }else if(_event== 'All' && card.recipient!.includes(this.selectedRecipient)){
                this.cards.push(card);
              }else if(_event == 'All' && card.name!.includes(this.selectedRecipient)){
                this.cards.push(card);
              }
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
