import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {
  title: Title;
  service: EventService;

  constructor(
    _title: Title,
    _service: EventService
  ) {
    this.title = _title;
    this.service = _service;
  }

  categories: Event[] = [];
  recipients: Event[] = [];
  events: Event[] = [];

  mode: 'Category' | 'Recipient' | 'Event' = 'Category';

  ngOnInit(): void {
    this.title.setTitle("Gifts");
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
