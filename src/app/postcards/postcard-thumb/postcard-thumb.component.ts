import { CardService } from './../../services/card.service';
import { ImageService } from './../../services/image.service';
import { EventService } from './../../services/event.service';
import { Component, Input, OnInit } from '@angular/core';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-postcard-thumb',
  templateUrl: './postcard-thumb.component.html',
  styleUrls: ['./postcard-thumb.component.scss']
})
export class PostcardThumbComponent implements OnInit {
  @Input() eventname: string;

  service: EventService;
  imageService: ImageService;
  cardService: CardService;

  constructor(
    _service: EventService,
    _imageService: ImageService,
    _cardService: CardService
  ) {
    this.service = _service;
    this.imageService = _imageService;
    this.cardService = _cardService;
  }

  id: string = '';
  img: string = '';
  enable: boolean = false;

  ngOnInit(): void {
    this.loadevent();
  }

  loadevent() {
    this.service.getByName(this.eventname).then(events => {
      let event: Event = events.find(x => x.isPostcard === true)!;
      this.id = event.id!;
      this.imageService.getImageURL(event.thumbnail).then(img => {
        this.img = img;
      });
      this.checkAvailability();
    });
  }

  checkAvailability() {
    this.cardService.getCardsByTypeAndEvent('postcard', this.eventname).then(cards => {
      this.enable = cards.length > 0;
    })
  }

  geturl(): string {
    return '/cards/event/' + this.id;
  }
}
