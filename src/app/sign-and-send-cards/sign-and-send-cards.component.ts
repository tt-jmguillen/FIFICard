import { EventService } from 'src/app/services/event.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-sign-and-send-cards',
  templateUrl: './sign-and-send-cards.component.html',
  styleUrls: ['./sign-and-send-cards.component.scss']
})
export class SignAndSendCardsComponent implements OnInit {
  cardService: CardService;
  eventService: EventService;
  activateRoute: ActivatedRoute;

  constructor(
    _cardService: CardService,
    _eventService: EventService,
    _activateRoute: ActivatedRoute
  ) {
    this.cardService = _cardService;
    this.eventService = _eventService;
    this.activateRoute = _activateRoute;
  }

  event: Event;
  caption: string = '';
  cards: Card[] = [];
  loading: boolean;

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id'] != 'all') {
        this.loadEvent(params['id']);
      }
      else {
        this.loadAllCards();
      }
    });
  }

  loadEvent(_id: string) {
    this.eventService.getById(_id).then(event => {
      this.event = event;
      this.caption = this.event.name! + ' Cards';
      this.loadCards();
    })
  }

  loadAllCards() {
    this.loading = true;
    this.cardService.getSignAndSendCards().then(cards => {
      this.cards = cards;
      this.loading = false;
    }).catch(err => {
      this.loading = false;
    })
  }

  loadCards() {
    this.loading = true;
    this.cardService.getSignAndSendByEvent(this.event.name!).then(cards => {
      this.cards = cards;
      this.loading = false;
    }).catch(err => {
      this.loading = false;
    })
  }
}
