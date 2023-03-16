import { PriceService } from './../../../services/price.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-more-item',
  templateUrl: './add-more-item.component.html',
  styleUrls: ['./add-more-item.component.scss']
})
export class AddMoreItemComponent implements OnInit {
  @Input() card: Card;
  @Input() count: number;
  @Output() addMoreChange: EventEmitter<number> = new EventEmitter<number>();

  service: CardService;
  priceService: PriceService;

  constructor(
    _service: CardService,
    _priceService: PriceService
  ) {
    this.service = _service;
    this.priceService = _priceService;
  }


  imageURL: string = ''
  currentCount: number = 0;
  show: boolean = false;

  ngOnInit(): void {
    this.loadImage(this.card.id!);
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
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        }).catch(err => { });
      });
    });
  }

  markItem() {
    if (this.currentCount == 0) {
      this.addCount();
    }
  }

  addCount() {
    this.currentCount++;
    this.addMoreChange.emit(this.currentCount);
  }

  lessCount() {
    this.currentCount--;
    this.addMoreChange.emit(this.currentCount);
  }

  hover() {
    this.show = true;
  }

  unhover() {
    this.show = false;
  }
}
