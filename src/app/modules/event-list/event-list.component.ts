import { CardService } from 'src/app/services/card.service';
import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../models/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  @Input() set events(_event: Event[]) {
    this.loadEventList(_event);
  }
  @Input() type: 'card' | 'signandsend' = 'card';
  @Input() showalways: boolean = true;

  service: CardService;

  constructor(
    private _service: CardService
  ) {
    this.service = _service;
  }

  eventlist: Event[] = [];
  tempEvent: Event[] = [];

  ngOnInit(): void {
  }

  loadEventList(_event: Event[]) {
    if (this.showalways) {
      this.eventlist = _event;
    }
    else {
      this.tempEvent = _event;
      this.check(0);
    }
  }

  check(index: number) {
    if (this.tempEvent[index]) {

      if (this.type == 'card') {
        this.service.getCardsByEvent(this.tempEvent[index].name!).then(cards => {
          if (cards.length > 0)
            this.eventlist.push(this.tempEvent[index]);
        });
      }
      else {
        this.service.getSignAndSendByEvent(this.tempEvent[index].name!).then(cards => {
          if (cards.length > 0)
            this.eventlist.push(this.tempEvent[index]);
        });
      }

      this.check(index + 1);
    }
  }

}
