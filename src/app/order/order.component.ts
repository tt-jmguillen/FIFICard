import { PriceService } from './../services/price.service';
import { SettingService } from './../services/setting.service';
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
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Translation } from '../models/translation';
import { TranslationService } from '../services/translation.service';
import { FilterService } from '../services/filter.service';
import { Bundle } from '../models/bundle';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})

export class OrderComponent implements OnInit {
  id?: string;
  form: UntypedFormGroup;
  formBuilder: UntypedFormBuilder;
  card: Card;
  submitted: boolean;
  province: string;
  shippingfee: number = 0;
  isWithSignAndSend: boolean = false;
  SignAndSend: SignAndSendDetails[] = [];

  titleService: Title;
  appComponent: AppComponent
  activateRoute: ActivatedRoute;
  cardService: CardService;
  orderService: OrderService;
  userService: UserService;
  addressService: AddressService;
  eventService: EventService;
  shippingService: ShippingService;
  settingService: SettingService;
  priceService: PriceService;
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

  filter: FilterService;
  translationService: TranslationService;
  description: string = '';
  language: string = 'en';
  descriptionTranslation: Translation;

  defaultType: string = '';
  changeTo: string = '';
  cardPrice: number = 0;
  count: number = 1;
  isBundle: boolean = false;
  isUserProfileLoaded: boolean = false;
  isWithUserProfile: boolean = false;

  location: 'ph' | 'sg' | 'us' = 'ph';

  constructor(
    _titleService: Title,
    _formBuilder: UntypedFormBuilder,
    _appComponent: AppComponent,
    _activateRoute: ActivatedRoute,
    _cardService: CardService,
    _orderService: OrderService,
    _userService: UserService,
    _addressService: AddressService,
    _eventService: EventService,
    _shippingService: ShippingService,
    _translationService: TranslationService,
    _settingService: SettingService,
    _modalService: NgbModal,
    _filter: FilterService,
    _priceService: PriceService,
    _router: Router,

    private _emailService: EmailService,
  ) {
    this.titleService = _titleService;
    this.formBuilder = _formBuilder;
    this.appComponent = _appComponent;
    this.activateRoute = _activateRoute;
    this.cardService = _cardService;
    this.orderService = _orderService;
    this.userService = _userService;
    this.addressService = _addressService;
    this.eventService = _eventService;
    this.shippingService = _shippingService;
    this.translationService = _translationService;
    this.settingService = _settingService;
    this.modalService = _modalService;
    this.priceService = _priceService;
    this.filter = _filter;
    this.router = _router;
    this.emailService = _emailService;
  }

