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

export class EventSetting{
  public event: string;
  public mainCard: string;
  public bannerLink: string;

  constructor(_event: string, _mainCard: string, _bannerLink: string){
    this.event = _event;
    this.mainCard = _mainCard;
    this.bannerLink = _bannerLink;
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
  sortCards: Card[] = [];
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

  loading: boolean = true;

  eventSettings: EventSetting[] = [];
  eventSetting: EventSetting;

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
    // this.eventSettings.push(new EventSetting('BIRTHDAY', '08VjvPay1RNWZCvkI4Gt', '/card/YbLeDTqC8nd4V85uJ0aq'));
    // this.eventSettings.push(new EventSetting('CHRISTMAS', 'JHPAAFJDLHm8Ao8rS8px', '/card/EmwhypC9otvbFcoo2yET'));
    // this.eventSettings.push(new EventSetting('THANK YOU', 'Ov40VgNzgtuObCrVJTe3', '/card/TZr0w3xILIYvXdm8spGc'));
    // this.eventSettings.push(new EventSetting('MILITARY APPRECIATION', 'vP08uWaWJ2fNePPpHeoT', '/card/dEQWrVtbl3Q5IYUFmIGn'));
    // this.eventSettings.push(new EventSetting('MOTHERS DAY', '6C3GEEQumsH9rh1iRV9y', '/card/qlYBuR3MbsgYQIwTCLBh'));
    // this.eventSettings.push(new EventSetting('RETIREMENT', 'rmpdW3x0NH2r8LZr9l8U', '/card/excJgjQ91iECBWEkR51p'));
    // this.eventSettings.push(new EventSetting('LOVE YOUR ENEMY', 'caUWVUzKKJui3hmnalaQ', '/card/ttTvbl6pLgKC9FdWOp5u'));
    // this.eventSettings.push(new EventSetting('DISTRESS', 'z3Vlo33fi5BUTEOcJ0t1', '/card/xC9akQ3IwA9QsE9jRbw4'));

    // this.eventSettings.push(new EventSetting('Confirmation', '9gJZdaXDGk74siRExTrd', '/card/tdvYzC3lT3vPdZzTkP7D'));
    // this.eventSettings.push(new EventSetting('Wedding', 'B7xwfIgXhIUFxfNhI8xX', '/card/P390wMwR8PGyAgy51vrY'));
    // this.eventSettings.push(new EventSetting('Thinking Of You', '6utqlq60ud67qCKbOcm4', '/card/mAyLGGHHq8x1XqawDacL'));
    // this.eventSettings.push(new EventSetting('Halloween', '07F8gW94f6mGFHISQpWx', '/card/wkrjkOcpYUX3eUyJ08tj'));
    // this.eventSettings.push(new EventSetting('First Communion', 'U34l4tVO9NAaLfJFuDRm', '/card/8woCW1eoUIooXjgvjMSx'));
    // this.eventSettings.push(new EventSetting('Baptism', 'YqFMboYkU8KqULTVYCD0', '/card/68VpIN3szeQ2VNj2InGD'));
    // this.eventSettings.push(new EventSetting('Parents Appreciation', 'RTKaRLkckcFHBVTvwFC9', '/card/vJ0Rk9KoFwnISsjdKtRJ'));
    // this.eventSettings.push(new EventSetting('Teacher Appreciation', '5AeQBWLOrvxpNV3Ff9TY', '/card/hwRqfPGajCmVvWBQ8OIY'));

    this.eventSettings.push(new EventSetting('Confirmation','9gJZdaXDGk74siRExTrd', '/card/tdvYzC3lT3vPdZzTkP7D'));
this.eventSettings.push(new EventSetting('Wedding', 'P390wMwR8PGyAgy51vrY', '/card/B7xwfIgXhIUFxfNhI8xX'));
this.eventSettings.push(new EventSetting('Thinking Of You', 'mAyLGGHHq8x1XqawDacL', '/card/6utqlq60ud67qCKbOcm4'));
this.eventSettings.push(new EventSetting('Halloween', 'wkrjkOcpYUX3eUyJ08tj', '/card/07F8gW94f6mGFHISQpWx'));
this.eventSettings.push(new EventSetting('First Communion', '8woCW1eoUIooXjgvjMSx', '/card/U34l4tVO9NAaLfJFuDRm'));
this.eventSettings.push(new EventSetting('Baptism', '68VpIN3szeQ2VNj2InGD', '/card/YqFMboYkU8KqULTVYCD0'));
this.eventSettings.push(new EventSetting('Parents Appreciation', 'vJ0Rk9KoFwnISsjdKtRJ', '/card/RTKaRLkckcFHBVTvwFC9'));
this.eventSettings.push(new EventSetting('Teacher Appreciation', 'hwRqfPGajCmVvWBQ8OIY', '/card/5AeQBWLOrvxpNV3Ff9TY'));
this.eventSettings.push(new EventSetting('BIRTHDAY', '08VjvPay1RNWZCvkI4Gt', '/card/YbLeDTqC8nd4V85uJ0aq'));
this.eventSettings.push(new EventSetting('CHRISTMAS', 'JHPAAFJDLHm8Ao8rS8px', '/card/EmwhypC9otvbFcoo2yET'));
this.eventSettings.push(new EventSetting('THANK YOU', 'Ov40VgNzgtuObCrVJTe3', '/card/TZr0w3xILIYvXdm8spGc'));
this.eventSettings.push(new EventSetting('MILITARY APPRECIATION', 'vP08uWaWJ2fNePPpHeoT', '/card/dEQWrVtbl3Q5IYUFmIGn'));
this.eventSettings.push(new EventSetting('MOTHERS DAY', '6C3GEEQumsH9rh1iRV9y', '/card/qlYBuR3MbsgYQIwTCLBh'));
this.eventSettings.push(new EventSetting('RETIREMENT', 'rmpdW3x0NH2r8LZr9l8U', '/card/excJgjQ91iECBWEkR51p'));
this.eventSettings.push(new EventSetting('LOVE YOUR ENEMY','caUWVUzKKJui3hmnalaQ', '/card/ttTvbl6pLgKC9FdWOp5u'));
this.eventSettings.push(new EventSetting('DISTRESS', 'z3Vlo33fi5BUTEOcJ0t1', '/card/xC9akQ3IwA9QsE9jRbw4'));
this.eventSettings.push(new EventSetting('GRADUATION', 'hYCJwp6kDMHVgXY4FMuJ', '/card/LG91AKqkj1dsvvql51Zv'));
this.eventSettings.push(new EventSetting('CONGRATULATIONS', 'LT6CjyAyAqmYYTihNOx2', '/card/nkUZxp04stsB8SVxCVhy'));
this.eventSettings.push(new EventSetting('FATHERS DAY', 'IMHQhzRssP2cZdfqOfWb', '/card/OkBSquS8aTDTrTmscFaa'));
this.eventSettings.push(new EventSetting('FRIENDSHIP', 'P9whSpKaPTYqYBN1IWmw', '/card/KpBq9Atga2LkaTKX0hcD'));
this.eventSettings.push(new EventSetting('GRANDPARENTS DAY', 'QO2TVXdSZEoimL49VKuC', '/card/KpW0laiSbUfAmhoqLcgG'));
this.eventSettings.push(new EventSetting('PET CARDS', '5sxryZAm4b1aiAnIfdxv', '/card/uGkW25dFLiZFDMvdYw6v'));
this.eventSettings.push(new EventSetting('GET WELL', 'bW4l1zph6jKHrghKBLWY', '/card/y2sxhRoday8B3hWg3HRt'));
this.eventSettings.push(new EventSetting('Valentines day', 'Roye9MTtU2azReOnMHrV', '/card/UaFgHHAgfAn6rd4jFyvq'));
    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];
      this.recipient = params['recipient'];

