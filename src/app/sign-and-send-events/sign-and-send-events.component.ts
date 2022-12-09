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

  constructor(
    _service: EventService
  ) {
    this.service = _service;
  }

  occassions: Event[] = [];
  events: Event[] = [];

  ngOnInit(): void {
    this.loadoccasions();
    this.loadevents();
  }

  loadoccasions() {
    this.service.getByTag('Occasions').then(events => {
      events.forEach(event => {
        if (event.thumbnail) {
          this.occassions.push(event);
        }
      })
      this.occassions = this.sort(this.occassions);
    })
  }

  loadevents() {
    this.service.getByTag('Events').then(events => {
      events.forEach(event => {
        if (event.thumbnail) {
          this.events.push(event);
        }
      })
      this.events = this.sort(this.events);
    });
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

}
