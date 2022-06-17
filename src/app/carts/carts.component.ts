import { OrderService } from './../services/order.service';
import { PaymentService } from './../services/payment.service';
import { CardService } from 'src/app/services/card.service';
import { UserService } from 'src/app/services/user.service';
import { AfterViewInit, Component, NgModuleFactory, OnInit } from '@angular/core';
import { Card } from '../models/card';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { Console } from 'console';

class Collection {
  public id: string;
  public cardname: string;
  public receivername: string;
  public included: boolean;
  public price: number;
  public qty: number;
  public parent: string;

  constructor(_id: string) {
    this.id = _id;
    this.cardname = '';
    this.receivername = '';
    this.included = true;
    this.price = 0;
    this.qty = 0;
    this.parent = '';
  }
}

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})

export class CartsComponent implements OnInit {
  uid: string;

  collection: Collection[] = []
  carts: string[] = [];

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

    this.userService.getUser(this.uid).then(user => {
      this.carts = user.carts;
      user.carts.forEach(id => this.collection.push(new Collection(id)));
    })
  }

  getUserCart(carts: string[]){
    this.carts = carts;
    carts.forEach(cart => {
      if (this.collection.findIndex(x => x.id == cart) < 0){
        this.collection.push(new Collection(cart));
      }
    })
  }

  updateOrder(value: Order) {
    this.collection.forEach(item => {
      if (item.id == value.id!) {
        item.receivername = value.receiver_name!;
        item.parent = value.parentOrder!;
        item.price = value.card_price!;
        item.qty = value.count!;
      }
    })
    this.computeTotal();
  }

  updateCard(value: [string, Card]) {
    this.collection.forEach(item => {
      if (item.id == value[0]) {
        let card = value[1] as Card;
        item.cardname = card.name!;
      }
    });
  }

  changeInclude(value: [string, boolean]) {
    let isParent: boolean = false;
    let parentId: string = '';
    
    this.collection.forEach(item => {
      if (item.id == value[0]) {
        item.included = value[1];
        isParent = item.parent == undefined;
        parentId = item.parent;
      }
    });
    
    this.collection.forEach(item => {
      if (item.id != value[0]){
        if (isParent){
          if (item.parent == value[0]){
            item.included = value[1];
          }
        }
        else{
          if (value[1]){
            if (item.id == parentId){
              item.included = value[1];
            }
          }
        }
      }
    });

    this.computeTotal();
  }

  delete(value: string) {
    let index: number = this.collection.findIndex(x => x.id == value);
    this.collection.splice(index, 1);
    this.userService.removeItemOnCart(this.uid, value);
    this.computeTotal();
  }

  computeTotal() {
    let currentTotal: number = 0;
    this.collection.forEach(item => {
      if (item.included) {
        currentTotal = currentTotal + (Number(item.price) * Number(item.qty));
      }
    });

    this.total = currentTotal;
    this.setPayPal();
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
    let items: string[] = [];
    this.collection.forEach(item => {
      if(item.included){
        items.push(item.id);
      }
    })

    let payment: Payment = new Payment();
    payment.userId = this.uid;
    payment.orders = items;
    payment.gateway = gateway;
    
    if (gateway == "GCash") {
      payment.proof = this.gcashUploadedFile;
    }
    if (gateway == "PayPal") {
      payment.transactionId = this.payPalTransactionId;
      payment.payerId = this.payPalPayerId;
      payment.payerEmail = this.payPalPayerEmail;
    }
    payment.total = this.total;
    payment.status = this.initalStatus;

    this.paymentService.createPayment(payment).then(paymentId => {
      this.userService.addPayment(this.uid, paymentId);

      items.forEach(id => {
        this.orderService.updatePaidOrder(id, paymentId);
        this.userService.addOrder(this.uid, id);
        //this.userService.removeItemOnCart(this.uid, id);
        let index: number = this.collection.findIndex(x => x.id == id);
        this.collection.splice(index, 1);
      });

      this.userService.removeItemsOnCart(this.uid, items);

      this.computeTotal();
      this.setPayPal();

      if (gateway == "GCash") {
        this.gcashRef.close("Done");
      }
      
    });
  }

  setPayPal() {
    this.payPalConfig = undefined;

    if (this.total > 0) {
      let items: ITransactionItem[] = [];

      this.collection.forEach(item => {
        let itemname = 'Fibei Greetings: ' + item.cardname + ' for ' + item.receivername;
        if (item.parent != ''){
          itemname = 'Fibei Greetings: ' + item.cardname;
        }

        if (item.included) {
          let paypalItem: ITransactionItem = {
            name: itemname,
            quantity: item.qty.toString(),
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: environment.paypalCurrency,
              value: item.price.toString()
            }
          }
          items.push(paypalItem);
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
          this.payPalPayerId = data.payer.payer_id ? data.payer.payer_id : '';
          this.payPalPayerEmail = data.payer.email_address ? data.payer.email_address : '';
          this.saveTransaction("PayPal");
        },
      }
    }
  }
}
