import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {
  service: EventService;

  constructor(
    _service: EventService
  ) {
    this.service = _service;
  }

  categories: Event[] = [];
  recipients: Event[] = [];
  events: Event[] = [];

  mode: 'Category' | 'Recipient' | 'Event' = 'Category';

  ngOnInit(): void {
    this.loadCategory();
    this.loadRecipient();
    this.loadEvent();
  }

  modeChange(mode: 'Category' | 'Recipient' | 'Event') {
    this.mode = mode;
  }

  loadCategory() {
    this.service.getByTag('Shop by Category').then(events => {
      events.forEach(event => {
        if (event.thumbnail) {
          this.categories.push(event);
        }
      })
      this.categories = this.sort(this.categories);
    });
  }

  loadRecipient() {
    this.service.getByTag('Shop by Recipient').then(events => {
      events.forEach(event => {
        if (event.thumbnail) {
          this.recipients.push(event);
        }
      })
      this.recipients = this.sort(this.recipients);
    });
  }

  loadEvent() {
    this.service.getByTag('Shop by Event').then(events => {
      events.forEach(event => {
        if (event.thumbnail != '') {
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
