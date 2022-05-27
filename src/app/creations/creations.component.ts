import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { Event } from '../models/event';


@Component({
  selector: 'app-creations',
  templateUrl: './creations.component.html',
  styleUrls: ['./creations.component.scss']
})
export class CreationsComponent implements OnInit {
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
    this.service.getEventCreation().then((data: Event[]) => {
      data.forEach(event => {
        if (event.active){
          event.image = `/assets/images/gift/${this.replaceAll(event.name!)}-min.png`;
          event.url = `cards/events/${event.name}`;
          if (event.name?.toUpperCase() == 'CREATIONS'){
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

  replaceAll(value: string): string{
    let newValue = value.split(' ').join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
  }
}
