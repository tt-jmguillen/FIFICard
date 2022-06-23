import { ShippingService } from './../services/shipping.service';
import { EventService } from './../services/event.service';
import { Fee } from './../models/fee';
import { AddressConfig } from './../models/address-config';
import { AddMore } from './../models/add-more';
import { SignAndSendDetails } from './../models/sign-and-send-details';
import { AddressService } from './../services/address.service';
import { EmailService } from './../services/email.service';
import { OrderService } from './../services/order.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Card } from '../models/card';
import { Order } from '../models/order';
import { CardService } from '../services/card.service';
import { AppComponent } from '../app.component';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { Event } from '../models/event';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  id?: string;
  card: Card = new Card();

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
  eventService: EventService;
  shippingService: ShippingService;
  modalService: NgbModal;
  router: Router;

  addMore: AddMore[] = [];

  confirmRef: NgbModalRef;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };

  emailService: EmailService;

  uid: string;
  user: User;

  transactionId: string;
  payerId: string;
  payerEmail: string;

  primaryImageURL: string;

  totalCount: number = 0;
  total: number = 0;

  instruction: boolean = false;

  addressConfig: AddressConfig[] = [];
  cities: string[] = [];

  allEvents: Event[] = [];
  allFees: Fee[] = [];

  constructor(
    _titleService: Title,
    _appComponent: AppComponent,
    _activateRoute: ActivatedRoute,
    _cardService: CardService,
    _orderService: OrderService,
    _userService: UserService,
    _addressService: AddressService,
    _eventService: EventService,
    _shippingService: ShippingService,
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
    this.eventService = _eventService;
    this.shippingService = _shippingService;
    this.modalService = _modalService;
    this.router = _router;

    this.emailService = _emailService;
  }

  ngOnInit(): void {
    this.getAddressConfig();
    this.getAllEvents();
    this.getAllFees();

    this.order.sender_name = '';
    this.order.sender_phone = '';
    this.order.sender_email = '';
    this.order.receiver_name = '';
    this.order.receiver_phone = '';
    this.order.receiver_email = '';
    this.order.address = '';
    this.order.address1 = '';
    this.order.address2 = '';
    this.order.province = '';
    this.order.city = '';
    this.order.country = '';
    this.order.postcode = '';
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
      this.card = data;
      this.titleService.setTitle(this.card?.name!);
      this.order.card_id = data.id;
      this.order.card_price = data.price;
      this.getFeeAmount(this.order.province!, this.card.events!).then(amount => {
        this.order.shipping_fee = Number(amount);
        this.computeTotal();
      })
      this.getAvailableURL(this.card.primary!).then(url => {
        this.primaryImageURL = url;
      });
      this.isValidOrder = this.validateOrder();
    });
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      if (user.firstname && user.lastname) {
        this.order.sender_name = user.firstname + ' ' + user.lastname;
      }
      if (user.email) {
        this.order.sender_email = user.email;
      }
      if (user.address) {
        this.addressService.getAddress(user.address).then(address => {
          this.updateCity(address.province);
          this.order.address1 = address.address;
          this.order.address2 = address.address2;
          this.order.province = address.province;
          this.order.city = address.city;
          this.order.country = address.country;
          this.order.postcode = address.postcode;
          this.generateFullAddress();
          this.getFeeAmount(this.order.province!, this.card!.events!).then(amount => {
            this.order.shipping_fee = Number(amount);
            this.computeTotal();
          })
        });
      }
      else {
        this.order.country = 'Philippines';
      }
      this.isValidOrder = this.validateOrder();
    })
  }

  generateFullAddress() {
    this.order.address = this.order.address1 + '\r\n' + this.order.address2 + '\r\n' + this.order.city + '\r\n' + this.order.province + '\r\n' + this.order.country + '\r\n ' + this.order.postcode;
  }

  getAddressConfig() {
    this.addressService.getAddressConfig().then(addressConfig => this.addressConfig = addressConfig);
  }

  getAllEvents() {
    this.eventService.getEvents().then(events => this.allEvents = events);
  }

  getAllFees() {
    this.shippingService.getShippingFees().then(fees => this.allFees = fees);
  }

  validateOrder(): boolean {
    let isValid = true;
    if (!this.order.sender_name || (this.order.sender_name == '')) {
      isValid = false;
    }
    if (!this.order.sender_phone || (this.order.sender_phone == '')) {
      isValid = false;
    }
    if (!this.order.sender_email || (this.order.sender_email == '')) {
      isValid = false;
    }
    if (!this.order.receiver_name || (this.order.receiver_name == '')) {
      isValid = false;
    }
    if (!this.order.receiver_phone || (this.order.receiver_phone == '')) {
      isValid = false;
    }
    if (!this.order.address1 || (this.order.address1 == '')) {
      isValid = false;
    }
    if (!this.order.address2 || (this.order.address2 == '')) {
      isValid = false;
    }
    if (!this.order.province || (this.order.province == '')) {
      isValid = false;
    }
    if (!this.order.city || (this.order.city == '')) {
      isValid = false;
    }
    if (!this.order.country || (this.order.country == '')) {
      isValid = false;
    }
    if (!this.order.postcode || (this.order.postcode == '')) {
      isValid = false;
    }
    if (!this.order.sendto || (this.order.sendto == '')) {
      isValid = false;
    }
    return isValid;
  }

  onChange(type: string, event: any) {
    if (type == "Sender-Name") {
      this.order.sender_name = event.target.value;
    }
    if (type == "Sender-Phone") {
      this.order.sender_phone = event.target.value;
    }
    if (type == "Sender-Email") {
      this.order.sender_email = event.target.value;
    }
    if (type == "Recipient-Name") {
      this.order.receiver_name = event.target.value;
    }
    if (type == "Recipient-Phone") {
      this.order.receiver_phone = event.target.value;
    }
    if (type == "Recipient-Email") {
      this.order.receiver_email = event.target.value;
    }
    if (type == "Address1") {
      this.order.address1 = event.target.value;
      this.generateFullAddress();
    }
    if (type == "Address2") {
      this.order.address2 = event.target.value;
      this.generateFullAddress();
    }
    if (type == "Province") {
      this.order.province == event.target.value;
      this.updateCity(event.target.value);
      this.generateFullAddress();
      this.getFeeAmount(this.order.province!, this.card!.events!).then(amount => {
        this.order.shipping_fee = Number(amount);
        this.computeTotal();
      })
    }
    if (type == "City") {
      this.order.city = event.target.value;
      this.generateFullAddress();
    }
    if (type == "Country") {
      this.order.city = event.target.value;
      this.generateFullAddress();
    }
    if (type == "PostCode") {
      this.order.city = event.target.value;
      this.generateFullAddress();
    }
    if (type == "Anonymously") {
      this.order.anonymously = event.target.checked;
    }
    if (type == "SendTo") {
      this.order.sendto = event.target.value;
    }
    if (type == "Message") {
      this.order.message = event.target.value;
    }
  }

  updateCity(province: string) {
    let config = this.addressConfig.find(x => x.name == province);
    if (config != undefined)
      this.cities = config.city;
  }

  onKeyUp(type: string, event: any) {
    if (type == "Province") {
      this.updateCity(event.target.value);
    }
    this.isValidOrder = this.validateOrder();
  }

  addToCart(confirm: any) {
    this.computeTotal();
    this.createAnOrder(this.order).then(id => {
      this.addMore.forEach(item => {
        if (item.count > 0) {
          console.log(item);
          let order: Order = new Order();
          order.card_id = item.card.id;
          order.card_price = item.card.price;
          order.count = item.count;
          order.parentOrder = id;
          order.shipping_fee = item.shipping_fee;
          order.user_id = this.uid;
          console.log(order);
          this.createAnAddMoreOrder(order).then(_id => {
            //console.log(_id);
          });
        }
      });
      this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
    });
  }

  createAnOrder(order: Order): Promise<string> {
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

  createAnAddMoreOrder(order: Order): Promise<string> {
    return new Promise((resolve) => {
      this.orderService.createAddMore(order).then(id => {
        this.userService.addItemOnCart(this.uid, id);
        resolve(id);
      })
    })
  }

  test(confirm: any) {
    this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
  }

  confirmation(confirm: any) {
    this.confirmRef = this.modalService.open(confirm, this.ngbModalOptions);
  }

  receiveSignAndSend(signAndSendDetails: SignAndSendDetails[]) {
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

  keepShopping() {
    this.confirmRef.close('');
    this.router.navigate(['/events']);
  }

  cart() {
    this.confirmRef.close('');
    window.location.href = "/cart";
  }

  addMoreChange(value: AddMore[]) {
    this.addMore = value;
    this.addMore.forEach(item => {
      if ((item.shipping_fee == 0) && (item.count > 0)){
        this.getFeeAmount(this.order.province!, item.card.events!).then(amount => {
          this.updateAmount(item, amount);
        })
      }
    });
    this.computeTotal();
  }

  updateAmount(item: AddMore, amount: number){
    let i = this.addMore.find(x => x.card.id == item.card.id);
    if (i != undefined)
      i.shipping_fee = Number(amount);
  }

  computeTotal() {
    if (this.order) {
      this.total = (Number(this.order.card_price!) * Number(this.order.count!)) + Number(this.order.shipping_fee!|0);
      this.totalCount = Number(this.order.count!);
    }

    this.addMore.forEach(item => {
      if (item.count > 0) {
        this.total = this.total + (Number(item.card.price!) * Number(item.count!)) + Number(item.shipping_fee!|0);
        this.totalCount = this.totalCount +  Number(item.count!);
      }
    })
  }

  showInstruction() {
    this.instruction = !this.instruction;
  }

  getFeeAmount(province: string, cardEvents: string[]): Promise<number> {
    return new Promise((resolve, rejects) => {
      if (province && (cardEvents.length > 0)) {
        let isCard: boolean = false;
        let isGift: boolean = false;
        let isCreation: boolean = false;
        let isSticker: boolean = false;

        cardEvents.forEach(cardEvent => {
          let i = this.allEvents.findIndex(x => x.name == cardEvent);
          if (i >= 0) {
            if (this.allEvents[i].isGift)
              isGift = true;
            else if (this.allEvents[i].isCreations)
              isCreation = true;
            else if (this.allEvents[i].isSticker)
              isSticker = true;
            else
              isCard = true;
          }
        })

        let group: string = '';
        let config = this.addressConfig.find(x => x.name == province);
        if (config != undefined)
          group = config.group;

        if (group != ''){
          let y = this.allFees.forEach(fee => {
            if (isCard && (fee.name == 'Card')) {
              if (group == 'Metro Manila')
                resolve(Number(fee.metromanila));
              if (group == 'Luzon')
                resolve(Number(fee.luzon));
              if (group == 'Visayas')
                resolve(Number(fee.visayas));
              if (group == 'Mindanao')
                resolve(Number(fee.mindanao));
            }
            if (isGift && (fee.name == 'Gift')) {
              if (group == 'Metro Manila')
                resolve(Number(fee.metromanila));
              if (group == 'Luzon')
                resolve(Number(fee.luzon));
              if (group == 'Visayas')
                resolve(Number(fee.visayas));
              if (group == 'Mindanao')
                resolve(Number(fee.mindanao));
            }
            if (isCreation && (fee.name == 'Creation')) {
              if (group == 'Metro Manila')
                resolve(Number(fee.metromanila));
              if (group == 'Luzon')
                resolve(Number(fee.luzon));
              if (group == 'Visayas')
                resolve(Number(fee.visayas));
              if (group == 'Mindanao')
                resolve(Number(fee.mindanao));
            }
            if (isSticker && (fee.name == 'Sticker')) {
              if (group == 'Metro Manila')
                resolve(Number(fee.metromanila));
              if (group == 'Luzon')
                resolve(Number(fee.luzon));
              if (group == 'Visayas')
                resolve(Number(fee.visayas));
              if (group == 'Mindanao')
                resolve(Number(fee.mindanao));
            }
          })
        }
        else{
          resolve(0);
        }
      }
      else{
        rejects("Not enough parameter");
      }
    });
  }
}
