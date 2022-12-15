import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  service: EventService;

  constructor(
    _service: EventService
  ) {
    this.service = _service;
  }

  occassions: Event[] = [];
  events: Event[] = [];

  ngOnInit(): void {
    this.loadevents();
  }

  loadevents() {
    this.service.getEventCard().then(events => {
      console.log(events);
      this.events = this.sort(events.filter(x => x.tag == 'Events'))
      this.occassions = this.sort(events.filter(x => x.tag == 'Occasions'))
    })
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
