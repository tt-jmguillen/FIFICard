import { PriceService } from './../services/price.service';
import { EmailService } from './../services/email.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../models/card';
import { CardService } from '../services/card.service';
import { AppComponent } from '../app.component';
import { environment } from 'src/environments/environment';
import { TranslationService } from '../services/translation.service';
import { Translation } from '../models/translation';
import { FilterService } from '../services/filter.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  id?: string;

  card: Card;
  activateRoute: ActivatedRoute;
  service: CardService;
  translationService: TranslationService;
  filter: FilterService;
  priceService: PriceService;
  router: Router;
  title: Title;
  event: string | undefined;
  elementEvent: string;

  description: string = '';
  language: string = 'en';
  descriptionTranslation: Translation;

  orderEnable: boolean = false;

  constructor(
    private _activateRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private _service: CardService,
    private _emailService: EmailService,
    private _title: Title,
    private _router: Router,
    private _translationService: TranslationService,
    private _filter: FilterService,
    private _priceService: PriceService
  ) {
    this.activateRoute = _activateRoute;
    this.service = _service;
    this.router = _router;
    this.translationService = _translationService;
    this.filter = _filter;
    this.priceService = _priceService;
    this.title = _title;
  }

  ngOnInit(): void {
    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()) {
        this.elementEvent = element.event;
      }
    });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });

    console.log(this.orderEnable);
  }

  loadCard() {
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.event = this.card!.event;
      this.title.setTitle(this.card?.name!);
      this.description = this.card.description!;

      this.getTranslation(this.card.id!);
      this.subscribeLanguage();
      this.subscribeTranslation(this.card.id!);
    });
  }

  checkIfLoggedIn(id: any): void {
    console.log(this.orderEnable)
    if (this.orderEnable){
      let userDetails: string = localStorage.getItem('user')!;
      if (userDetails == null || userDetails.length < 0) {
        this.appComponent.openLoginDialog(id);
      }
      else {
        if (this.card.type != 'ecard')
          this.router.navigate(['/order', id]);
        else
          this.router.navigate(['/ecardorder', id]);
      }
    }
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

  getStickerLink(): string {
    let link: string = '';

    link = '/cards/events/' + this.card!.name!.split(' ')[0];

    return link;
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

  getEventTitle(card: Card): string {
    let value: string = 'Event';
    if (card.type == 'postcard') {
      value = 'Category'
    }
    return value;
  }

  setEnable(event: any){
    this.orderEnable = event.target.checked;
  }
}
