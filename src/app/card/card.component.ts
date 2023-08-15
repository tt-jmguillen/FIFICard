import { Bundle } from './../models/bundle';
import { PriceService } from './../services/price.service';
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
  @Input() card: Card;

  service: CardService;
  priceService: PriceService;
  bundles: Bundle[] = [];
  imageURL: string = '';

  constructor(
    private _service: CardService,
    private _priceService: PriceService
  ) {
    this.service = _service
    this.priceService = _priceService;
  }

  ngOnInit(): void { 
    this.loadImage(this.card.id!);
      if (this.card.type == 'postcard') {
        this.getBundles(this.card.id!);
      }
  }

  loadCard(_id: string) {
    this.service.getCard(_id).subscribe(val => {
      this.card = val;
      this.loadImage(_id);
      if (val.type == 'postcard') {
        this.getBundles(val.id!);
      }
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

  getPrice(): number {
    if (this.card!.type == 'ecard') {
      return this.priceService.getECardPrice(this.card!)
    }
    else {
      let type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED' = 'STANDARD'
      if (this.card!.types!.findIndex(x => x == 'STANDARD') >= 0) {
        type = 'STANDARD';
      }
      else if (this.card!.types!.findIndex(x => x == 'GLITTERED') >= 0) {
        type = 'GLITTERED';
      }
      if (this.card!.types!.findIndex(x => x == 'EMBOSSED') >= 0) {
        type = 'EMBOSSED';
      }
      return this.priceService.getPrice(this.card!, type)
    }
  }

  getBundles(id: string) {
    this.service.getBundles(id).then(bundles => {
      this.bundles = bundles;
    });
  }

}
