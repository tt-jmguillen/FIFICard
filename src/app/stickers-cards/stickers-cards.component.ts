import { Card } from './../models/card';
import { EventService } from './../services/event.service';
import { CardService } from './../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PriceService } from './../services/price.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-stickers-cards',
  templateUrl: './stickers-cards.component.html',
  styleUrls: ['./stickers-cards.component.scss']
})
export class StickersCardsComponent implements OnInit {
  title: Title;
  activateRoute: ActivatedRoute;
  def: ChangeDetectorRef;
  priceService: PriceService;
  eventService: EventService;
  cardService: CardService;

  constructor(
    _title: Title,
    _activateRoute: ActivatedRoute,
    _def: ChangeDetectorRef,
    _priceService: PriceService,
    _eventService: EventService,
    _cardService: CardService
  ) {
    this.title = _title;
    this.activateRoute = _activateRoute;
    this.def = _def;
    this.priceService = _priceService;
    this.eventService = _eventService;
    this.cardService = _cardService;
  }

  caption: string = '';
  loading: boolean = false;
  cards: Card[] = [];
  categories: string[] = [];

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.eventService.getById(params['id']).then(event => {
          this.caption = event.name!;
          this.def.detectChanges();
          this.loadCards(event.name!);
        })
      }
      else{
        this.loadAllCards();
        this.loadCategories();
      }
    })
  }

  loadCards(event: string) {
    this.loading = true;
    this.cardService.getCardsByTypeAndEvent('sticker', event).then(cards => {
      this.cards = cards;
      this.loading = false;
    })
  }

  loadAllCards(){
    this.loading = true;
    this.cardService.getCardsByType('sticker').then(cards => {
      this.cards = cards;
      this.loading = false;
    })
  }

  loadCategories(){
    this.eventService.getEventSticker().then(events => {
      this.categories = events.map(x => x.name!);
    })
  }
}
