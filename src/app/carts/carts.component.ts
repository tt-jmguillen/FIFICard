import { OrderECard } from './../models/order-ecard';
import { EmailService } from './../services/email.service';
import { PriceService } from './../services/price.service';
import { OrderService } from './../services/order.service';
import { PaymentService } from './../services/payment.service';
import { CardService } from 'src/app/services/card.service';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Card } from '../models/card';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Payment } from '../models/payment';
import { Order } from '../models/order';
import { ICreateOrderRequest, IPayPalConfig, ITransactionItem } from 'ngx-paypal';
import { environment } from 'src/environments/environment';

class Collection {
  public id: string;
  public cardid: string;
  public cardname: string;
  public receivername: string;
  public included: boolean;
  public price: number;
  public qty: number;
  public shipping: number;
  public parent: string;
  public bundle: boolean;
  public type: 'card' | 'gift' | 'sticker' | 'postcard' | 'ecard';
  public order: Order;
  public card: Card;

  constructor(_id: string) {
    this.id = _id;
    this.cardid = '';
    this.cardname = '';
    this.receivername = '';
    this.included = true;
    this.price = 0;
    this.qty = 1;
    this.shipping = 0;
    this.parent = '';
    this.bundle = false;
  }

  loadOrder(value: Order) {
    this.receivername = value.receiver_name!;
    this.parent = value.parentOrder ? value.parentOrder! : '';
    this.price = value.card_price!;
    this.qty = value.count ? value.count! : 1;
    this.bundle = value.bundle ? value.bundle! : false;
    if (value.shipping_fee! > 0) {
      this.shipping = Number(value.shipping_fee);
    }
  }

  loadCard(value: Card) {
    this.cardid = value.id!;
    this.cardname = value.name!;
    this.type = value.type!;
  }
}

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})

export class CartsComponent implements OnInit, AfterViewInit {
  uid: string;

  collection: Collection[] = []
  carts: string[] = [];
  ecarts: string[] = [];

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
  priceService: PriceService;
  emailService: EmailService;
  modalService: NgbModal;

  isPayment: Boolean = false;

  constructor(
    _userService: UserService,
    _orderService: OrderService,
    _cardService: CardService,
    _paymentService: PaymentService,
    _priceService: PriceService,
    _emailService: EmailService,
    _modalService: NgbModal
  ) {
    this.userService = _userService;
    this.orderService = _orderService;
    this.cardService = _cardService;
    this.paymentService = _paymentService;
    this.priceService = _priceService;
    this.emailService = _emailService;
    this.modalService = _modalService;
  }

  ngOnInit(): void {
    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;
    this.paymentService.getInitial().then(status => this.initalStatus = status);
  }

  ngAfterViewInit(): void {
    this.loadUserCard();
  }

  loadUserCard() {
    this.collection = [];
    this.userService.getUser(this.uid).then(user => {
      this.carts = user.carts;
      this.ecarts = user.ecarts;

      if (this.carts.length > 0) {
        this.carts.forEach(async cart => {
          let order = await this.orderService.getOrder(cart);
          let card = await this.cardService.getACard(order.card_id!);
          let col = new Collection(order.id!);
          col.loadOrder(order);
          col.loadCard(card);
          col.order = order;
          col.card = card;
          this.collection.push(col);
          this.computeTotal();
        });
      }

      if (this.ecarts.length > 0) {
        this.ecarts.forEach(async cart => {
          let order = await this.orderService.getECardOrder(cart);
          let card = await this.cardService.getACard(order.card_id!);
          let col = new Collection(order.id!);
          col.loadOrder(order);
          col.loadCard(card);
          col.order = order;
          col.card = card;
          this.collection.push(col);
          this.computeTotal();
        });
      }
    })
  }

