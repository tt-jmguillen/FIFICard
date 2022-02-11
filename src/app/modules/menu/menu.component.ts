import { Component, OnInit } from '@angular/core';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  service: CardService;
  categories: string[] = ['All'];

  constructor(
    private _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.loadCategories();
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
      console.log(this.categories);
    });
  }

  addCategory(category: string){
    let isFound: boolean = false;
    this.categories.forEach(cat => {
      if (cat == category.trim()){
        isFound = true;
      }
    })
    if (!isFound){
      this.categories.push(category.trim());
    }
  }

}
