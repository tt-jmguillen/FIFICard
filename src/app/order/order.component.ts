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

  /*
  private initConfig(price: string, cardName: string): void {
    this.payPalConfig = {
      currency: environment.paypalCurrency,
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: environment.paypalCurrency,
              value: price,
              breakdown: {
                item_total: {
                  currency_code: environment.paypalCurrency,
                  value: price
                }
              }
            },
            items: [
              {
                name: 'Fibei Greetings: ' + cardName,
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: environment.paypalCurrency,
                  value: price,
                },
              }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        //console.log('onApprove - transaction was approved, but not authorized', data, actions);
        //actions.order.get().then((details: any) => {
        //  console.log('onApprove - you can get full order details inside onApprove: ', details);
        //});
        //this.isPayPalApproved = true;
        //this.showSuccess = true;
        //this.modalService.dismissAll();
        //this.submitOrder("PayPal");
      },
      onClientAuthorization: (data) => {
        //console.log('onClientAuthorization - inform your server about completed transaction at this point', data);

        this.transactionId = data.id;
        if (data.payer.payer_id)
          this.payerId = data.payer.payer_id;
        if (data.payer.email_address)
          this.payerEmail = data.payer.email_address;

        this.isPayPalApproved = true;
        this.showSuccess = true;
        this.modalService.dismissAll();
        this.submitOrder("PayPal");
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.resetStatus();
      },
      onInit: (data, actions) => {
        console.log('onInit', data, actions);
      }
    };
  }
  */

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
    this.orderService.createOrder(this.order).then(id => {
      this.SignAndSend.forEach(sign => {
        this.orderService.addSignAndSend(id, sign);
      });
      this.userService.addItemOnCart(this.uid, id);
      this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
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
}
