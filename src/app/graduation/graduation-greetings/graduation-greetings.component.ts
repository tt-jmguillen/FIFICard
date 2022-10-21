import { CardService } from './../../services/card.service';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/card';
import { environment } from 'src/environments/environment';

class SelectedCard {
  public id: string;
  public card: Card;
  public url: string;

  public constructor(_id: string) {
    this.id = _id;
  }
}

@Component({
  selector: 'app-graduation-greetings',
  templateUrl: './graduation-greetings.component.html',
  styleUrls: ['./graduation-greetings.component.scss']
})

export class GraduationGreetingsComponent implements OnInit {
  cardService: CardService
  line1: SelectedCard[] = [];
  line2: SelectedCard[] = [];
  line3: SelectedCard[] = [];
  line4: SelectedCard[] = [];

  constructor(
    _cardService: CardService
  ) {
    this.cardService = _cardService;
  }

  ngOnInit(): void {
    this.line1.push(new SelectedCard('RdnOnqzsNhVQg3D84Zh5'));
    this.line1.push(new SelectedCard('hPVdNaKOy2AAv8PR24Ju'));
    this.line1.push(new SelectedCard('xDACkoU1KeAgwCxcXKPR'));
    this.line1.push(new SelectedCard('ifh9vq8BmFm2HfT6Qrmy'));

    this.line2.push(new SelectedCard('t0nMQAtOwyuFYySgj2tE'));
    this.line2.push(new SelectedCard('D9uh7ONNmIe8VHQCYe29'));
    this.line2.push(new SelectedCard('1av3jh7ovZSUJu4MMh1c'));
    this.line2.push(new SelectedCard('prZlBHYn70LlMEIF9Fra'));

    this.line3.push(new SelectedCard('Mw3jjvWs1mI73m7AdE1T'));
    this.line3.push(new SelectedCard('oWXDeRm4dRbhGKqDscLX'));
    this.line3.push(new SelectedCard('6BrCFKpIXwTNmeDBTjdx'));
    this.line3.push(new SelectedCard('X8arneN97jpksr21jzCv'));

    this.line4.push(new SelectedCard('Nsu0qoBRD9BEba73R4tN'));
    this.line4.push(new SelectedCard('IXidBkQZhhCPW3kgwCvz'));
    this.line4.push(new SelectedCard('JxhGxYYu8jjiRyr8joOp'));
    this.line4.push(new SelectedCard('k2hXiW1ruHyCQEKcn7go'));

    this.getCards(this.line1);
    this.getCards(this.line2);
    this.getCards(this.line3);
    this.getCards(this.line4);
  }

  getCards(items: SelectedCard[]) {
    items.forEach(selectedCard => {
      this.cardService.getACard(selectedCard.id).then(card => {
        selectedCard.card = card;
        this.loadImage(selectedCard);
      })
    })
  }

  loadImage(card: SelectedCard) {
    this.cardService.getPrimaryImage(card.id!).then(img => {
      this.getAvailableURL(img).then(url => {
        card.url = url;
      })
    });
  }

  getAvailableURL(image: string): Promise<string> {
    return new Promise((resolve) => {
      this.cardService.getImageURL(image + environment.imageSize.xlarge).then(url => {
        resolve(url);
      }).catch(err => {
        this.cardService.getImageURL(image + environment.imageSize.large).then(url => {
          resolve(url);
        }).catch(err => {
          this.cardService.getImageURL(image).then(url => {
            resolve(url);
          }).catch(err => { });
        });
      });
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
