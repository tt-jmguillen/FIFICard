import { OrderService } from './../services/order.service';
import { PaymentService } from './../services/payment.service';
import { CardService } from 'src/app/services/card.service';
import { UserService } from 'src/app/services/user.service';
import { Component, NgModuleFactory, OnInit } from '@angular/core';
import { Card } from '../models/card';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { environment } from 'src/environments/environment';

class UserCart {
  public id: string;
  public order: Order;
  public card: Card;
  public url: string;
  public selected: boolean;
  public visible: boolean;

  constructor(_id: string) {
    this.id = _id;
    this.order = new Order();
    this.card = new Card();
    this.url = '';
    this.selected = true;
    this.visible = true;
  }
}

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})

export class CartsComponent implements OnInit {
  uid: string;
  userCarts: UserCart[] = [];
  total: number = 0;
  initalStatus: string;
  gcashUploadedFile: string = '';
  payPalTransactionId: string = '';
  payPalPayerId: string = '';
  payPalPayerEmail: string = '';
  gcashRef: NgbModalRef;
  payPalConfig?: IPayPalConfig;
  userService: UserService;
  orderService: OrderService;
  cardService: CardService;
  paymentService: PaymentService;
  modalService: NgbModal;

  constructor(
    _userService: UserService,
    _orderService: OrderService,
    _cardService: CardService,
    _paymentService: PaymentService,
    _modalService: NgbModal
  ) {
    this.userService = _userService;
    this.orderService = _orderService;
    this.cardService = _cardService;
    this.paymentService = _paymentService;
    this.modalService = _modalService;
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
    this.paymentService.getInitial().then(status => this.initalStatus = status);
    this.userService.subscribeUser(this.uid).subscribe(user => {
      this.loadCarts(user.carts);
    })
  }

  loadCarts(ids: string[]) {
    this.userCarts.forEach(userCart => {
      userCart.visible = false;
    });

    ids.forEach(id => {
      let isFound: boolean = false;

      this.userCarts.forEach(userCart => {
        if (userCart.id == id){
          userCart.visible = true;
          isFound = true;
        }
      });

      if(isFound == false){
        this.userCarts.push(new UserCart(id));
        this.orderService.getOrder(id).then(order => {
          
          this.userCarts.forEach(userCart => {
            if (userCart.id == order.id) {
              userCart.order = order;
              this.computeTotal();
              this.setPayPal();
            }
          });

          this.cardService.getACard(order.card_id!).then(card => {
            this.userCarts.forEach(userCart => {
              if (userCart.order) {
                if (userCart.order.card_id == card.id) {
                  userCart.card = card;
                  this.getAvailableURL(card.primary!).then(url => {
                    userCart.url = url;
                  })
                  this.setPayPal();
                }
              }
            });

            
          });

          this.computeTotal();
        });
      }
    });

    this.userCarts.forEach(userCart => {
      if (userCart.visible == false){
        userCart.selected = false;
      }
    });
  }

  computeTotal() {
    let currentTotal: number = 0;
    this.userCarts.forEach(userCart => {
      if (userCart.selected) {
        currentTotal = currentTotal + Number(userCart.order.card_price!);
      }
    });

    this.total = currentTotal;
  }

  onInclude(id: string, event: any) {
    this.userCarts.forEach(userCart => {
      if (userCart.order.id == id) {
        userCart.selected = event.target.checked;
      }
      this.computeTotal();
      this.setPayPal();
    })
  }

  remove(userCart: UserCart){
    this.userService.removeItemOnCart(this.uid, userCart.id);
    userCart.visible = false;
    if (userCart.selected){
      userCart.selected = false;
      this.computeTotal();
      this.setPayPal();
    }
  }

  payNow(gcash_payment: any) {
    this.gcashRef = this.modalService.open(gcash_payment, { ariaLabelledBy: 'modal-basic-title' });
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0];
    this.paymentService.uploadFile(file).then(result => {
      this.gcashUploadedFile = result.metadata.fullPath;
    })
  }

  saveTransaction(gateway: string) {
    let orders: string[] = [];

    this.userCarts.forEach(userCart => {
      if (userCart.selected) {
        orders.push(userCart.id);
      }
    })

    let payment: Payment = new Payment();
    payment.userId = this.uid;
    payment.orders = orders;
    payment.gateway = gateway;
    if (gateway == "GCash") {
      payment.proof = this.gcashUploadedFile;
    }
    if (gateway == "PayPal"){
      payment.transactionId = this.payPalTransactionId;
      payment.payerId = this.payPalPayerId;
      payment.payerEmail = this.payPalPayerEmail;
    }
    payment.total = this.total;
    payment.status = this.initalStatus;

    this.paymentService.createPayment(payment).then(paymentId => {
      this.userService.addPayment(this.uid, paymentId);
      orders.forEach(orderId => {
        this.userService.removeItemOnCart(this.uid, orderId);
        this.orderService.updatePaidOrder(orderId, paymentId);
        this.userService.addOrder(this.uid, orderId);
      });

      if (gateway == "GCash") {
        this.gcashRef.close("Done");
      }
    });
  }

  setPayPal() {
    this.payPalConfig = undefined;

    if (this.userCarts.length > 0) {
      let items: ITransactionItem[] = [];
      this.userCarts.forEach(userCart => {
        if (userCart.selected) {
          let item: ITransactionItem = {
            name: 'Fibei Greetings: ' + userCart.card.name + ' for ' + userCart.order.receiver_name,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: environment.paypalCurrency,
              value: userCart.order.card_price!.toString()
            }
          }
          items.push(item);
        }
      });

      this.payPalConfig = {
        currency: environment.paypalCurrency,
        clientId: environment.paypalClientId,
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: environment.paypalCurrency,
                value: this.total.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: environment.paypalCurrency,
                    value: this.total.toFixed(2)
                  }
                }
              },
              items: items
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
        onClientAuthorization: (data) => {
          this.payPalTransactionId = data.id;
          this.payPalPayerId = data.payer.payer_id?data.payer.payer_id:'';
          this.payPalPayerEmail = data.payer.email_address?data.payer.email_address:'';
          this.saveTransaction("PayPal");
        },
      }
    }
    /*
    this.payPalConfig = {
      currency: environment.paypalCurrency,
      clientId: environment.paypalClientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: environment.paypalCurrency,
              value: this.total.toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: environment.paypalCurrency,
                  value: this.total.toFixed(2)
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
    };*/
  }

  getAvailableURL(image: string): Promise<string>{
    return new Promise((resolve) => {
      this.cardService.getImageURL(image + environment.imageSize.small).then(url => {
        resolve(url);
      }).catch(err => {
        this.cardService.getImageURL(image).then(url => {
          resolve(url);
        }).catch(err => {});
      });
    });
  }
}
