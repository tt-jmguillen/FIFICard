import { SignAndSendDetails } from './../models/sign-and-send-details';
import { AddressService } from './../services/address.service';
import { EmailService } from './../services/email.service';
import { OrderService } from './../services/order.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../models/card';
import { Order } from '../models/order';
import { CardService } from '../services/card.service';
import { Cart } from '../models/cart';
import { AppComponent } from '../app.component';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

export class Validation {
  public sender_name: boolean = true;
  public sender_phone: boolean = true;
  public sender_email: boolean = true;
  public receiver_name: boolean = true;
  public receiver_phone: boolean = true;
  public address: boolean = true;
  public sendto: boolean = true;
  public proof: boolean = true;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  id?: string;
  card?: Card;
  proof: string = '';
  activateRoute: ActivatedRoute;
  service: CardService;
  orderService: OrderService;
  emailService: EmailService;
  fb: FormBuilder;
  router: Router;
  orderForm: FormGroup;
  paymentForm: FormGroup;
  validation: Validation = new Validation();
  isUploading: boolean = false;
  initialStatus: string;
  isPayPalApproved: boolean = false;
  closeResult = '';
  userService: UserService;
  addressService: AddressService;
  uid: string;
  user: User;

  transactionId: string;
  payerId: string;
  payerEmail: string;

  public payPalConfig?: IPayPalConfig;
  public showSuccess: boolean = false;
  public showCancel: boolean = false;
  public showError: boolean = false;

