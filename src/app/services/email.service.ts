import { SettingService } from './setting.service';
import { PriceService } from './price.service';
import { CardService } from 'src/app/services/card.service';
import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Order } from '../models/order';
import { Storage } from '@angular/fire/storage';
import { OrderECard } from '../models/order-ecard';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  store: Firestore;
  cardService: CardService;
  priceService: PriceService;
  settingService: SettingService;

  constructor(
    private _store: Firestore,
    private _storage: Storage,
    private _cardService: CardService,
    private _priceService: PriceService,
    private _settingService: SettingService
  ) {
    this.store = _store;
    this.cardService = _cardService
    this.priceService = _priceService;
    this.settingService = _settingService;
  }

  private async generateHTML(order: Order, url: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      fetch('/assets/static/order.html').then(res => res.text()).then(data => {
        let html = data;
        //html = html.replace('[STATUS]', order.status!);
        html = html.replace('[SenderName]', order.sender_name!);
        html = html.replace('[SenderPhone]', order.sender_phone!);
        html = html.replace('[SenderEmail]', order.sender_email!);
        html = html.replace('[ReceiverName]', order.receiver_name!);
        html = html.replace('[ReceiverPhone]', order.receiver_phone!);
        html = html.replace('[ReceiverEmail]', order.receiver_email!);
        html = html.replace('[MESSAGE]', order.message!);
        html = html.replace('[CARDIMAGE]', url == '' ? 'http://via.placeholder.com/550x360' : url);
        html = html.replace('[OrderDetails]', 'https://fifigreetings.com/status/' + order.id);
        resolve(html);
      }).catch(reason => {
        rejects(reason);
      })
    });
  }

  private async getCard(id: string): Promise<string> {
    return new Promise((resolve, rejects) => {
      this.cardService.getCard(id).pipe().subscribe(card => {
        let primary: string = card.primary!;
        if ((!primary) || (primary == '')) {
          resolve(card.images![0]);
        }
        else {
          resolve(primary);
        }

      })
    });
  }

  sendOrderEmail(order: Order) {
    this.getCard(order.card_id!).then(primary => {
      this.cardService.getImageURL(primary).then(url => {
        this.generateHTML(order, url).then(html => {
          const data = collection(this.store, 'mail')
          addDoc(data, {
            to: order.sender_email,
            message: {
              subject: "FibeiGreetings Order Status",
              html: html,
            },
          });
        })
      });
    })
  }

  private getRootURL(): string {
    if (this.priceService.getLocation() == 'us') {
      return 'https://fibeigreetings.us';
    }
    else if (this.priceService.getLocation() == 'sg') {
      return 'https://fibeigreetings.sg';
    }
    else {
      return 'https://fibeigreetings.com';
    }
  }

  private ecardLink(id: string): string {
    return this.getRootURL() + "/play/" + id;
  }

  private ecardTrackLink(id: string): string {
    return this.getRootURL() + "/playtrack/" + id;
  }

  private sendEmail(to: string, subject: string, content: string): Promise<string> {
    return new Promise(resolve => {
      const data = collection(this.store, 'mail')
      addDoc(data, {
        to: to,
        message: {
          subject: subject,
          html: content,
        },
      }).then(docRef => {
        resolve(docRef.id);
      });
    })
  }

  async sendECardEmail(order: OrderECard): Promise<string> {
    return new Promise(resolve => {
      fetch('/assets/static/ecard.html').then(res => res.text()).then(data => {
        this.settingService.getMailSupport().then(mailsupport => {
          let html: string = data;
          html = html.replaceAll('[ROOT]', this.getRootURL());
          html = html.replaceAll('[TRACKLINK]', this.ecardTrackLink(order.id));
          html = html.replaceAll('[SENDERNAME]', order.sender_name);
          html = html.replaceAll('[MESSAGE]', order.message);
          html = html.replaceAll('[EMAILSUPPORT]', mailsupport);
          return this.sendEmail(order.receiver_email, "You receive an E-Card from FibeiGreetings.com", html);
        });
      });
    })
  }

  async SendECardConfirmEmail(order: OrderECard): Promise<string> {
    return new Promise(resolve => {
      fetch('/assets/static/ecardconfirm.html').then(res => res.text()).then(data => {
        this.settingService.getMailSupport().then(mailsupport => {
          let html: string = data;
          html = html.replaceAll('[ROOT]', this.getRootURL());
          html = html.replaceAll('[LINK]', this.ecardLink(order.id));
          html = html.replaceAll('[RECEIVERNAME]', order.receiver_name);
          html = html.replaceAll('[MESSAGE]', order.message);
          html = html.replaceAll('[EMAILSUPPORT]', mailsupport);
          return this.sendEmail(order.receiver_email, "You send an E-Card from FibeiGreetings.com", html);
        });
      });
    })
  }

  async SendECardOpenedEmail(order: OrderECard): Promise<string> {
    return new Promise(resolve => {
      fetch('/assets/static/ecardopened.html').then(res => res.text()).then(data => {
        this.settingService.getMailSupport().then(mailsupport => {
          let html: string = data;
          html = html.replaceAll('[ROOT]', this.getRootURL());
          html = html.replaceAll('[LINK]', this.ecardLink(order.id));
          html = html.replaceAll('[SENDERNAME]', order.sender_name);
          html = html.replaceAll('[MESSAGE]', order.message);
          html = html.replaceAll('[EXPIRED]', order.expire.toDate().toDateString());
          html = html.replaceAll('[EMAILSUPPORT]', mailsupport);
          return this.sendEmail(order.sender_email, "Your E-Card from Fibeigreetings.com has been opened", html);
        });
      });
    })
  }
}
