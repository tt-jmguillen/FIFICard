import { ImageService } from './../../services/image.service';
import { CardService } from 'src/app/services/card.service';
import { OrderService } from './../../services/order.service';
import { Order } from 'src/app/models/order';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Card } from 'src/app/models/card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-thumb',
  templateUrl: './cart-thumb.component.html',
  styleUrls: ['./cart-thumb.component.scss']
})
export class CartThumbComponent implements OnInit {
  @Input() order: Order;
  @Input() card: Card;
  @Input() selected: boolean;
  @Output() updateOrder: EventEmitter<Order> = new EventEmitter<Order>();
  @Output() updateCard: EventEmitter<[string, Card]> = new EventEmitter<[string, Card]>();
  @Output() changeInclude: EventEmitter<[string, boolean]> = new EventEmitter<[string, boolean]>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();

  orderService: OrderService;
  cardService: CardService;
  imageService: ImageService;
  def: ChangeDetectorRef;

  url: string;

  constructor(
    _orderService: OrderService,
    _cardService: CardService,
    _imageService: ImageService,
    _def: ChangeDetectorRef
  ) {
    this.orderService = _orderService;
    this.cardService = _cardService;
    this.imageService = _imageService;
    this.def = _def;
  }

  ngOnInit(): void {
    if (this.card.type != 'ecard')
      this.loadImage(this.card.id!);
    else
      this.loadECardImage(this.card.id!);
  }

  loadImage(id: string) {
    this.cardService.getPrimaryImage(id).then(img => {
      this.url = img;
    }).catch(err => {
      console.log(err);
    })
  }

  loadECardImage(id: string) {
    this.cardService.getECardImages(id).then(images => {
      let image = images.find(x => x.title == 'preview')!;
      this.imageService.getImageURL(image.url).then(url => {
        this.url = url;
      })
    })
  }

  getAvailableURL(image: string) {
    this.cardService.getImageURL(image).then(url => {
      this.url = url;
    }).catch(err => {
      this.cardService.getImageURL(image).then(url => {
        this.url = url;
      }).catch(err => { });
    });
  }

  updateInclude() {
    this.selected = !this.selected;
    this.changeInclude.emit([this.order.id!, this.selected]);
  }

  delete() {
    this.deleteItem.emit(this.order.id!);
  }

  getSign(): string {
    if (this.order.location == 'us') {
      return '$';
    }
    else if (this.order.location == 'sg') {
      return 'S$';
    }
    else {
      return '₱';
    }
  }

  getShippingFee(): string {
    if (this.order.shipping_fee! > 0) {
      return this.getSign() + ' ' + this.order.shipping_fee!.toFixed(2)
    }
    else {
      return 'Free'
    }
  }
}
