import { Card } from './../models/card';
import { EventService } from './../services/event.service';
import { CardService } from './../services/card.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PriceService } from './../services/price.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';

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
  loadingController: LoadingController;

  constructor(
    _title: Title,
    _activateRoute: ActivatedRoute,
    _def: ChangeDetectorRef,
    _priceService: PriceService,
    _eventService: EventService,
    _cardService: CardService,
    _loadingController: LoadingController
  ) {
    this.title = _title;
    this.activateRoute = _activateRoute;
    this.def = _def;
    this.priceService = _priceService;
    this.eventService = _eventService;
    this.cardService = _cardService;
    this.loadingController = _loadingController
  }

  caption: string = '';
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
      else {
        this.loadAllCards();
        this.loadCategories();
      }
    })
  }

  async loadCards(event: string) {
    let loading: HTMLIonLoadingElement;
    loading = await this.loadingController.create({
      message: 'Loading Cards...'
    });
    await loading.present();

    try {
      this.cards = await this.cardService.getCardsByTypeAndEvent('sticker', event);
    }
    finally {
      await loading.dismiss();
    }
  }

  async loadAllCards() {
    let loading: HTMLIonLoadingElement;
    loading = await this.loadingController.create({
      message: 'Loading Cards...'
    });
    await loading.present();

    try {
      this.cards = await this.cardService.getCardsByType('sticker');
    }
    finally {
      await loading.dismiss();
    }
  }

  async loadCategories() {
    let loading: HTMLIonLoadingElement;
    loading = await this.loadingController.create({
      message: 'Loading Categories...'
    });
    await loading.present();

    try {
      let events = await this.eventService.getEventSticker();
      this.categories = events.map(x => x.name!);
    }
    finally {
      await loading.dismiss();
    }
  }
}