  ngOnInit(): void {
    this.getAddressConfig();
    this.getAllEvents();
    this.getAllFees();

    this.location = this.priceService.getLocation();

    this.form = this.formBuilder.group({
      sender_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      sender_phone: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      sender_email: ['', Validators.compose([Validators.required, Validators.email])],
      receiver_name: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      receiver_phone: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      receiver_email: ['', Validators.compose([Validators.required, Validators.email])],
      address: [''],
      address1: [''],
      address2: [''],
      province: [''],
      city: [''],
      country: ['Philippines'],
      postcode: [''],
      anonymously: [false],
      sendto: ['Recipient', Validators.compose([Validators.required, Validators.maxLength(20)])],
      message: [''],
    }, {});

    if (this.location == 'ph') {
      this.form.controls['address1'].setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.form.controls['address2'].setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.form.controls['province'].setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.form.controls['province'].setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.form.controls['country'].setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
      this.form.controls['postcode'].setValidators(Validators.compose([Validators.required, Validators.maxLength(20)]));
    }
    else {
      this.form.controls['address'].setValidators(Validators.compose([Validators.required, Validators.maxLength(250)]));
    }

    const userDetails = JSON.parse(localStorage.getItem('user')!);
    this.uid = userDetails?.uid;

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });

    this.loadUser();
  }

  controls() {
    return this.form.controls;
  }

  loadCard() {
    this.cardService.getCard(this.id!).subscribe(data => {
      this.card = data;
      this.cardPrice = this.getPrice();
      this.titleService.setTitle(this.card!.name!);

      this.loadImage(this.card.id!);

      this.description = this.card.description!;
      this.getTranslation(this.card.id!);
      this.subscribeLanguage();
      this.subscribeTranslation(this.card.id!);

      this.getType(this.card.types![0]);
    });
  }

  loadImage(id: string) {
    this.cardService.getPrimaryImage(id).then(image => {
      this.getAvailableURL(image).then(url => {
        this.primaryImageURL = url;
      });
    })
  }

  loadUser() {
    this.userService.getUser(this.uid).then(user => {
      this.user = user;
      if ((this.user.firstname && this.user.lastname) || this.user.email || this.user.contact || this.user.address)
        this.isWithUserProfile = true;
      else
        this.isWithUserProfile = false;
    })
  }

  loadUserProfile() {
    if (this.user.firstname && this.user.lastname) {
      this.form.controls['sender_name'].patchValue(this.user.firstname + ' ' + this.user.lastname);
    }
    if (this.user.email) {
      this.form.controls['sender_email'].patchValue(this.user.email);
    }
    if (this.user.contact) {
      this.form.controls['sender_phone'].patchValue(this.user.contact);
    }
    if (this.user.address) {
      this.addressService.getAddress(this.user.address).then(address => {
        this.form.controls['address1'].patchValue(address.address);
        this.form.controls['address2'].patchValue(address.address2);
        this.form.controls['province'].patchValue(address.province);
        this.form.controls['city'].patchValue(address.city);
        this.form.controls['country'].patchValue(address.country);
        this.form.controls['postcode'].patchValue(address.postcode);
        this.province = address.province;
        this.updateCity(address.province);
        this.getFeeAmount(address.province!, this.card!.events!).then(amount => {
          this.shippingfee = Number(amount);
          this.computeTotal();
        });
      });
    }
    this.isUserProfileLoaded = true;
  }

  generateFullAddress(order: Order): string {
    return order.address1 + '\r\n' + order.address2 + '\r\n' + order.city + '\r\n' + order.province + '\r\n' + order.country + '\r\n ' + order.postcode;
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

  proviceChange(event: any) {
    this.province = event.target.value;
    this.form.controls['city'].patchValue('');
    this.updateCity(event.target.value);

    this.getFeeAmount(event.target.value, this.card!.events!).then(amount => {
      this.shippingfee = Number(amount);
      this.computeTotal();
    })
  }

  updateCity(province: string) {
    let config = this.addressConfig.find(x => x.name == province);
    if (config != undefined)
      this.cities = config.city;
  }

  addToCart(confirm: any) {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    let order: Order = this.form.value as Order;
    order.user_id = this.uid;
    order.card_id = this.card.id;
    order.card_price = this.cardPrice;
    order.location = this.location;
    order.count = this.count;
    order.withSignAndSend = this.isWithSignAndSend;
    if (this.location == 'ph') {
      order.address = this.generateFullAddress(order);
    }
    order.shipping_fee = this.shippingfee;
    order.type = this.changeTo;
    order.bundle = this.isBundle;

    this.computeTotal();

    this.createAnOrder(order).then(id => {
      this.addMore.forEach(item => {
        if (item.count > 0) {
          //console.log(item);
          let order: Order = new Order();
          order.card_id = item.card.id;
          order.card_price = item.card.price;
          order.count = item.count;
          order.parentOrder = id;
          order.shipping_fee = item.shipping_fee;
          order.user_id = this.uid;
          //console.log(order);
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
    this.isWithSignAndSend = true;
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
      if ((item.shipping_fee == 0) && (item.count > 0)) {
        this.getFeeAmount(this.province, item.card.events!).then(amount => {
          this.updateAmount(item, amount);
        })
      }
    });
    this.computeTotal();
  }

  updateAmount(item: AddMore, amount: number) {
    let i = this.addMore.find(x => x.card.id == item.card.id);
    if (i != undefined)
      i.shipping_fee = Number(amount);
  }

  computeTotal() {
    this.total = Number(this.card.price!) + Number(this.shippingfee);
    this.totalCount = Number(this.count);

    this.addMore.forEach(item => {
      if (item.count > 0) {
        this.priceService.getPrice
        this.total = this.total + (Number(item.card.price!) * Number(item.count!)) + Number(item.shipping_fee! | 0);
        this.totalCount = this.totalCount + Number(item.count!);
      }
    })
  }

  showInstruction() {
    this.instruction = !this.instruction;
  }

  getFeeAmount(province: string, cardEvents: string[]): Promise<number> {
    return new Promise((resolve, rejects) => {
      if (this.priceService.location == 'ph') {
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

          if (group != '') {
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
          else {
            resolve(0);
          }
        }
        else {
          rejects("Not enough parameter");
        }
      }
      else{
        resolve(0);
      }
    });
  }

  subscribeLanguage() {
    this.filter.getLang().subscribe(lang => {
      this.language = lang;
      this.loadTranslation();
    });
  }

  subscribeTranslation(id: string) {
    this.translationService.subscribeTranslation(id).subscribe(data => {
      this.descriptionTranslation = data['translated']['description'] as Translation;
      this.loadTranslation();
    })
  }

  loadTranslation() {
    if (this.descriptionTranslation) {
      if (this.language == 'es') this.description = this.descriptionTranslation.es ? this.descriptionTranslation.es : this.description;
      else if (this.language == 'fr') this.description = this.descriptionTranslation.fr ? this.descriptionTranslation.fr : this.description;
      else if (this.language == 'zh') this.description = this.descriptionTranslation.zh ? this.descriptionTranslation.zh : this.description;
      else if (this.language == 'ja') this.description = this.descriptionTranslation.ja ? this.descriptionTranslation.ja : this.description;
      else if (this.language == 'de') this.description = this.descriptionTranslation.de ? this.descriptionTranslation.de : this.description;
      else this.description = this.descriptionTranslation.en ? this.descriptionTranslation.en : this.description;
    }
  }

  getTranslation(id: string) {
    this.translationService.getTranslation(id).then(data => {
      if (!this.verify(data))
        this.updateTranslation(id, this.description);
    }).catch(err => {
      this.addTranslation(id, this.description);
    });
  }

  addTranslation(id: string, description: string) {
    this.translationService.addTranslation(id, description);
  }

  updateTranslation(id: string, description: string) {
    this.translationService.updateTranslation(id, description + ' ');
  }

  verify(translation: Translation): boolean {
    let valid: boolean = true;
    if (translation.en && translation.zh && translation.es && translation.fr && translation.de && translation.ja) {
      valid = true;
    }
    else {
      valid = false;
    }
    return valid;
  }

  getType(def: string) {
    this.settingService.getCardType().then(data => {
      data.forEach(cardType => {
        if (def.toLowerCase() == cardType.name.toLowerCase()) {
          this.defaultType = cardType.name;
          this.changeTo = cardType.name;
        }
      })
    })
  }

  upgrade(value: [string, number]) {
    this.changeTo = value[0];
    let type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED' = 'STANDARD';
    if (this.changeTo == 'STANDARD') {
      type = 'STANDARD';
    }
    else if (this.changeTo == 'GLITTERED') {
      type = 'GLITTERED';
    }
    if (this.changeTo == 'EMBOSSED') {
      type = 'EMBOSSED';
    }
    this.cardPrice = this.priceService.getPrice(this.card!, type)
  }

  bundle(bundle: Bundle) {
    this.changeTo = this.defaultType;
    this.isBundle = bundle.count > 1;
    this.count = bundle.count;
    this.cardPrice = this.priceService.getBundlePrice(this.card.messagetype, bundle);
  }

  getPrice(): number {
    let type: 'STANDARD' | 'GLITTERED' | 'EMBOSSED' = 'STANDARD'
    if (this.card!.types!.findIndex(x => x == 'STANDARD') >= 0) {
      type = 'STANDARD';
    }
    else if (this.card!.types!.findIndex(x => x == 'GLITTERED') >= 0) {
      type = 'GLITTERED';
    }
    if (this.card!.types!.findIndex(x => x == 'EMBOSSED') >= 0) {
      type = 'EMBOSSED';
    }
    return this.priceService.getPrice(this.card!, type)
  }
}
