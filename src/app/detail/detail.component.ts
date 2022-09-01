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
  event: string | undefined;
  elementEvent: string;

  description: string = '';
  descriptionTranslation: Translation;

  constructor(
    private _activateRoute: ActivatedRoute,
    private appComponent: AppComponent,
    private _service: CardService,
    private _emailService: EmailService,
    private titleService: Title,
    private router: Router,
    private _translationService: TranslationService,
    private _filter: FilterService
  ) { 
    this.activateRoute = _activateRoute;
    this.service = _service;
    this.translationService = _translationService;
    this.filter = _filter;
  }

  ngOnInit(): void {
    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.elementEvent = element.event;
      }
    });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loadCard();
    });
  }

  getTranslation(id: string){
    this.translationService.getTranslation(id, 'description').then(data => {
      this.descriptionTranslation = data;
      this.loadTranslation();
    }).catch(err => {
      this.translationService.addTranslation(id, 'description', this.description).finally(() => {
        setTimeout(()=>{        
          this.translationService.getTranslation(id, 'description').then(data => {
            this.descriptionTranslation = data;
            this.loadTranslation();
          });
        }, 2000);
      });
    });
  }

  loadTranslation(){
    this.filter.getLang().subscribe(lang => {
      if (lang == 'es') this.description = this.descriptionTranslation.es;
      else if (lang == 'fr') this.description = this.descriptionTranslation.fr;
      else if (lang == 'hi') this.description = this.descriptionTranslation.hi;
      else if (lang == 'zh') this.description = this.descriptionTranslation.zh;
      else this.description = this.descriptionTranslation.en;
    });
  }

  

  loadCard(){
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.event = this.card!.event;
      this.titleService.setTitle(this.card?.name!);
      this.description = this.card.description!;
      this.getTranslation(this.card.id!);
    });
  }
  
  checkIfLoggedIn(id: any): void {
    let userDetails: string = localStorage.getItem('user')!;
    if(userDetails == null || userDetails.length < 0) {
      this.appComponent.openLoginDialog(id);
    }
    else {
      this.router.navigate(['/order', id]);
    }
  }
}
