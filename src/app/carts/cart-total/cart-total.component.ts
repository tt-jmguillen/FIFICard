import { OrderECard } from './../../models/order-ecard';
import { EmailService } from './../../services/email.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/models/payment';
import { environment } from './../../../environments/environment.prod';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { IPayPalConfig, ITransactionItem, ICreateOrderRequest } from 'ngx-paypal';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PriceService } from './../../services/price.service';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-cart-total',
  templateUrl: './cart-total.component.html',
  styleUrls: ['./cart-total.component.scss']
})
export class CartTotalComponent implements OnInit {
  @Input() uid: string;

  @Input() set orders(_orders: any[]) {
    this.allOrders = _orders;
  }

  @Input() location: 'ph' | 'us' | 'sg';

  priceService: PriceService;
  cardService: CardService;
  paymentService: PaymentService;
  userService: UserService;
  orderService: OrderService;
  emailService: EmailService;
  modalService: NgbModal;

  constructor(
    _priceService: PriceService,
    _cardService: CardService,
    _paymentService: PaymentService,
    _userService: UserService,
    _orderService: OrderService,
    _emailService: EmailService,
    _modalService: NgbModal
  ) {
    this.priceService = _priceService;
    this.cardService = _cardService;
    this.paymentService = _paymentService;
    this.userService = _userService;
    this.orderService = _orderService;
    this.emailService = _emailService;
    this.modalService = _modalService;
  }

  allOrders: any[] = [];
  selected: any[] = [];

