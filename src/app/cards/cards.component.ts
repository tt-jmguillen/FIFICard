import { ImageService } from 'src/app/services/image.service';
import { FilterService } from './../services/filter.service';
import { Card } from './../models/card';
import { CardService } from './../services/card.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throws } from 'assert';
import { Recipient } from '../models/recipient';
import { RecipientService } from '../services/recipient.service';
import { EventService } from '../services/event.service';
import { Title } from '@angular/platform-browser';

export class EventSetting {
  public event: string;
  public mainCard: string;
  public bannerLink: string;

  constructor(_event: string, _mainCard: string, _bannerLink: string) {
    this.event = _event;
    this.mainCard = _mainCard;
    this.bannerLink = _bannerLink;
  }
}

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  event?: string;
  search?: string;
  recipient?: string;

  caption: string = '';
  banner: string = '';
  service: CardService;
  eventService: EventService;
  imageService: ImageService;
  filterService: FilterService;
  serviceRecipient: RecipientService;
  activateRoute: ActivatedRoute;
  titleService: Title;

  cards: Card[] = [];
  loading: boolean = true;

  eventSettings: EventSetting[] = [];
  eventSetting: EventSetting;

  type: string = '';

  constructor(
    private _service: CardService,
    private _eventService: EventService,
    private _imageService: ImageService,
    private _filterService: FilterService,
    private _serviceRecipient: RecipientService,
    private _activateRoute: ActivatedRoute,
    private _titleService: Title
  ) {
    this.service = _service;
    this.eventService = _eventService;
    this.imageService = _imageService;
    this.filterService = _filterService;
    this.serviceRecipient = _serviceRecipient;
    this.activateRoute = _activateRoute;
    this.titleService = _titleService;
  }

  ngOnInit(): void {
    this.eventSettings.push(new EventSetting('Confirmation', 'tdvYzC3lT3vPdZzTkP7D', '/card/9gJZdaXDGk74siRExTrd'));
    this.eventSettings.push(new EventSetting('Wedding', 'P390wMwR8PGyAgy51vrY', '/card/B7xwfIgXhIUFxfNhI8xX'));
    this.eventSettings.push(new EventSetting('Thinking Of You', 'mAyLGGHHq8x1XqawDacL', '/card/6utqlq60ud67qCKbOcm4'));
    this.eventSettings.push(new EventSetting('Halloween', 'wkrjkOcpYUX3eUyJ08tj', '/card/07F8gW94f6mGFHISQpWx'));
    this.eventSettings.push(new EventSetting('First Communion', '8woCW1eoUIooXjgvjMSx', '/card/U34l4tVO9NAaLfJFuDRm'));
    this.eventSettings.push(new EventSetting('Baptism', '68VpIN3szeQ2VNj2InGD', '/card/YqFMboYkU8KqULTVYCD0'));
    this.eventSettings.push(new EventSetting('Parents Appreciation', 'vJ0Rk9KoFwnISsjdKtRJ', '/card/RTKaRLkckcFHBVTvwFC9'));
    this.eventSettings.push(new EventSetting('Teacher Appreciation', 'hwRqfPGajCmVvWBQ8OIY', '/card/5AeQBWLOrvxpNV3Ff9TY'));
    this.eventSettings.push(new EventSetting('BIRTHDAY', '08VjvPay1RNWZCvkI4Gt', '/card/YbLeDTqC8nd4V85uJ0aq'));
    this.eventSettings.push(new EventSetting('CHRISTMAS', 'JHPAAFJDLHm8Ao8rS8px', '/card/EmwhypC9otvbFcoo2yET'));
    this.eventSettings.push(new EventSetting('THANK YOU', 'Ov40VgNzgtuObCrVJTe3', '/card/TZr0w3xILIYvXdm8spGc'));
    this.eventSettings.push(new EventSetting('MILITARY APPRECIATION', 'vP08uWaWJ2fNePPpHeoT', '/card/dEQWrVtbl3Q5IYUFmIGn'));
    this.eventSettings.push(new EventSetting('MOTHERS DAY', '6C3GEEQumsH9rh1iRV9y', '/card/qlYBuR3MbsgYQIwTCLBh'));
    this.eventSettings.push(new EventSetting('RETIREMENT', 'rmpdW3x0NH2r8LZr9l8U', '/card/excJgjQ91iECBWEkR51p'));
    this.eventSettings.push(new EventSetting('LOVE YOUR ENEMY', 'caUWVUzKKJui3hmnalaQ', '/card/ttTvbl6pLgKC9FdWOp5u'));
    this.eventSettings.push(new EventSetting('DISTRESS', 'z3Vlo33fi5BUTEOcJ0t1', '/card/xC9akQ3IwA9QsE9jRbw4'));
    this.eventSettings.push(new EventSetting('GRADUATION', 'hYCJwp6kDMHVgXY4FMuJ', '/card/LG91AKqkj1dsvvql51Zv'));
    this.eventSettings.push(new EventSetting('CONGRATULATIONS', 'LT6CjyAyAqmYYTihNOx1', '/card/nkUZxp04stsB8SVxCVhy'));
    this.eventSettings.push(new EventSetting('FATHERS DAY', 'IMHQhzRssP2cZdfqOfWb', '/card/OkBSquS8aTDTrTmscFaa'));
    this.eventSettings.push(new EventSetting('FRIENDSHIP', 'P9whSpKaPTYqYBN1IWmw', '/card/KpBq9Atga2LkaTKX0hcD'));
    this.eventSettings.push(new EventSetting('GRANDPARENTS DAY', 'QO2TVXdSZEoimL49VKuC', '/card/KpW0laiSbUfAmhoqLcgG'));
    this.eventSettings.push(new EventSetting('PET CARDS', '5sxryZAm4b1aiAnIfdxv', '/card/uGkW25dFLiZFDMvdYw6v'));
    this.eventSettings.push(new EventSetting('GET WELL', 'bW4l1zph6jKHrghKBLWY', '/card/y2sxhRoday8B3hWg3HRt'));
    this.eventSettings.push(new EventSetting('Valentines day', 'Roye9MTtU2azReOnMHrV', '/card/UaFgHHAgfAn6rd4jFyvq'));
    this.eventSettings.push(new EventSetting('Anniversary', 'jPfJA2o2s6KbyKdhJJDe', '/card/xucXPthnzIRfn0oHbI4X'));
    this.eventSettings.push(new EventSetting('Love', 'dR2Wb8cvjTAJMa29DIhU', '/card/3nczwYuTxv9o1imzMkoy'));
    this.eventSettings.push(new EventSetting('New Year', 'izfn4TE6voc9BSdiajTp', '/card/l1BUektIMItpJSjTLel5'));
    this.eventSettings.push(new EventSetting('Baby', 'EAjQkiW7pxM3B4uvzrT4', '/card/VLb0P0etpFC1i7fCJdfF'));
    this.eventSettings.push(new EventSetting('Easter', '0P6vkjd1vtozLlSEi6D3', '/card/grPJr0pX8fk5SRpH4SG3'));
    this.eventSettings.push(new EventSetting('Funny', 'T8N5NmIKxrZUpQFszUBV', '/card/e7X2DddeJ0fuTLQ9P7jr?fbclid=IwAR2ujAuxiM3BVHZEPkDYYVxpseRO586BGMXm5ClLTPgdKMUatkLMIz3cR9Y'));

    this.activateRoute.params.subscribe(params => {
      this.event = params['event'];
      this.search = params['search'];
      this.recipient = params['recipient'];

      if (this.event) {
        this.titleService.setTitle(this.event);
        this.caption = this.event;

        this.eventService.getByName(this.event!).then(events => {
          if (events.length > 0) {
            if (events[0].banner != undefined) {
              this.imageService.getImageURL(events[0].banner).then(img => {
                this.banner = img;
              });
            }

            if (events[0].isGift) {
              this.type = 'Gifts'
            }
            if (!events[0].isGift && !events[0].isSticker && !events[0].isCreations) {
              this.type = 'Cards'
            }
          }
        });
      }

      if ((this.event) && (this.event! != 'All')) {
        let index = this.eventSettings.findIndex(x => this.replaceAll(x.event) == this.replaceAll(this.event!));
        if (index >= 0) {
          this.eventSetting = this.eventSettings[index];
        }
        this.getCardsForEvent(this.event!);
      }
      else if ((this.search) && (this.search != '')) {
        this.titleService.setTitle('Fibei Greetings');
        this.getSearchCard(this.search);
      }
      else {
        this.titleService.setTitle('Fibei Greetings');
        this.getAllCards();
      }
    });
  }

  replaceAll(value: string): string {
    let newValue = value.split(' ').join('');
    newValue = newValue.split("’").join('');
    newValue = newValue.split("'").join('');
    return newValue.toLocaleLowerCase();
  }

  getAllCards() {
    this.loading = true;
    this.service.getCards().then(data => {
      this.loading = false;
      this.cards = data;
    }).catch(err => {
      this.loading = false;
    });
  }

  getCardsForEvent(event: string) {
    this.loading = true;
    this.service.getCardsByEvent(event).then(data => {
      this.loading = false;
      this.cards = data;
    }).catch(err => {
      this.loading = false;
    });
  }

  getSearchCard(search: string) {
    this.caption! = "Searching: " + this.search;
    this.loading = true;
    this.cards = [];
    this.doSearch(search).then(data => {
      this.loading = false;
      this.caption! = "Search: " + this.search;
      this.cards = data;
    }).catch(err => {
      this.loading = false;
      this.caption! = "Search: " + this.search + " - No Record Found";
      this.cards = [];
    })
  }

  doSearch(search: string): Promise<Card[]> {
    let value = search.toLowerCase()
      .replace(",", " ")
      .replace("!", " ")
      .replace(".", " ")
      .trim();

    return new Promise((resolve, rejects) => {
      this.service.getCardsByEvent(search).then(data => {
        resolve(data);
      }).catch(e => {
        this.service.getSearchCards('search_name', value).then(data => {
          resolve(data);
        }).catch(e => {
          this.service.getSearchCards('search_description', value).then(data => {
            resolve(data);
          }).catch(e => {
            rejects('No Records Found');
          });
        });
      });
    })
  }
}
