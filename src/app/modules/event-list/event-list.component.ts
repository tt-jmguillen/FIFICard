import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() order: string[] = [];

  service: EventService;

  constructor(
    private _service: EventService
  ) {
    this.service = _service;
  }

  events: Event[] = [];

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.service.getEvents().then((data: Event[]) => {
      if (this.order.length > 0) {
        this.order.forEach(x => {
          data.forEach(y => {
            if (x.toLowerCase() == y.name!.toLowerCase()) {
              this.events.push(y);
            }
          })
        })
      }
      else {
        this.events = data;
      }
    });
  }

}
