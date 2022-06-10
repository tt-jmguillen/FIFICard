import { AddMore } from './../models/add-more';
import { sign } from 'crypto';
import { SignAndSendDetails } from './../models/sign-and-send-details';
import { AddressService } from './../services/address.service';
import { EmailService } from './../services/email.service';
import { OrderService } from './../services/order.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../models/card';
import { Order } from '../models/order';
import { CardService } from '../services/card.service';
import { AppComponent } from '../app.component';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  id?: string;
  card?: Card;

  orders: Order[] = [];
  order: Order = new Order();
  SignAndSend: SignAndSendDetails[] = [];
  isValidOrder: Boolean = false;

  titleService: Title;
  appComponent: AppComponent
  activateRoute: ActivatedRoute;
  cardService: CardService;
  orderService: OrderService;
  userService: UserService;
  addressService: AddressService;
  modalService: NgbModal;
  router: Router;

  addMore: AddMore[] = [];

  confirmRef: NgbModalRef;
  ngbModalOptions: NgbModalOptions = {
    backdrop : 'static',
    keyboard : false
  };
  
  emailService: EmailService;

  isPayPalApproved: boolean = false;
  closeResult = '';
  uid: string;
  user: User;

  transactionId: string;
  payerId: string;
  payerEmail: string;

  primaryImageURL: string;

  totalCount: number = 0;
  total: number = 0;

  instruction: boolean = false;

  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;

  constructor(
    _titleService: Title,
    _appComponent: AppComponent,
    _activateRoute: ActivatedRoute,
    _cardService: CardService,
    _orderService: OrderService,
    _userService: UserService,
    _addressService: AddressService,
    _modalService: NgbModal,
    _router: Router,
    
    private _emailService: EmailService,
  ) {
    this.titleService = _titleService;
    this.appComponent = _appComponent;
    this.activateRoute = _activateRoute;
    this.cardService = _cardService;
    this.orderService = _orderService;
    this.userService = _userService;
    this.addressService = _addressService;
    this.modalService = _modalService;
    this.router = _router;
    
    this.emailService = _emailService;
  }

  ngOnInit(): void {
    this.order.sender_name = '';
    this.order.sender_phone = '';
    this.order.sender_email = '';
    this.order.receiver_name = '';
    this.order.receiver_phone = '';
    this.order.receiver_email = '';
    this.order.address = '';
    this.order.anonymously = false;
    this.order.sendto = "Recipient";
    this.order.message = '';
    this.order.withSignAndSend = false;
    this.order.count = 1;

    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
    this.order.user_id = this.uid;

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });

    this.loadUser();

    this.isValidOrder = this.validateOrder();
  }

  loadCard() {
    this.cardService.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.titleService.setTitle(this.card?.name!);
      this.order.card_id = data.id;
      this.order.card_price = data.price;
      this.getAvailableURL(this.card.primary!).then(url => {
        this.primaryImageURL = url;
      });
      this.isValidOrder = this.validateOrder();
    });
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      if (user.firstname && user.lastname){
        this.order.sender_name = user.firstname + ' ' + user.lastname;
      }
      if (user.email){
        this.order.sender_email = user.email;
      }
      if (user.address) {
        this.addressService.getAddress(user.address).then(address => {
          this.order.address = address.address + '\r\n' + address.address2 + '\r\n' + address.city + '\r\n' + address.province + '\r\n' + address.country + '\r\n ' + address.postcode;
        });
      }
      this.isValidOrder = this.validateOrder();
    })
  }

  validateOrder(): boolean{
    let isValid = true;
    if (!this.order.sender_name || (this.order.sender_name == '')){
      isValid = false;
    }
    if (!this.order.sender_phone || (this.order.sender_phone == '')){
      isValid = false;
    }
    if (!this.order.sender_email || (this.order.sender_email == '')){
      isValid = false;
    }
    if (!this.order.receiver_name || (this.order.receiver_name == '')){
      isValid = false;
    }
    if (!this.order.receiver_phone || (this.order.receiver_phone == '')){
      isValid = false;
    }
    if (!this.order.address || (this.order.address == '')){
      isValid = false;
    }
    if (!this.order.sendto || (this.order.sendto == '')){
      isValid = false;
    }
    return isValid;
  }

  onChange(type: string, event: any){
    if (type == "Sender-Name"){
      this.order.sender_name = event.target.value;
    }
    if (type == "Sender-Phone"){
      this.order.sender_phone = event.target.value;
    }
    if (type == "Sender-Email"){
      this.order.sender_email = event.target.value;
    }
    if (type == "Recipient-Name"){
      this.order.receiver_name = event.target.value;
    }
    if (type == "Recipient-Phone"){
      this.order.receiver_phone = event.target.value;
    }
    if (type == "Recipient-Email"){
      this.order.receiver_email = event.target.value;
    }
    if (type == "Address"){
      this.order.address = event.target.value;
    }
    if (type == "Anonymously"){
      this.order.anonymously = event.target.checked;
    }
    if (type == "SendTo"){
      this.order.sendto = event.target.value;
    }
    if (type == "Message"){
      this.order.message = event.target.value;
    }
  }

  onKeyUp(type: string, event: any){  
    this.isValidOrder = this.validateOrder();
  }

  addToCart(confirm: any){
    this.computeTotal();
    this.createAnOrder(this.order).then(id => {
      this.addMore.forEach(item => {
        if (item.count > 0){
          let order: Order = new Order();
          order.card_id = item.card.id;
          order.card_price = item.card.price;
          order.count = item.count;
          order.parentOrder = id;
          order.user_id = this.uid;

          this.createAnAddMoreOrder(order).then(_id => {
             console.log(_id);
          });
        }
      });
      this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
    });
  }

  createAnOrder(order: Order): Promise<string>{
    return new Promise((resolve) => {
      this.orderService.createOrder(order).then(id => {
        this.SignAndSend.forEach(sign => {
          this.orderService.addSignAndSend(id, sign);
        });
        this.userService.addItemOnCart(this.uid, id);
        resolve(id);
      })
    })
  }

  createAnAddMoreOrder(order: Order): Promise<string>{
    return new Promise((resolve) => {
      this.orderService.createAddMore(order).then(id => {
        this.userService.addItemOnCart(this.uid, id);
        resolve(id);
      })
    })
  }

  test(confirm: any){
    this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
  }

  confirmation(confirm: any) {
    this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
  }

  receiveSignAndSend(signAndSendDetails: SignAndSendDetails[]){
    this.order.withSignAndSend = true;
    this.SignAndSend = signAndSendDetails;
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve) => {
      this.cardService.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.cardService.getImageURL(image).then(url => {
          resolve(url);
        }).catch(err => { });
      });
    });
  }

  keepShopping(){
    this.confirmRef.close('');
    this.router.navigate(['/events']);
  }

  cart(){
    this.confirmRef.close('');
    this.router.navigate(['/cart']);
  }

  addMoreChange(value: AddMore[]){
    this.addMore = value;
    this.computeTotal();
  }

  computeTotal(){
    if (this.order){
      this.total = Number(this.order.card_price!) * Number(this.order.count!);
      this.totalCount = 1;
    }

    this.addMore.forEach(item => {
      if (item.count > 0){
        this.total = this.total + (Number(item.card.price!) * Number(item.count!));
        this.totalCount++;
      }
    })
  }

  showInstruction(){
    this.instruction = !this.instruction;
  }
}
