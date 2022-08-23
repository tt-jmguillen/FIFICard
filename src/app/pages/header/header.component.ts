import { FilterService } from 'src/app/services/filter.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

class Language{
  public name: string;
  public code: string;

  constructor(name: string, code: string){
    this.name = name;
    this.code = code;
  }
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  logo: string;
  languages: Language[] = [];
  lang: string

  constructor(
    private translate: TranslateService,
    private filter: FilterService
  ) { }

  ngOnInit(): void {
    this.languages.push(new Language('English', 'en'));
    this.languages.push(new Language('Mandarin', 'zh'));
    this.languages.push(new Language('Hindi', 'hi'));
    this.languages.push(new Language('Spanish', 'es'));
    this.languages.push(new Language('French', 'fr'));

    this.lang = localStorage.getItem("language")!? localStorage.getItem("language")! : 'en';
    this.filter.setLang(this.lang);

    this.logo = "/assets/images/logo_fibeigreetings.png";

    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()){
        this.logo = element.logo;
      }
    });
    
  }

  changeLang(event: any){
    this.translate.use(event.target.value);
    localStorage.setItem("language", event.target.value);
    this.filter.setLang(event.target.value);
  }

}
