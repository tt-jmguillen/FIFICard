import { CardService } from './../../../../services/card.service';
import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-profile-order-thumb',
  templateUrl: './profile-order-thumb.component.html',
  styleUrls: ['./profile-order-thumb.component.scss']
})
export class ProfileOrderThumbComponent implements OnInit {
  @Input() id: string;
  orderService: OrderService;
  cardService: CardService;

  order: Order;
  card: Card;
  image: string;
  total: number;

  constructor(
    _orderService: OrderService,
    _cardService: CardService
  ) {
    this.orderService = _orderService;
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.getOrder(this.id);
  }

  getOrder(id: string) {
    this.orderService.getOrder(id).then(order => {
      this.order = order;
      this.total = order.card_price! * this.order.count!;
      this.getCard(this.order.card_id!);
    })
  }

  getCard(id: string) {
    this.cardService.getACard(id).then(card => {
      this.card = card;
      this.loadimage(this.card.id!);
    });
  }

  loadimage(id: string) {
    this.cardService.getPrimaryImage(id).then(image => {
      this.getImage(image);
    })
  }

  getImage(image: string) {
    this.cardService.getImageURL(image).then(value => {
      this.image = value;
    });
  }

}
