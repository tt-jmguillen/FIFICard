import { CardService } from './../services/card.service';
import { Title } from '@angular/platform-browser';
import { EventService } from 'src/app/services/event.service';
import { Component, OnInit } from '@angular/core';
import { Event } from '../models/event';

@Component({
  selector: 'app-e-cards-page',
  templateUrl: './e-cards-page.component.html',
  styleUrls: ['./e-cards-page.component.scss']
})
export class ECardsPageComponent implements OnInit {
  title: Title;
  eventService: EventService;
  cardService: CardService;

  constructor(
    _title: Title,
    _eventService: EventService,
    _cardService: CardService
  ) { 
    this.title = _title;
    this.eventService = _eventService;
    this.cardService = _cardService;
  }

  orders = [
    "Valentine's Day",
    "Graduation",
    "Mother's Day",
    "Father’s Day",
    "Grandparent's Day",
    "Baptism",
    "Anniversary",
    "Happy Birthday",
    "Wedding",
    "Get Well",
    "Thank You",
    "Pet"
  ]

  events: Event[] = [];

  ngOnInit(): void {
    this.title.setTitle('E-Cards');
    this.loadEvents();
  }

  async loadEvents(){
    this.eventService.getEventECard().then(async events => {
      this.orders.forEach(async order => {
        let event = events.find(x => x.name! == order);
        if (event != undefined){
          let cards = await this.cardService.getCardsByTypeAndEvent('ecard', event.name!);
          if (cards.length > 0)
            this.events.push(event);
        }
      })
    })
  }

  async checkAvailability(event: Event): Promise<Boolean>{
    let cards = await this.cardService.getCardsByTypeAndEvent('ecard', event.name!);
    return cards.length > 0;
  }
}
