import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() order?: string[];
  service: EventService;
  events: Event[] = [];
  displayEvents: Event[] = [];

  constructor(
    private _service: EventService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(){
    this.service.getEventNonGift().then((data: Event[]) => {
      data.forEach(event => {
        if (event.active){
          event.image = `assets/images/event/thumbnail/${this.replaceAll(event.name!)}-min.png`;
          if (event.name?.includes('Easter')){
            event.url = `/cards/events/Easter`;
          }
          else if (event.name?.toUpperCase() == 'CREATIONS'){
            event.url = "/creations"
          }
          else{
            event.url = `/cards/events/${event.name}`;
          }
         
          this.events.push(event);
        }
      });

      if(this.order){
        this.orderEvents();
      }
      else{
        this.displayEvents = this.events;
      }
    })
  }

  orderEvents(){
    this.order?.forEach(name => {
      this.events.forEach(event => {
        if(event.name?.toLowerCase().replace("'",'') == name.toLowerCase()){
          this.displayEvents.push(event);
        }
      })
    })
  }

  replaceAll(value: string): string{
    let newValue = value.split(' ').join('');
    newValue = newValue.split("’").join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
  }

}
