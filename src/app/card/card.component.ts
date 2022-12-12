import { environment } from './../../environments/environment';
import { Card } from './../models/card';
import { Component, Input, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() set id(_id: string) {
    this.loadCard(_id);
  }

  service: CardService;
  card?: Card;
  imageURL: string = '';

  constructor(
    private _service: CardService
  ) {
    this.service = _service
  }

  ngOnInit(): void { }

  loadCard(_id: string) {
    this.service.getCard(_id).subscribe(val => {
      this.card = val;
      this.loadImage(_id);
    });
  }

  loadImage(id: string) {
    this.service.getPrimaryImage(id).then(img => {
      this.getImage(img);
    });
  }

  getImage(image: string) {
    this.getAvailableURL(image).then(url => {
      this.imageURL = url;
    });
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve) => {
      this.service.getImageURL(image + environment.imageSize.xlarge).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image + environment.imageSize.large).then(url => {
          resolve(url);
        }).catch(err => {
          this.service.getImageURL(image).then(url => {
            resolve(url);
          }).catch(err => { });
        });
      });
    });

  }

  getStickerLink(): string {
    let link: string = '';

    link = '/cards/events/' + this.card!.name!.split(' ')[0];

    return link;
  }

}
