import { CardService } from 'src/app/services/card.service';
import { OrderService } from './../../services/order.service';
import { Order } from 'src/app/models/order';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/models/card';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart-thumb',
  templateUrl: './cart-thumb.component.html',
  styleUrls: ['./cart-thumb.component.scss']
})
export class CartThumbComponent implements OnInit {
  @Input() id: string;
  @Input() selected: boolean;
  @Output() updateOrder: EventEmitter<Order> = new EventEmitter<Order>();
  @Output() updateCard: EventEmitter<[string, Card]> = new EventEmitter<[string, Card]>();
  @Output() changeInclude: EventEmitter<[string, boolean]> = new EventEmitter<[string, boolean]>();
  @Output() deleteItem: EventEmitter<string> = new EventEmitter<string>();

  orderService: OrderService;
  cardService: CardService;

  order: Order;
  card: Card;
  url: string;

  constructor(
    _orderService: OrderService,
    _cardService: CardService
  ) {
    this.orderService = _orderService;
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    this.orderService.getOrder(this.id).then(order => {
      this.order = order;
      this.updateOrder.emit(order);
      this.getCard(this.order.card_id!);
    })
  }

  getCard(id: string) {
    this.cardService.getACard(id).then(card => {
      this.card = card;
      this.updateCard.emit([this.id, this.card]);
      this.getAvailableURL(this.card.primary!);
    })
  }

  getAvailableURL(image: string) {
    this.cardService.getImageURL(image + environment.imageSize.small).then(url => {
      this.url = url;
    }).catch(err => {
      this.cardService.getImageURL(image).then(url => {
        this.url = url;
      }).catch(err => { });
    });
  }

  updateInclude() {
    this.selected = !this.selected;
    this.changeInclude.emit([this.id, this.selected]);
  }

  delete() {
    this.deleteItem.emit(this.id);
  }
}