  subtotal: number = 0;
  total: number = 0;
  shipping: number = 0;
  selectall: boolean = false;
  itemcount: number = 0;
  initalStatus: string = '';
  isPayment: boolean = false;
  gcashUploadedFile: string = '';
  payPalTransactionId: string = '';
  payPalPayerId: string = '';
  payPalPayerEmail: string = '';
  gcashRef: NgbModalRef;
  payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.paymentService.getInitial().then(status => this.initalStatus = status);
  }

  checkIfSelected(id: string): boolean {
    return this.selected.findIndex(x => x.id! === id) >= 0;
  }

  changeInclude(value: [string, boolean]) {
    let index = this.selected.findIndex(x => x.id! == value[0]);
    if (value[1]) {
      if (index < 0) {
        this.selected.push(this.allOrders.find(y => y.id! == value[0])!);
      }
    }
    else {
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }

    this.calculateTotal();
    this.isPayment = false;
  }

  delete(ids: string[]): Promise<void> {
    return new Promise(async resolve => {
      this.userService.getUser(this.uid).then(user => {
        let cart: string[] = user.carts;
        let ecart: string[] = user.ecarts;
        ids.forEach(async id => {
          let order = this.allOrders.find(x => x.id! == id);
          let card: Card = await this.cardService.getACard(order.card_id);

          if (card.type != 'ecard') {
            //await this.userService.removeItemOnCart(this.uid, order.id!);
            cart.splice(cart.findIndex(x => x === id), 1);
          }
          else {
            //await this.userService.removeItemOnECart(this.uid, order.id!);
            ecart.splice(ecart.findIndex(x => x === id), 1);
          }

          let index = this.selected.findIndex(x => x.id! == id);
          this.selected.splice(index, 1);

          index = this.allOrders.findIndex(x => x.id! == id);
          this.allOrders.splice(index, 1);
        });

        if (cart.length !== user.carts.length) {
          this.userService.updateCart(this.uid, cart);
        }
        if (ecart.length !== user.ecarts.length) {
          this.userService.updateECart(this.uid, ecart);
        }
        resolve();
      });
    });
  }

  calculateTotal() {
    this.subtotal = 0;
    this.shipping = 0;
    this.total = 0;
    this.selected.forEach(item => {
      this.subtotal = this.subtotal + Number(item.card_price);
      this.shipping = this.shipping + Number(item.shipping_fee ? item.shipping_fee : 0);
      this.total = this.total + Number(item.card_price) + Number(item.shipping_fee ? item.shipping_fee : 0);
    });
  }

  getCurrency() {
    if (this.location == 'us') {
      return 'USD'
    }
    else if (this.location == 'sg') {
      return 'SGD'
    }
    else {
      return environment.paypalCurrency
    }
  }

  sendECardEmail(order: OrderECard) {
    this.emailService.sendECardEmail(order).then(id => {
      this.orderService.updateECardSent(order.id, id);
    })
    this.emailService.SendECardConfirmEmail(order).then(id => {
      this.orderService.updateECardConfirm(order.id, id);
    })
  }

  saveTransaction(gateway: 'NOGATEWAY' | 'GCash' | 'PayPal') {
    let items: string[] = this.selected.map(x => x.id!);

    let payment: Payment = new Payment();
    payment.userId = this.uid;
    payment.orders = items;
    payment.gateway = gateway;

    if (gateway == "GCash") {
      payment.proof = this.gcashUploadedFile;
    }
    else if (gateway == "PayPal") {
      payment.transactionId = this.payPalTransactionId;
      payment.payerId = this.payPalPayerId;
      payment.payerEmail = this.payPalPayerEmail;
    }
    payment.total = this.total;
    payment.status = this.initalStatus;

    this.paymentService.createPayment(payment).then(async paymentId => {
      await this.userService.addPayment(this.uid, paymentId);
      this.selected.forEach(async order => {
        let card = await this.cardService.getACard(order.card_id!);

        if (card.type != 'ecard') {
          await this.orderService.updatePaidOrder(order.id!, paymentId);
        }
        else {
          await this.orderService.updatePaidECardOrder(order.id!, paymentId);
        }

        await this.userService.addOrder(this.uid, order.id!);
        await this.cardService.updateCardOrder(order.card_id!, order.id!);

        if (card.type == 'ecard') {
          await this.userService.removeItemOnECart(this.uid, order.id!);
        }
        else {
          await this.userService.removeItemOnCart(this.uid, order.id!);
        }

        if (card.type == 'ecard') {
          await this.sendECardEmail(order as OrderECard);
        }

        let index = this.selected.findIndex(x => x.id == order.id!)
        this.selected.splice(index, 1);

        index = this.allOrders.findIndex(x => x.id == order.id!)
        this.allOrders.splice(index, 1);

        this.calculateTotal();

        this.gcashRef.close('');
      });
    });
  }

  setPayPal() {
    this.payPalConfig = undefined;
    if (this.total > 0) {
      let items: ITransactionItem[] = [];
      this.selected.forEach(async order => {
        let card: Card = await this.cardService.getACard(order.card_id!);

        let itemname = 'Fibei Greetings: ' + card.name! + ' for ' + order.receiver_name!
        if (order.parentOrder != '') {
          itemname = 'Fibei Greetings: ' + card.name!;
        }

        let paypalItem: ITransactionItem = {
          name: itemname,
          quantity: (order.count ? order.count : 1).toString(),
          category: 'DIGITAL_GOODS',
          unit_amount: {
            currency_code: this.getCurrency(),
            value: (order.card_price! + Number(order.shipping_fee!)).toString()
          }
        }
        items.push(paypalItem);
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

  toPay() {
    if (this.total > 0) {
      this.setPayPal();
      this.isPayment = true;
    }
    else {
      this.saveTransaction('NOGATEWAY');
    }
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0];
    this.paymentService.uploadFile(file).then(result => {
      this.gcashUploadedFile = result.metadata.fullPath;
    })
  }

  payNow(gcash_payment: any) {
    this.gcashRef = this.modalService.open(gcash_payment, { ariaLabelledBy: 'modal-basic-title' });
  }

  includeAll() {
    this.selectall = !this.selectall;
    this.selected = this.selectall ? this.allOrders : [];
    this.calculateTotal();
  }

  deleteAll() {
    let ids: string[] = this.selected.map(x => x.id);
    this.delete(ids);
  }

}
