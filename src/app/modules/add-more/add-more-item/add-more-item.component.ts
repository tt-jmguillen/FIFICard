import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-more-item',
  templateUrl: './add-more-item.component.html',
  styleUrls: ['./add-more-item.component.scss']
})
export class AddMoreItemComponent implements OnInit {
  @Input() card: Card;
  @Input() count: number;
  @Output() addMoreChange:EventEmitter<number> =new EventEmitter<number>();

  service: CardService;
  imageURL?: string;
  currentCount: number = 0;

  constructor(
    _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.currentCount = this.count;
    if (this.card.primary){
      this.getImage(this.card.primary)
    }
    else{
      if (this.card.images!.length > 0){
        this.getImage(this.card.images![0]);
      }
    }
  }

  getImage(image: string){
    this.getAvailableURL(image).then(url => {
      this.imageURL = url;
    });
  }

  getAvailableURL(image: string): Promise<string>{
    return new Promise((resolve) => {
      this.service.getImageURL(image + environment.imageSize.medium).then(url => {
        resolve(url);
      }).catch(err => {
        this.service.getImageURL(image).then(url => {
          resolve(url);
        }).catch(err => {});
      });
    });
  }

  markItem(){
    if (this.currentCount == 0){
      this.addCount();
    }
  }

  addCount(){
    this.currentCount++;
    this.addMoreChange.emit(this.currentCount);
  }

  lessCount(){
    this.currentCount--;
    this.addMoreChange.emit(this.currentCount);
  }

}
