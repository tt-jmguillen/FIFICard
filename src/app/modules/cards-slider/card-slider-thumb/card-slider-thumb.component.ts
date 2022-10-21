import { CardService } from './../../../services/card.service';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-slider-thumb',
  templateUrl: './card-slider-thumb.component.html',
  styleUrls: ['./card-slider-thumb.component.scss']
})
export class CardSliderThumbComponent implements OnInit {
  @Input() card: Card;

  service: CardService;

  constructor(
    _service: CardService
  ) {
    this.service = _service;
  }

  url: string;

  ngOnInit(): void {
    this.loadImage();
  }

  loadImage() {
    this.service.getPrimaryImage(this.card.id!).then(image => {
      this.getimage(image).then(url => this.url = url);
    });
  }

  getimage(image: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        });
      });
    });
  }

}