  getUserCart(carts: string[]) {
    this.carts = carts;
    carts.forEach(cart => {
      if (this.collection.findIndex(x => x.id == cart) < 0) {
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
        item.bundle = value.bundle!;
        if (value.shipping_fee! > 0) {
          item.shipping = Number(value.shipping_fee);
        }
      }
    })
    this.computeTotal();
  }

  updateCard(value: [string, Card]) {
    this.collection.forEach(item => {
      if (item.id == value[0]) {
        let card = value[1] as Card;
        item.cardid = card.id!;
        item.cardname = card.name!;
      }
      this.computeTotal();
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
      if (item.id != value[0]) {
        if (isParent) {
          if (item.parent == value[0]) {
            item.included = value[1];
          }
        }
        else {
          if (value[1]) {
            if (item.id == parentId) {
              item.included = value[1];
            }
          }
        }
      }
    });

    this.computeTotal();
  }

  delete(value: string) {
    let ids: string[] = [];
    this.collection.reverse().forEach((item, index) => {
      if ((item.id == value) || (item.parent == value)) {
        ids.push(item.id);
      }
    })
    if (ids.length > 0) {
      this.userService.removeItemsOnCart(this.uid, ids).then(carts => {
        this.loadUserCard();
      })
    }
  }

  computeTotal() {
    let currentTotal: number = 0;
    this.collection.forEach(item => {
      if (item.included) {
        if (!item.bundle)
          currentTotal = currentTotal + (Number(item.price) * Number(item.qty ? item.qty : 1)) + item.shipping;
        else
          currentTotal = currentTotal + Number(item.price) + item.shipping;
      }
    });

    this.total = currentTotal;
    this.isPayment = false;
  }

  toPay(){
    this.setPayPal();
    this.isPayment = true;
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
      if (item.included) {
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
        let card = this.collection.find(x => x.card.id!)!;
        if (card.type != 'ecard'){
          this.orderService.updatePaidOrder(id, paymentId);
        }
        else{
          this.orderService.updatePaidECardOrder(id, paymentId);
        }

        this.userService.addOrder(this.uid, id);

        this.cardService.updateCardOrder(card.id, id);

        if (card.type == 'ecard'){
          this.orderService.getECardOrder(id).then(order => {
            this.sendECardEmail(order);
          });
        }
        
        let index: number = this.collection.findIndex(x => x.id == id);
        this.collection.splice(index, 1);
      });

      this.userService.removeItemsOnCart(this.uid, items).then(carts => {
        this.isPayment = false;

        if (gateway == "GCash") {
          this.gcashRef.close("Done");
        }
      })

      this.computeTotal();
    });
  }

  getCurrency(): string {
    const location = this.priceService.getLocation();
    if (location == 'us') {
      return 'USD'
    }
    else if (location == 'sg') {
      return 'SGD'
    }
    else {
      return environment.paypalCurrency
    }
  }

  setPayPal() {
    this.payPalConfig = undefined;
    if (this.total > 0) {
      let items: ITransactionItem[] = [];

      this.collection.forEach(item => {
        let itemname = 'Fibei Greetings: ' + item.cardname + ' for ' + item.receivername;
        if (item.parent != '') {
          itemname = 'Fibei Greetings: ' + item.cardname;
        }

        if (item.included) {
          let paypalItem: ITransactionItem = {
            name: itemname,
            quantity: item.qty.toString(),
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: this.getCurrency(),
              value: (item.price + item.shipping).toString()
            }
          }
          items.push(paypalItem);
        }
      });

      this.payPalConfig = {
        currency: this.getCurrency(),
        clientId: environment.paypalClientId,
        createOrderOnClient: (data) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: this.getCurrency(),
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

  sendECardEmail(order: OrderECard){
    this.emailService.sendECardEmail(order).then(id => {
      this.orderService.updateECardSent(order.id, id);
    })
    this.emailService.SendECardConfirmEmail(order).then(id => {
      this.orderService.updateECardConfirm(order.id, id);
    })
  }
}
