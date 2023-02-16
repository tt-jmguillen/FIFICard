import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Event } from '../models/event';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-specialty-cards-page',
  templateUrl: './specialty-cards-page.component.html',
  styleUrls: ['./specialty-cards-page.component.scss']
})
export class SpecialtyCardsPageComponent implements OnInit {
  title: Title;
  service: EventService;

  constructor(
    _title: Title,
    _service: EventService
  ) {
    this.title = _title;
    this.service = _service;
  }

  events: Event[] = [];

  ngOnInit(): void {
    this.title.setTitle("Specialty Card");
    this.loadevents();
  }

  loadevents() {
    this.service.getByTag('Specialty Card').then(events => {
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
