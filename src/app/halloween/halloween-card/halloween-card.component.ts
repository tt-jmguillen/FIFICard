import { Card } from './../../models/card';
import { CardService } from 'src/app/services/card.service';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-halloween-card',
  templateUrl: './halloween-card.component.html',
  styleUrls: ['./halloween-card.component.scss']
})
export class HalloweenCardComponent implements OnInit {
  @Input() id: string;

  service: CardService;

  constructor(
    _service: CardService
  ) {
    this.service = _service;
  }

  title: string = '';
  price: number = 0;
  image: string = '';

  ngOnInit(): void {
    this.loadCard();
  }

  loadCard() {
    this.service.getACard(this.id).then(card => {
      this.title = card.name!;
      this.price = card.price!;
      this.loadImage(card.id!);
    })
  }

  loadImage(id: string) {
    this.service.getPrimaryImage(id).then(img => {
      this.getimage(img).then(image => this.image = image);
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
