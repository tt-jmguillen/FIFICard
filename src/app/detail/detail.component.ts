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
  language: string = 'en';
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

  loadCard(){
    this.service.getCard(this.id!).subscribe(data => {
      this.card! = data;
      this.event = this.card!.event;
      this.titleService.setTitle(this.card?.name!);
      this.description = this.card.description!;
      
      this.getTranslation(this.card.id!);
      this.subscribeLanguage();
      this.subscribeTranslation(this.card.id!);
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

  subscribeLanguage(){
    this.filter.getLang().subscribe(lang => {
      this.language = lang;
      this.loadTranslation();
    });
  }

  subscribeTranslation(id: string){
    this.translationService.subscribeTranslation(id).subscribe(data => {
      this.descriptionTranslation = data['translated']['description'] as Translation;
      this.loadTranslation();
    })
  }

  loadTranslation(){
    if (this.descriptionTranslation){
      if (this.language == 'es') this.description = this.descriptionTranslation.es ? this.descriptionTranslation.es : this.description;
      else if (this.language == 'fr') this.description = this.descriptionTranslation.fr ? this.descriptionTranslation.fr : this.description;
      else if (this.language == 'zh') this.description = this.descriptionTranslation.zh ? this.descriptionTranslation.zh : this.description;
      else if (this.language == 'ja') this.description = this.descriptionTranslation.ja ? this.descriptionTranslation.ja : this.description;
      else if (this.language == 'de') this.description = this.descriptionTranslation.de ? this.descriptionTranslation.de : this.description;
      else this.description = this.descriptionTranslation.en ? this.descriptionTranslation.en : this.description;
    }
  }

  getTranslation(id: string){
    this.translationService.getTranslation(id).then(data => {
      if (!this.verify(data))
        this.updateTranslation(id, this.description);
    }).catch(err => {
      this.addTranslation(id, this.description);
    });
  }

  addTranslation(id: string , description: string){
    this.translationService.addTranslation(id, description);
  }

  updateTranslation(id: string, description: string){
    this.translationService.updateTranslation(id, description + ' ');
  }

  verify(translation: Translation): boolean{
    let valid: boolean = true;
    if (translation.en && translation.zh && translation.es && translation.fr && translation.de && translation.ja){
      valid = true;
    }
    else{
      valid = false;
    }
    return valid;
  }
}
