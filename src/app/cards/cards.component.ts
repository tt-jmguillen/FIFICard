import { FilterService } from './../services/filter.service';
import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';
import { Recipient } from '../models/recipient';
import { RecipientService } from '../services/recipient.service';

export class Page {
  public index: number;
  public start: number;
  public end: number;
  public display: string;
  public showing: string;
  public selected: boolean;

  constructor(_index: number) {
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
  filterCards: Card[] = [];
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
  ) {
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
        if (this.filterCards.length > 0){
          this.applyDisplayFilterAndSort();
        }
      });

      this.filterService.getSort().subscribe(value => {
        this.sort = value;
        if (this.filterCards.length > 0){
          this.applyDisplayFilterAndSort();
        }
      });

      this.loadRecipients(this.event || "");
      if (this.recipient){
        this.selectedRecipient = this.recipient;
      }
      else {
        this.selectedRecipient = 'All';
      }

      if (this.event) {
        this.caption = this.event;
        this.banner = `/assets/images/event/banner/${this.caption.replace(" ", "").replace("'", "") || 'All'}-min.png`;
      }
      else if ((this.search) && (this.search != '')) {
        this.caption! = "Search: " + this.search;
      }

      this.getAllCards();
    });
  }

  getAllCards() {
    this.service.getCards().then(data => {
      if (this.event! != 'All') {
        this.filterForEvent(this.event!, data);
      }
      else if ((this.search) && (this.search != '')) {
        this.filterForSearch(this.search, data);
      }
      else{
        this.cards = data;
      }

      this.filterCards = this.cards;      
      if (this.recipient){
        this.filterCards = this.filterForRecipient(this.recipient, this.filterCards);
      }
      this.applyDisplayFilterAndSort();
    });
  }

  applyDisplayFilterAndSort(){
    if (this.budget){
      this.filterCards = this.filterForBudget(this.budget, this.filterCards);
    }
    if (this.sort){
      this.filterCards = this.sortRecord(this.sort, this.filterCards);
    }

    this.initializeBatch();
    this.loadBatch(1);
  }

  filterForEvent(_event: string, data: Card[]) {
    data.forEach(card => {
      if (card.event) {
        card.event.split(",").forEach(event => {
          if (event.trim() == _event) {
            this.cards.push(card);
          }
        })
      }
    });
  }

  filterForSearch(_search: string, data: Card[]){
    data.forEach(card => {
      if (card.name!.includes(_search)){
        this.cards.push(card);
      }
      else if (card.description!.includes(_search)){
        this.cards.push(card);
      }
      else if (card.event!.includes(_search)){
        this.cards.push(card);
      }
      else if (card.recipient!.includes(_search)){
        this.cards.push(card);
      }
    })
  }

  filterForRecipient(_recipient: string, data: Card[]): Card[]{
    let filtered: Card[] = [];
    data.forEach(card => {
      if (card.recipient){
        card.recipient.split(",").forEach(recipient => {
          if (recipient.trim() == _recipient) {
            filtered.push(card);
          }
        })
      }
    });
    return filtered;
  }

  filterForBudget(_budget: string, data: Card[]): Card[]{
    let filtered: Card[] = []
    data.forEach(card => {
      if (_budget == '0 - 99') {
        if (card.price! >= 99)
          filtered.push(card);
      }
      else if (_budget == '100 - 199') {
        if ((card.price! <= 100) && (card.price! >= 199))
          filtered.push(card);
      }
      else if (_budget == '200 and Up') {
        if (card.price! >= 99)
          filtered.push(card);
      }
    });
    return filtered;
  }

  sortRecord(_sort: string, data: Card[]): Card[] {
    if (_sort == "Latest") {
      return data.sort((a, b) => {
        if (a.created! > b.created!) return -1;
        if (a.created! < b.created!) return 1;
        return 0;
      });
    }
    else if (_sort == "Price from Low to High") {
      return data.sort((a, b) => {
        if (a.price! > b.price!) return 1;
        if (a.price! < b.price!) return -1;
        return 0;
      });
    }
    else if (_sort == "Price from High to Low") {
      return data.sort((a, b) => {
        if (a.price! < b.price!) return 1;
        if (a.price! > b.price!) return -1;
        return 0;
      });
    }
    return data.sort((a, b) => {
      if (a.name!.trim() > b.name!.trim()) return 1;
      if (a.name!.trim() < b.name!.trim()) return -1;
      return 0;
    });
  }

  onRecipientClick(recipient: string) {
    this.selectedRecipient = recipient;
    this.filterCards = this.filterForRecipient(this.selectedRecipient, this.cards);
    this.applyDisplayFilterAndSort();
    //this.loadEvent(this.event!);
  }

  loadRecipients(_event: string) {
    this.serviceRecipient.getRecipients().then(data => {
      this.recipients = data;
      data.forEach(r => {
        if (r.name) {
          this.recipientsByName.push(r.name);
        }
      });
      this.initializeBatch();
      this.loadBatch(1);
    });

    this.service.getCards().then(data => {
      this.recipientsByEvent = [];
      this.recipientsByEvent.push('All');
      data.forEach(card => {
        if (card.event) {
          card.event.split(",").forEach(event => {
            if (event.trim() == _event) {
              if (card.recipient) {
                card.recipient.split(",").forEach(recip => {
                  recip = recip.trim();
                  if (!this.recipientsByEvent.includes(recip) && recip != 'Any' && this.recipientsByName.includes(recip))
                    this.recipientsByEvent.push(recip);
                });
              }
            }
          });
        }
      });
    });

  }
  
  initializeBatch() {
    this.pages = [];

    if (this.filterCards.length > this.batchLimit) {
      this.batchCount = Math.trunc(this.filterCards.length / this.batchLimit);
      if (this.batchCount < (this.filterCards.length / this.batchLimit)) {
        this.batchCount++;
      }
    }
    else {
      this.batchCount = 1;
    }

    for (let i = 1; i <= this.batchCount; i++) {
      let page: Page = new Page(i);
      page.end = i * this.batchLimit;
      if (page.end > this.filterCards.length)
        page.end = this.filterCards.length;
      if (this.filterCards.length > this.batchLimit)
        page.start = page.end - (this.batchLimit - 1);
      else
        page.start = 1;
      page.display = `Page ${i} of ${this.batchCount}`;
      page.showing = `Showing ${page.start} - ${page.end} to ${this.filterCards.length} items`;
      this.pages.push(page);
    }
  }

  loadBatch(_index: number) {
    this.index = _index;
    this.pages.forEach(page => {
      if (page.index == this.index) {
        page.selected = true;
        this.displayCards = [];
        for (let i = page.start - 1; i <= page.end - 1; i++) {
          this.displayCards.push(this.filterCards[i]);
        }
        this.batchShowing = page.showing;
      }
      else {
        page.selected = false;
      }
    });
    if (this.index == 1) {
      this.disablePrev = false;
      this.disableNext = true;
    }
    else if (this.index == this.batchCount) {
      this.disablePrev = true;
      this.disableNext = false;
    }
    else {
      this.disablePrev = true;
      this.disableNext = true;
    }
  }

  changeSelected(event: any) {
    this.loadBatch(+event.target.value);
  }

  clickNext() {
    this.loadBatch(this.index + 1);
  }

  clickPrev() {
    this.loadBatch(this.index - 1);
  }
}
