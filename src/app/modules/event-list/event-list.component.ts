import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() set events(_event: Event[]) {
    this.eventlist = _event;
  }

  service: EventService;

  constructor(
    private _service: EventService
  ) {
    this.service = _service;
  }

  eventlist: Event[] = [];

  ngOnInit(): void {
  }

}
