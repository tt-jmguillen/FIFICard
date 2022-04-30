import { OrderService } from './../../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

export class UserOrder{
  public id: string;
  public order: Order;
}

@Component({
  selector: 'app-profile-orders',
  templateUrl: './profile-orders.component.html',
  styleUrls: ['./profile-orders.component.scss']
})
export class ProfileOrdersComponent implements OnInit {
  uid: string;
  user: User;
  orders: UserOrder[] = [];
  userService: UserService;
  orderService: OrderService;

  constructor(
    private _userService: UserService,
    private _orderService: OrderService
  ) { 
    this.userService = _userService;
    this.orderService = _orderService;
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!); 
    this.uid = userDetails?.uid;
    this.loadUser();
  }

  loadUser(){
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      this.loadOrders(user.orders);
    })
  }

  loadOrders(orders: string[])
  {
    orders.slice().reverse().forEach(id => {
      let userOrder = new UserOrder();
      userOrder.id = id;
      this.orders.push(userOrder);
    });

    this.orders.forEach(userOrder => {
      this.orderService.getOrder(userOrder.id).then(order => {
        this.updateOrder(order);
      })
    });
  }

  updateOrder(order: Order){
    this.orders.forEach(userOrder => {
      if (userOrder.id == order.id){
        userOrder.order = order;
      }
    });
    console.log(this.orders);
  }

}
