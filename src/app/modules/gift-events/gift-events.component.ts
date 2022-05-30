import { Component, Input, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from '../../models/event';

@Component({
  selector: 'app-gift-events',
  templateUrl: './gift-events.component.html',
  styleUrls: ['./gift-events.component.scss']
})
export class GiftEventsComponent implements OnInit {
  @Input() order?: string[];

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
    this.service.getEventGift().then(data => {
      this.order!.forEach(name => {
        let event: Event = data.find(x => x.name?.toLowerCase().trim() === name.toLowerCase().trim()) || {}
        if (event != {}){
          event.image = `../../assets/images/gift/${this.replaceAll(event.name!)}-min.png`;
          if (event.name?.toUpperCase() == 'CREATIONS'){
            this.ak.url = "/creations";
          }
          else{
            event.url = `/cards/events/${event.name}`;
          }
          this.events.push(event);
        }
      });
    })
  }

  replaceAll(value: string): string{
    let newValue = value.split(' ').join('');
    newValue = newValue.split("’").join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
  }

}
