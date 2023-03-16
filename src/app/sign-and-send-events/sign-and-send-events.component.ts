import { PriceService } from './../services/price.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-sign-and-send-events',
  templateUrl: './sign-and-send-events.component.html',
  styleUrls: ['./sign-and-send-events.component.scss']
})
export class SignAndSendEventsComponent implements OnInit {
  service: EventService;
  priceService: PriceService;

  constructor(
    _service: EventService,
    _priceService: PriceService
  ) {
    this.service = _service;
    this.priceService = _priceService;
  }

  occassions: Event[] = [];
  events: Event[] = [];

  ngOnInit(): void {
    this.loadevents();
  }

  loadevents() {
    this.service.getEventSignAndSend().then(events => {
      this.events = this.sort(events.filter(x => x.tag == 'Events'));
      this.occassions = this.sort(events.filter(x => x.tag == 'Occasions'));
    });
  }

  sort(events: Event[]): Event[] {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let eventsWithSched: Event[] = events.filter(x => x.month != '');
    let date: Date = new Date();
    let monthId: number = date.getMonth();
    let day: number = date.getDate();

    let newEvents: Event[] = [];
    let temp: Event[] = [];

    if (eventsWithSched.length > 0) {
      for (let i = 0; i < 12; i++) {
        eventsWithSched.forEach(event => {
          if (event.month == monthNames[monthId]) {
            if (event.date) {
              if ((event.month == monthNames[date.getMonth()]) && (event.date < day)) {
                temp.push(event)
              }
              else {
                newEvents.push(event);
              }
            }
            else {
              newEvents.push(event);
            }
          }
        })

        if (monthId < 11)
          monthId = monthId + 1;
        else
          monthId = 0;
      }

      newEvents.push(...temp);
    }

    newEvents.push(...events.filter(x => x.month == ''))

    return newEvents;
  }

}
