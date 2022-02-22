import { environment } from './../../../environments/environment';
import { Component, Input, OnInit } from '@angular/core';
import { CardService } from 'src/app/services/card.service';

export class ItemImage{
  public image?: string;
  public url?: string;
  public small?: string;
  public large?: string;

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
  primary: string;

  constructor(
    private _service: CardService
  ) { 
    this.service = _service;
  }

  ngOnInit(): void {
    this.service.getCard(this.id!).subscribe(data => {
      if (this.urls.length == 0){
        this.primary = data.primary!;

        if (data.images){
          if (data.images.length > 0){
            data.images.forEach(image => {
              let itemImage: ItemImage = new ItemImage(image);
              this.urls.push(itemImage);
            });

            this.urls.forEach(image => {
              this.getImages(image.image!);
            });
          }
        }
      }
    });
  }

  getImages(image: string){
    this.service.getImageURL(image + environment.imageSize.small).then(url => {
      this.AddURL(image, url, 1);
    });
    this.service.getImageURL(image + environment.imageSize.large).then(url => {
      this.AddURL(image, url, 2);
    });
    this.service.getImageURL(image).then(url => {
      this.AddURL(image, url, 0);
    });
  }

  AddURL(_image: string, _url: string, type: number): Promise<boolean>{
    return new Promise((resolve) => {
      this.urls?.forEach(url => {
        if (url.image == _image){
          if (type == 0){
            url.url = _url;
            if (this.primary == _image){
              this.url = _url;
            }
          }
          if (type == 1)
            url.small = _url;
          if (type == 2)
            url.large = _url;
        }
      });

      if (!this.primary || (this.primary == '')){
        this.url = this.urls[0].url;
      }
      resolve(true);
    })
  }

  changeImage(_url: ItemImage){
    console.log(_url);
    this.url = _url.url;
  }

}
