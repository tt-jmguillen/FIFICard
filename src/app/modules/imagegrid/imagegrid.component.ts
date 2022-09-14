import { ImageLoaderComponent } from './../image-loader/image-loader.component';
import { environment } from './../../../environments/environment';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

  constructor(
    private _service: CardService
  ) { 
    this.service = _service;
  }

  selectedimage: string;
  images: string[] = [];
  service: CardService;
  primary: string;
  mode: string = 'hover';

  ngOnInit(): void {
    this.service.getCard(this.id!).subscribe(data => {
      this.selectedimage = data.primary!;

      if (data.images){
        this.images = data.images;
      }
    });
  }

  changeImage(url: string){
    this.selectedimage = url;
  }

 /*
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
    //console.log(_url);
    this.url = _url.url;
  }
  */
}
