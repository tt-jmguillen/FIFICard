import { Component, Input, OnInit } from '@angular/core';
import { CardService } from 'src/app/services/card.service';

export class ItemImage{
  public image?: string;
  public url?: string;
  constructor (_image: string){
    this.image = _image;
  }
}

@Component({
  selector: 'app-imagegrid',
  templateUrl: './imagegrid.component.html',
  styleUrls: ['./imagegrid.component.scss']
})
export class ImagegridComponent implements OnInit {
  @Input() id?: string;

  url?: string;
  urls: ItemImage[] = [];
  service: CardService;
  primary: string = '';

  constructor(
    private _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.service.getCard(this.id!).subscribe(data => {
      if (this.urls.length == 0){
        if ((data.primary) && (data.primary != '')){
          this.primary = data.primary;
        }
        if (data.images){
          if (data.images.length > 0){
            data.images.forEach(image => {
              let itemImage: ItemImage = new ItemImage(image);
              this.urls.push(itemImage);
              this.service.getImageURL(image).then(url => {
                this.AddURL(image, url);
              });
            });
          }
        }
      }
    });
  }

  AddURL(_image: string, _url: string){
    this.urls?.forEach(url => {
      if (url.image == _image){
        url.url = _url;
      }
      if (this.primary != ''){
        if (this.primary == _image){
          this.url = _url;
        }
      }
    });
    if (this.primary == ''){
      if (this.urls[0]?.url){
        this.url = this.urls[0].url;
      }
    }
  }

  changeImage(_url: ItemImage){
    this.url = _url.url
  }

}