      //this.filterService.getSearch().subscribe(value => {
      //  if (!this.loading){
      //    this.search = value;
      //    this.getSearchCard(this.search);
      //  }
      //if (this.cards.length > 0) {
      //  this.applyFilter();
      //  }
      //});

      if (this.event) {
        this.caption = this.event;
        this.banner = `/assets/images/event/banner/${this.replaceAll(this.caption) || 'All'}-min.png`;
      }

      //this.getAllCards();
      if ((this.event) && (this.event! != 'All')) {
        this.eventSettings.forEach(setting => {
          if (this.replaceAll(setting.event) == this.replaceAll(this.event!)){
            this.eventSetting = setting;
          }
        })

        this.getCardsForEvent(this.event!);
      }
      else if ((this.search) && (this.search != '')) {
        this.getSearchCard(this.search);
      }
      else {
        this.getAllCards();
      }
    });
  }

  replaceAll(value: string): string {
    let newValue = value.split(' ').join('');
    newValue = newValue.split("’").join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
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

  getAllCards() {
    this.loading = true;
    this.service.getCards().then(data => {
      this.loading = false;
      this.cards = data;
      this.filterCards = this.cards;
      //this.applyFilter();

      this.loadRecipient(this.event!, this.cards);
      if (this.recipient) {
        this.selectedRecipient = this.recipient;
      }
      else {
        this.selectedRecipient = 'All';
      }

      this.applyDisplayFilterAndSort();
    });
  }

  getCardsForEvent(event: string) {
    this.loading = true;
    this.service.getCardsByEvent(event).then(data => {
      this.loading = false;
      this.cards = data;
      this.filterCards = data;

      this.loadRecipient(this.event!, this.cards);
      if (this.recipient) {
        this.selectedRecipient = this.recipient;
      }
      else {
        this.selectedRecipient = 'All';
      }

      this.applyDisplayFilterAndSort();
    })
  }

  getSearchCard(search: string) {
    this.caption! = "Searching: " + this.search;
    this.loading = true;
    this.cards = [];
    this.filterCards = [];
    this.displayCards = [];
    this.recipientsByName = [];
    this.recipientsByEvent = [];

    this.doSearch(search).then(data => {
      this.loading = false;
      this.caption! = "Search: " + this.search;

      this.cards = data;
      this.filterCards = data;
      this.applyDisplayFilterAndSort();
    }).catch(err => {
      this.loading = false;
      this.caption! = "Search: " + this.search + " - No Record Found";
      this.cards = [];
      this.filterCards = [];
      this.applyDisplayFilterAndSort();
    })
  }

  doSearch(search: string): Promise<Card[]> {
    let value = search.toLowerCase().trim();
    return new Promise((resolve, rejects) => {
      this.service.getCardsByEvent(search).then(data => {
        resolve(data);
      }).catch(e => {
        this.service.getSearchCards('search_name', value).then(data => {
          resolve(data);
        }).catch(e => {
          this.service.getSearchCards('search_escription', value).then(data => {
            resolve(data);
          }).catch(e => {
            rejects('No Records Found');
          });
        });
      });
    })
  }

  averageRatings(value?: number): number{
    if (!value){
      return 0;
    }
    else if (Number.isNaN(Number(value))){
      return 0;
    }
    else{
      return value;
    }
  }

  applyFilter() {
      if((this.event) && (this.event! != 'All')) {
      this.filterCards = this.filterForEvent(this.event!, this.filterCards);

      this.loadRecipient(this.event!, this.filterCards);
      if (this.recipient) {
        this.selectedRecipient = this.recipient;
      }
      else {
        this.selectedRecipient = 'All';
      }
    }
    else if ((this.search) && (this.search != '')) {
      this.caption! = "Search: " + this.search;
      this.filterCards = this.filterForSearch(this.search, this.filterCards);

      this.loadRecipient(this.event!, this.filterCards);
      if (this.recipient) {
        this.selectedRecipient = this.recipient;
      }
      else {
        this.selectedRecipient = 'All';
      }
    }

    if (this.recipient) {
      this.filterCards = this.filterForRecipient(this.recipient, this.filterCards);
    }

    this.applyDisplayFilterAndSort();
  }

  applyDisplayFilterAndSort() {
    this.sortCards = this.filterCards;

    if (this.budget) {
      this.sortCards = this.filterForBudget(this.budget, this.sortCards);
    }
    this.sortCards = this.sortRecord(this.sort, this.sortCards);

    if (this.event) {
      if (this.eventSetting != undefined){
        let temporary: Card[] = [];

        this.sortCards.forEach(card => {
          if(card.id! == this.eventSetting.mainCard){
            temporary.push(card);
          }
        })
        this.sortCards.forEach(card => {
          if(card.id! != this.eventSetting.mainCard){
            temporary.push(card);
          }
        })

        this.sortCards = temporary;
      }
    }

    this.initializeBatch();
    this.loadBatch(1);
  }

  filterForEvent(_event: string, data: Card[]): Card[] {
    let filtered: Card[] = [];
    data.forEach(card => {
      if (card.event) {
        card.event.split(",").forEach(event => {
          if (event.trim() == _event) {
            filtered.push(card);
          }
        })
      }
    });
    return filtered;
  }

  filterForSearch(_search: string, data: Card[]): Card[] {
    let filtered: Card[] = [];
    data.forEach(card => {
      if (card.name!.includes(_search)) {
        filtered.push(card);
      }
      else if (card.description!.includes(_search)) {
        filtered.push(card);
      }
      else if (card.event!.includes(_search)) {
        filtered.push(card);
      }
      else if (card.recipient!.includes(_search)) {
        filtered.push(card);
      }
    });
    return filtered;
  }

  filterForRecipient(_recipient: string, data: Card[]): Card[] {
    let filtered: Card[] = [];
    if (_recipient == 'All') {
      data.forEach(card => {
        if (this.event) {
          if (card.event) {
            card.event.split(",").forEach(event => {
              if (event.trim() == this.event?.trim()) {
                filtered.push(card);
              }
            });
          }
        }
      });
    }
    else {
      data.forEach(card => {
        if (this.event) {
          if (card.event) {
            card.event.split(",").forEach(event => {
              if (event.trim() == this.event) {
                if (card.recipient) {
                  card.recipient.split(",").forEach(recipient => {
                    if (recipient.trim() == _recipient.trim()) {
                      filtered.push(card);
                    }
                  })
                }
              }
            })
          }
        }
        else {
          if (card.recipient) {
            card.recipient.split(",").forEach(recipient => {
              if (recipient.trim() == _recipient.trim()) {
                filtered.push(card);
              }
            })
          }
        }
      });
    }
    return filtered;
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
    this.filterCards = this.filterForRecipient(this.selectedRecipient, this.cards);
    this.applyDisplayFilterAndSort();
  }

  loadRecipient(_event: string, cards: Card[]) {
    this.recipientsByName = [];
    this.serviceRecipient.getRecipients().then(data => {
      this.recipients = data;
      data.forEach(r => {
        if (r.name) {
          this.recipientsByName.push(r.name);
        }
      });

      this.recipientsByEvent = [];
      this.recipientsByEvent.push('All');

      cards.forEach(card => {
        if (card.recipient) {
          card.recipient.split(",").forEach(recip => {
            recip = recip.trim();
            if (!this.recipientsByEvent.includes(recip) && recip != 'Any' && this.recipientsByName.includes(recip))
              this.recipientsByEvent.push(recip);
          });
        }
      });
    });

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
}
