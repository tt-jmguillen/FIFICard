import { CartTotalComponent } from './cart-total/cart-total.component';
import { OrderECard } from './../models/order-ecard';
import { EmailService } from './../services/email.service';
import { PriceService } from './../services/price.service';
import { OrderService } from './../services/order.service';
import { PaymentService } from './../services/payment.service';
import { CardService } from 'src/app/services/card.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})

export class CartsComponent implements OnInit, AfterViewInit {  
  userService: UserService;
  orderService: OrderService;

  isPayment: Boolean = false;

  constructor(
    _userService: UserService,
    _orderService: OrderService
  ) {
    this.userService = _userService;
    this.orderService = _orderService;
  }

  uid: string;
  phOrder: any[] = [];
  usOrder: any[] = [];
  sgOrder: any[] = [];
  loaded: boolean = false;

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
  }

  ngAfterViewInit(): void {
    this.loadUserCard();
  }

  loadUserCard() {
    this.userService.subscribeUser(this.uid).subscribe(user => {
      this.phOrder = [];
      this.usOrder = [];
      this.sgOrder = [];

      if (user.carts) {
        user.carts.forEach(async cart => {
          let order = await this.orderService.getOrder(cart);
          if (order.location == 'us') {
            this.usOrder.push(order);
          }
          else if (order.location == 'sg') {
            this.sgOrder.push(order);
          }
          else {
            this.phOrder.push(order);
          }


        });
      }

      if (user.ecarts) {
        user.ecarts.forEach(async cart => {
          let order = await this.orderService.getECardOrder(cart);
          if (order.location == 'us') {
            this.usOrder.push(order);
          }
          else if (order.location == 'sg') {
            this.sgOrder.push(order);
          }
          else {
            this.phOrder.push(order);
          }
        });
      }
    })
  }
}
