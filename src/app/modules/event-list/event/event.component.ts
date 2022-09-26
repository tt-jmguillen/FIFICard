import { CardService } from './../../../services/card.service';
import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../../models/event';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  @Input() event: Event;

  service: CardService;

  constructor(
    _service: CardService
  ) {
    this.service = _service;
  }

  image: string = '';
  url: string = '';
  enable: boolean = false;

  ngOnInit(): void {
    let name = this.event!.name!;
    this.checkCardCount(name);
    this.image = `assets/images/event/thumbnail/${this.replaceAll(name)}-min.png`;
    if (name.includes('Easter')) {
      this.url = `/cards/events/Easter`;
    }
    else if (name.toUpperCase() == 'CREATIONS') {
      this.url = "/creations"
    }
    else {
      this.url = `/cards/events/${name}`;
    }
  }

  checkCardCount(name: string) {
    this.service.getCardsByEvent(name).then(cards => {
      this.enable = cards.length > 0;
    }).catch(err => {
      this.enable = false;
    })
  }

  replaceAll(value: string): string {
    let newValue = value.split(' ').join('');
    newValue = newValue.split("’").join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
  }
}
