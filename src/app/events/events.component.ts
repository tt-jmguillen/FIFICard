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
  events: Event[] = [];
  ak: Event;

  constructor(
    private _service: EventService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(){
    this.service.getEvents().then((data: Event[]) => {
      data.forEach(event => {
        if (event.active){
          event.image = `/assets/images/event/thumbnail/${event.name?.replace(' ','').replace("'",'')}-min.png`;
          event.url = `cards/events/${event.name}`;
          if (event.name?.toUpperCase() == 'AK CREATIONS'){
            this.ak = event;
          }
          else{
            this.events.push(event);
          }
        }
      })
      if (this.ak){
        this.events.push(this.ak);
      }
    })
  }
}