  constructor(
    private appComponent: AppComponent,
    private _activateRoute: ActivatedRoute,
    private _service: CardService,
    private _orderService: OrderService,
    private _emailService: EmailService,
    private _fb: FormBuilder,
    private _router: Router,
    private titleService: Title,
    private modalService: NgbModal,
    private _userService: UserService,
    private _addressService: AddressService
  ) {
    this.activateRoute = _activateRoute;
    this.service = _service;
    this.orderService = _orderService;
    this.emailService = _emailService;
    this.fb = _fb;
    this.router = _router;
    this.userService = _userService;
    this.addressService = _addressService;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });

    this.getStatus();

    this.orderForm = this.fb.group({
      sender_name: ['', [Validators.required]],
      sender_phone: ['', [Validators.required]],
      sender_email: ['', [Validators.required]],
      receiver_name: ['', [Validators.required]],
      receiver_phone: ['', [Validators.required]],
      receiver_email: ['',],
      address: ['', [Validators.required]],
      anonymously: [Boolean(false)],
      sendto: ['Recipient', [Validators.required]],
      message: ['',]
    });

    this.paymentForm = this.fb.group({
      proof: ['',]
    });

    this.loadUser();

    this.orderService.getOrderInProgress(this.uid, this.id!).then(orders => {
      if (orders.length > 0){
        this.orderForm.patchValue({
          sender_name: orders[0].sender_name,
          sender_phone: orders[0].sender_phone,
          sender_email: orders[0].sender_email,
          receiver_name: orders[0].receiver_name,
          receiver_phone: orders[0].receiver_phone,
          receiver_email: orders[0].receiver_email,
          address: orders[0].address,
          anonymously: orders[0].anonymously,
          sendto: orders[0].sendto,
          message: orders[0].message,
        });
      }
    })
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      this.orderForm.patchValue({
        sender_name: user.firstname + ' ' + user.lastname,
        sender_email: user.email,
      });
      if (user.address) {
        this.loadAddress(user.address)
      }
    })
  }

  loadAddress(id: string) {
    this.addressService.getAddress(id).then(address => {
      this.orderForm.patchValue({
        address: address.address + '\r\n' + address.address2 + '\r\n' + address.city + '\r\n' + address.province + '\r\n' + address.country + '\r\n ' + address.postcode
      })
    });
  }

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

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }

  closeShowSuccess() {
    this.showError = false;
  }

  getStatus() {
    this.orderService.getInitial().then(data => { this.initialStatus = data });
  }

  loadCard() {
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.titleService.setTitle(this.card?.name!);

      console.log("PRICE: " + JSON.stringify(this.card));
      this.initConfig(String(this.card?.price), String(this.card?.name));
    });
  }

  payNow(content: any) {
    if (this.validateOrder()) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  validateOrder(): boolean {
    if (this.orderForm.valid) {
      return true;
    }
    else {
      this.validation.sender_name = this.orderForm.controls['sender_name']['status'] == "VALID";
      this.validation.sender_phone = this.orderForm.controls['sender_phone']['status'] == "VALID";
      this.validation.sender_email = this.orderForm.controls['sender_email']['status'] == "VALID";
      this.validation.receiver_name = this.orderForm.controls['receiver_name']['status'] == "VALID";
      this.validation.receiver_phone = this.orderForm.controls['receiver_phone']['status'] == "VALID";
      this.validation.address = this.orderForm.controls['address']['status'] == "VALID";
      this.validation.sendto = this.orderForm.controls['sendto']['status'] == "VALID";
      return false;
    }
  }

  submitOrder(gateway: string) {
    let userDetails: string = localStorage.getItem('user')!;
    if (userDetails == null || userDetails.length < 0) {
      this.appComponent.openLoginDialog(null);
    } else {
      console.log(this.orderForm.value);
      let order: Order = this.orderForm.value as Order;
      order.user_id = this.uid;
      order.card_id = this.card?.id;
      order.card_name = this.card?.name;
      order.card_price = this.card?.price;
      order.gateway = gateway;
      order.status = this.initialStatus;

      if (gateway == "PayPal") {
        order.proof = '';
        order.transaction_id = this.transactionId;
        if (this.payerId) {
          order.payer_id = this.payerId;
        }
        if (this.payerEmail) {
          order.payer_email = this.payerEmail;
        }
      }
      else {
        order.proof = this.proof;
        order.transaction_id = '';
        order.payer_id = '';
        order.payer_email = '';
      }

      this.orderService.createOrder(order).then(order => {
        this.userService.addOrder(this.uid, order.id!);
        this.emailService.sendOrderEmail(order);
        this.orderForm.reset();

        this.orderService.getSignAndSendData(this.uid, this.id!).then(signs => {
          signs.forEach((sign: SignAndSendDetails) => {
            this.orderService.addSignAndSend(order.id!, sign);
            this.orderService.deleteSignAndSendData(this.uid, this.id!, sign.id);
          });
        });

        this.orderService.getOrderInProgress(this.uid, this.id!).then(orders => {
          orders.forEach(order => {
            this.orderService.deleteOrderInProgressa(this.uid, this.id!, order.id!);
          })
        })

        let cart: Cart = new Cart(order.id!, this.card!.name!);
        this.addLocalStorage(cart);
        this.modalService.dismissAll();
        this.router.navigate(['/status/' + order.id!]);
      })
    }
  }

  uploadFile(event: any) {
    this.isUploading = true;
    const file: File = event.target.files[0];
    this.orderService.uploadFile(file).then(result => {
      this.proof = result.metadata.fullPath;
      this.validation.proof = this.proof != '';
      this.isUploading = false;
    })
  }

  addLocalStorage(cart: Cart) {
    let jsonString: string = localStorage.getItem('cart')!;
    if (jsonString != null) {
      let carts: Cart[] = JSON.parse(jsonString) as Cart[];
      localStorage.setItem("cart", JSON.stringify(carts));
    }
    else {
      let carts: Cart[] = [cart];
      localStorage.setItem("cart", JSON.stringify(carts));
    }
  }

  signAndSend() {
    this.orderService.getOrderInProgress(this.uid, this.id!).then(orders => {
      orders.forEach(element => {
        this.orderService.deleteOrderInProgressa(this.uid, this.id!, element.id!);
      });

      let order: Order = this.orderForm.value as Order;
      order.user_id = this.uid;
      order.card_id = this.card?.id;
      order.card_name = this.card?.name;
      order.card_price = this.card?.price;
      this.orderService.addOrderInProgress(this.uid, this.id!, order);
    });
    this.router.navigate(['/signandsend/' + this.id!])
  }
}
