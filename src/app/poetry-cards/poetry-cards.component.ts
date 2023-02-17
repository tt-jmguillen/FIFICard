import { Card } from './../models/card';
import { ActivatedRoute } from '@angular/router';
import { PriceService } from './../services/price.service';
import { CardService } from './../services/card.service';
import { EventService } from './../services/event.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-poetry-cards',
  templateUrl: './poetry-cards.component.html',
  styleUrls: ['./poetry-cards.component.scss']
})
export class PoetryCardsComponent implements OnInit {
  activateRoute: ActivatedRoute;
  def: ChangeDetectorRef;
  service: EventService;
  cardService: CardService;
  priceService: PriceService;

  constructor(
    _activateRoute: ActivatedRoute,
    _def: ChangeDetectorRef,
    _service: EventService,
    _cardService: CardService,
    _priceService: PriceService
  ) { 
    this.activateRoute = _activateRoute;
    this.def = _def;
    this.service = _service;
    this.cardService = _cardService;
    this.priceService = _priceService;
  }

  caption: string = '';
  loading: boolean = false;
  cards: Card[] = [];

  ngOnInit(): void {
    document.getElementById("top")!.scrollIntoView();
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.service.getById(params['id']).then(event => {
          this.caption = event.name!;
          this.def.detectChanges();
          this.loadCards(event.name!);
        })
      }
    })
  }

  loadCards(event: string){
    this.loading = true;
    this.cardService.getPoetryCardsByEvent(event).then(cards => {
      this.cards = cards;
      this.loading = false;
    })
  }

}
