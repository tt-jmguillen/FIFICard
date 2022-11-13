import { ImageService } from 'src/app/services/image.service';
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
  imageService: ImageService;

  constructor(
    _service: CardService,
    _imageService: ImageService
  ) {
    this.service = _service;
    this.imageService = _imageService;
  }

  image: string = '';
  url: string = '';
  enable: boolean = false;

  ngOnInit(): void {
    if (this.event.thumbnail != undefined) {
      this.imageService.getImageURL(this.event.thumbnail).then(image => {
        this.image = image;
        this.checkCardCount(this.event!.name!);
      })
    }
    else {
      this.image = this.getDefaultThumbnail();
      this.checkCardCount(this.event!.name!);
    }
    this.loadURL();
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

  getDefaultThumbnail(): string {
    let name = this.event!.name!;
    return `assets/images/event/thumbnail/${this.replaceAll(name)}-min.png`;
  }

  loadURL() {
    let name = this.event!.name!;
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
}
