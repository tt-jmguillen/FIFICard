import { CardsComponent } from './../cards/cards.component';
import { CardService } from 'src/app/services/card.service';
import { EventService } from 'src/app/services/event.service';
import { Component, OnInit } from '@angular/core';
import { Event } from '../models/event';
import { Card } from '../models/card';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-poetry',
  templateUrl: './poetry.component.html',
  styleUrls: ['./poetry.component.scss']
})
export class PoetryComponent implements OnInit {

  scroller: ViewportScroller
  service: EventService;
  cardService: CardService;

  constructor(
    _scroller: ViewportScroller,
    _service: EventService,
    _cardService: CardService
  ) {
    this.scroller = _scroller;
    this.service = _service;
    this.cardService = _cardService;
  }

  featured: Event;
  events: Event[] = [];
  occasions: Event[] = [];
  specialty: Event[] = [];
  cards: Card[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  sort(events: Event[]): Event[] {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let newEvents: Event[] = [];
    let date: Date = new Date();
    let monthId: number = date.getMonth();

    for (let i = 0; i < 12; i++) {
      events.forEach(event => {
        if (event.month == monthNames[monthId]) {
          newEvents.push(event);
        }
      })

      if (monthId < 11)
        monthId = monthId + 1;
      else
        monthId = 0;
    }

    events.forEach(event => {
      if (newEvents.findIndex(x => x.id == event.id) < 0) {
        newEvents.push(event);
      }
    })

    return newEvents;
  }

  loadEvents() {
    this.service.getEventCard().then(events => {
      this.featured = events.filter(x => x.tag == 'Events').filter(x => x.name! == 'Christmas')[0];
      this.events = this.sort(events.filter(x => x.tag == 'Events').filter(x => x.name! != 'Christmas'));
      this.occasions = this.sort(events.filter(x => x.tag == 'Occasions'));
      this.specialty = this.sort(events.filter(x => x.tag == 'Specialty Card'));
    })
  }

  clickEvent(event: Event) {
    this.loadCards(event);
  }

  loadCards(event: Event) {
    this.cards = [];
    document.getElementById("data-top")!.scrollIntoView()
    this.cardService.getPoetryCardsByEvent(event.name!).then(cards => {
      this.cards = cards;
    })
  }
}
