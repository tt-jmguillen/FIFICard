import { ImageLoaderComponent } from './../image-loader/image-loader.component';
import { environment } from './../../../environments/environment';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CardService } from 'src/app/services/card.service';
import { CardImage } from 'src/app/models/card-image';

export class ItemImage {
  public image?: string;
  public url?: string;
  public small?: string;
  public large?: string;

  constructor(_image: string) {
    this.image = _image;
  }
}

@Component({
  selector: 'app-imagegrid',
  templateUrl: './imagegrid.component.html',
  styleUrls: ['./imagegrid.component.scss']
})
export class ImagegridComponent implements OnInit {
  @Input() id: string;

  service: CardService;

  constructor(
    private _service: CardService
  ) {
    this.service = _service;
  }

  images: CardImage[] = [];
  selectedimage: string;

  ngOnInit(): void {
    this.service.getCardImages(this.id).then(cardimages => {
      environment.imagetitles.forEach(title => {
        cardimages.forEach(cardimage => {
          if (cardimage.title == title) {
            this.images.push(cardimage);
          }
        });
      });

      if (this.images.length > 0)
        this.selectedimage = this.images[0].url;
    }).catch(err => {
      this.loadOldPhotos();
    });
  }

  loadOldPhotos() {
    this.service.getCard(this.id!).subscribe(data => {
      if (data.primary) {
        let primary: CardImage = new CardImage();
        primary.url = data.primary;
        primary.active = true;
        primary.title = 'Other';
        this.images.push(primary);

        data.images!.forEach(image => {
          if (data.primary! != image) {
            let cardimage: CardImage = new CardImage();
            cardimage.url = image;
            cardimage.active = true;
            cardimage.title = 'Other';
            this.images.push(cardimage);
          }
        });
      }
      else {
        if (data.images) {
          data.images!.forEach(image => {
            if (data.primary! != image) {
              let cardimage: CardImage = new CardImage();
              cardimage.url = image;
              cardimage.active = true;
              cardimage.title = 'Other';
              this.images.push(cardimage);
            }
          });
        }
      }

      if (this.images.length > 0)
        this.selectedimage = this.images[0].url;
    });
  }

  changeImage(url: string) {
    this.selectedimage = url;
  }
}
