import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../models/card';

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
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnInit {
  @Input() cards: Card[];
  @Input() priority: string;
  @Input() recipient: string;

  budget: string = '';
  sort: string = '';

  filterCards: Card[] = [];
  sortCards: Card[] = [];
  displayCards: Card[] = [];
  pages: Page[] = [];
  index: number;
  batchLimit: number = 36;
  batchCount: number = 0;
  batchShowing: string = '';
  disablePrev: boolean;
  disableNext: boolean;

  recipients: string[] = [];
  selectedRecipient: string;

  constructor() { }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(){
    this.filterCards = this.cards;
    this.loadRecipient(this.cards);
    this.selectedRecipient = this.recipient==undefined?"All":this.recipient;
    this.filterCards = this.filterForRecipient();
    this.applyDisplayFilterAndSort();
  }

  averageRatings(value?: number): number {
    if (!value) {
      return 0;
    }
    else if (Number.isNaN(Number(value))) {
      return 0;
    }
    else {
      return value;
    }
  }

  applyDisplayFilterAndSort() {
    this.sortCards = this.filterCards;

    if (this.budget) {
      this.sortCards = this.filterForBudget(this.budget, this.sortCards);
    }
    this.sortCards = this.sortRecord(this.sort, this.sortCards);

    if (this.priority != undefined){
      let index: number = this.sortCards.findIndex(x => x.id! == this.priority);
      if (index >= 0){
        let card = this.sortCards[index];
        this.sortCards.splice(index, 1);
        this.sortCards.unshift(card);
      }
    }

    this.initializeBatch();
    this.loadBatch(1);
  }

  filterForRecipient(): Card[] {
    console.log(this.selectedRecipient);
    if(this.selectedRecipient != "All"){
      let cards: Card[] = []
      this.cards.forEach(card => {
        let recipients = card.recipients != undefined? card.recipients: card.recipient!.split(',');
        if (recipients.findIndex(x => x.toLowerCase() == this.selectedRecipient.toLocaleLowerCase()) >= 0){
          cards.push(card);
        }
      });
      return cards;
    }
    else{
      return this.cards;
    }
  }

  filterForBudget(_budget: string, data: Card[]): Card[] {
    let filtered: Card[] = []
    data.forEach(card => {
      if (_budget == '0 - 99') {
        if (Number(card.price!) <= 99) {
          filtered.push(card);
        }
      }
      else if (_budget == '100 - 199') {
        if (100 <= (Number(card.price!)) && (Number(card.price!) <= 199)) {
          filtered.push(card);
        }
      }
      else if (_budget == '200 and Up') {
        if (200 <= Number(card.price!)) {
          filtered.push(card);
        }
      }
    });
    return filtered;
  }

  sortRecord(_sort: string, data: Card[]): Card[] {
    if (_sort == "Latest") {
      return data.sort((a, b) => 0 - (a.created! > b.created! ? -1 : 1));
    }
    else if (_sort == "Price from Low to High") {
      return data.sort((a, b) => 0 - (a.price! > b.price! ? -1 : 1));
    }
    else if (_sort == "Price from High to Low") {
      return data.sort((a, b) => 0 - (a.price! > b.price! ? 1 : -1));
    }
    else if (_sort == "Highest Ratings") {
      return data.sort((a, b) => 0 - (this.averageRatings(a.ratings) > this.averageRatings(b.ratings) ? 1 : -1));
    }
    return data.sort((a, b) => 0 - (a.name!.trim().toUpperCase() > b.name!.trim().toUpperCase() ? -1 : 1));
  }

  onRecipientClick(recipient: string) {
    this.selectedRecipient = recipient;
    this.filterCards = this.filterForRecipient();
    this.applyDisplayFilterAndSort();
  }

  loadRecipient(cards: Card[]) {
    this.recipients = [];

    this.cards.forEach(card => {
      card.recipients?.forEach(recipient => {
        if ((recipient.toLocaleLowerCase() != 'all') && (recipient.toLocaleLowerCase() != 'any')){
          if (this.recipients.findIndex(x => x.trim().toLocaleLowerCase() == recipient.trim().toLocaleLowerCase()) < 0){
            this.recipients.push(recipient.trim());
          }
        }
      })
    });

    if (this.recipients.length > 1){
      this.recipients.unshift("All");
    }
  }

  initializeBatch() {
    this.pages = [];

    if (this.sortCards.length > this.batchLimit) {
      this.batchCount = Math.trunc(this.sortCards.length / this.batchLimit);
      if (this.batchCount < (this.sortCards.length / this.batchLimit)) {
        this.batchCount++;
      }
    }
    else {
      this.batchCount = 1;
    }

    for (let i = 1; i <= this.batchCount; i++) {
      let page: Page = new Page(i);
      page.end = i * this.batchLimit;
      if (page.end > this.sortCards.length)
        page.end = this.sortCards.length;
      if (this.sortCards.length > this.batchLimit)
        page.start = page.end - (this.batchLimit - 1);
      else
        page.start = 1;
      page.display = `Page ${i} of ${this.batchCount}`;
      page.showing = `Showing ${page.start} - ${page.end} to ${this.sortCards.length} items`;
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
          this.displayCards.push(this.sortCards[i]);
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

  changeBudget(event: any) {
    this.budget = event.target.value;
    if (this.filterCards.length > 0) {
      this.applyDisplayFilterAndSort();
    }
  }

  changeSort(event: any) {
    this.sort = event.target.value;
    if (this.filterCards.length > 0) {
      this.applyDisplayFilterAndSort();
    }
  }

}
