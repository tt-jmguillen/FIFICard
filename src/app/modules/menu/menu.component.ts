import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { url } from 'inspector';
import { CardService } from 'src/app/services/card.service';

export class Menu{
  public name: string;
  public active: boolean;
  constructor(_name: string, _active: boolean){
    this.name = _name;
    this.active = _active;
  }
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {
  event?: string;
  service: CardService;
  router: Router;
  categories: Menu[] = [new Menu('All', false)];

  constructor(
    private _service: CardService,
    private _activateRoute: ActivatedRoute,
    private _router: Router
  ) { 
    this.service = _service;
    this.router = _router;
  }

  ngOnInit(): void {
    this.router.events.subscribe(event =>{
      if (event instanceof NavigationStart){
        if (event['url'].includes('/events/')){
          this.event = event['url'].replace('/events/', '').replace('%20', ' ');
        }

        if ((!this.event) || (this.event == "All")){
          this.categories[0].active = true;
        }
        this.loadCategories();
      }
    });
  }

  loadCategories(){
    this.service.getCards().then(cards => {
      cards.forEach(card => {
        if (card.event){
          let events: string[] = card.event!.split(",");
          events.forEach(category => {
            this.addCategory(category);
          })
        }
      });
      //console.log(this.categories);
    });
  }

  addCategory(category: string){
    let isFound: boolean = false;
    this.categories.forEach(cat => {
      if (cat.name == category.trim()){
        isFound = true;
      }``
    })
    if (!isFound){
      this.categories.push(new Menu(category.trim(), this.event == category.trim()));
    }
  }

}
