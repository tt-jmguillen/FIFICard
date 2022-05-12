import { FilterService } from './../services/filter.service';
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
  recipient?: string;

  budget: string = '';
  sort: string = '';

  caption: string = '';
  banner: string = '';
  service: CardService;
  filterService: FilterService;
  serviceRecipient: RecipientService;
  activateRoute: ActivatedRoute;
  selectedRecipient: string = ''

  cards: Card[] = [];
  displayCards: Card[] = [];
  pages: Page[] = [];
  index: number;
  batchLimit: number = 36;
  batchCount: number = 0;
  batchShowing: string = '';
  disablePrev: boolean;
  disableNext: boolean;

  recipients: Recipient[] = [];
  recipientsByEvent: string[] = [];
  recipientsByName: string[] = [];

  constructor(
    private _service: CardService,
    private _filterService: FilterService,
    private _serviceRecipient: RecipientService,
    private _activateRoute: ActivatedRoute
  ){ 
    this.service = _service;
    this.filterService = _filterService;
    this.serviceRecipient = _serviceRecipient;
    this.activateRoute = _activateRoute;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];
      this.recipient = params['recipient'];

      this.filterService.getBudget().subscribe(value => {
        this.budget = value;
        console.log(this.budget);
      });

      this.filterService.getSort().subscribe(value => {
        this.sort = value;
        console.log(this.sort);
      });

      this.loadRecipients(this.event||"");
      this.selectedRecipient = 'All';

      if(this.event){
        if (this.event! != 'All'){
          this.caption! = this.event;
          this.banner = `/assets/images/event/banner/${this.caption.replace(" ","").replace("'","")||'All'}-min.png`;
          if (this.recipient){
            this.selectedRecipient = this.recipient;
          }
          this.loadEvent(this.event);
        }
        else{
          this.loadAll();
        }
      }
      else if ((this.search) && (this.search != '')){
        this.caption! = "Search: " + this.search;
        this.loadSearch(this.search);
      }
      else{
        this.loadAll();
      }
    });
  }

  onRecipientClick(recipient: string){
    this.selectedRecipient = recipient;
    this.loadEvent(this.event!);
  }
  
  loadRecipients(_event: string){
     this.serviceRecipient.getRecipients().then(data => {
       this.recipients = data;
       data.forEach(r => {
            if (r.name){
                this.recipientsByName.push(r.name);
            }
       });
       this.initializeBatch();
       this.loadBatch(1);
     });

    this.service.getCards().then(data => {
      this.recipientsByEvent.push('All');
      data.forEach(card => {
        if (card.event){
            card.event.split(",").forEach(event => {
              if(event.trim() == _event){
                  if (card.recipient){
                    card.recipient.split(",").forEach(recip => {
                      recip = recip.trim();
                      if(!this.recipientsByEvent.includes(recip) && recip != 'Any' && this.recipientsByName.includes(recip))
                      this.recipientsByEvent.push(recip);
                    });
                  }
              }
            });
        }
      });
    });

  }

  loadAll(){
    this.service.getCards().then(data => {
      this.cards = this.filterRecord(data);
      this.initializeBatch();
      this.loadBatch(1);
    });
  }

  loadEvent(_event: string){
    this.service.getCards().then(data => {
      this.cards = [];
      this.filterRecord(data).forEach(card => {
        if (card.event){
          card.event.split(",").forEach(event => {
            if(event.trim() == _event){
                if ((event.trim() == _event && this.selectedRecipient == 'All')){
                this.cards.push(card);
                }else if(event.trim() == _event && (card.recipient!.includes(this.selectedRecipient) || card.recipient!.includes('Any'))){
                  this.cards.push(card);
                }else if(event.trim() == _event && card.name!.includes(this.selectedRecipient)){
                  this.cards.push(card);
                }
           }else{
              if (_event == 'All' && this.selectedRecipient == 'All'){
              this.cards.push(card);
              }else if(_event== 'All' && (card.recipient!.includes(this.selectedRecipient)|| card.recipient!.includes('Any'))){
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
      this.filterRecord(data).forEach(card => {
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

  filterRecord(cards: Card[]){
    if (this.budget){
      let newCards: Card[] = []
      cards.forEach(card => {
        if (this.budget == '0 - 99'){
          if (card.price! >= 99)
            newCards.push(card);
        }
        else if (this.budget == '100 - 199'){
          if ((card.price! <= 100) && (card.price! >= 199))
            newCards.push(card);
        }
        else if (this.budget == '200 and Up'){
          if (card.price! >= 99)
            newCards.push(card);
        }
      });
      return this.sortRecord(newCards);
    }

    return this.sortRecord(cards);
  }

  sortRecord(cards: Card[]): Card[]{
    if (this.sort == "Latest"){
      return cards.sort((a,b) => {
        if (a.created! > b.created!) return -1;
        if (a.created! < b.created!) return 1;
        return 0;
      });
    }
    else if (this.sort == "Price from Low to High"){
      return cards.sort((a,b) => {
        if (a.price! > b.price!) return 1;
        if (a.price! < b.price!) return -1;
        return 0;
      });
    }
    else if (this.sort == "Price from High to Low"){
      return cards.sort((a,b) => {
        if (a.price! < b.price!) return 1;
        if (a.price! > b.price!) return -1;
        return 0;
      });
    }
    return cards.sort((a,b) => {
      if (a.name!.trim() > b.name!.trim()) return 1;
      if (a.name!.trim() < b.name!.trim()) return -1;
      return 0;
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
