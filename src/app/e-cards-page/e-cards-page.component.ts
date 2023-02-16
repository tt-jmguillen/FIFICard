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

  constructor(
    _title: Title,
    _eventService: EventService,
  ) { 
    this.title = _title;
    this.eventService = _eventService
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

  loadEvents(){
    this.eventService.getEventECard().then(events => {
      this.orders.forEach(order => {
        let event = events.find(x => x.name! == order);
        if (event != undefined){
          this.events.push(event);
        }
      })
    })
  }
}
