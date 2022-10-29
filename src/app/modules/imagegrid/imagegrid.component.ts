import { ImageService } from 'src/app/services/image.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CardService } from 'src/app/services/card.service';
import { CardImage } from 'src/app/models/card-image';
import { LightGalleryAllSettings } from 'lightgallery/lg-settings';
import { GalleryItem } from 'lightgallery/lg-utils';
import { LightGallery } from 'lightgallery/lightgallery';

export class ItemImage {
  public cardImage: CardImage;
  public image: string;

  constructor(_cardImage: CardImage) {
    this.cardImage = _cardImage;
  }
}

@Component({
  selector: 'app-imagegrid',
  templateUrl: './imagegrid.component.html',
  styleUrls: ['./imagegrid.component.scss']
})
export class ImagegridComponent implements OnInit {
  @ViewChild('gallery', { static: true }) gallery: HTMLElement;

  @Input() set id(_id: string) {
    this.loadImage(_id);
  }

  service: CardService;
  imageService: ImageService;

  constructor(
    _service: CardService,
    _imageService: ImageService
  ) {
    this.service = _service;
    this.imageService = _imageService;
  }

  images: CardImage[] = [];
  selectedimage: string;
  itemImages: ItemImage[] = [];

  settings: Partial<LightGalleryAllSettings>;
  dynamicEl: GalleryItem[] = []

  x: number = 0;

  ngOnInit(): void { }

  loadImage(_id: string) {
    this.service.getImages(_id).then(cardimages => {
      this.images = cardimages;
      if (this.images.length > 0)
        this.selectedimage = this.images[0].url;

      this.images.forEach(image => {
        this.itemImages.push(new ItemImage(image));
      });

      this.loadImageFiles();
    })
  }

  changeImage(url: string) {
    this.selectedimage = url;
  }

  loadImageFiles() {
    this.itemImages.forEach(itemImage => {
      this.imageService.getImageURL(itemImage.cardImage.url).then(image => {
        let index: number = this.itemImages.findIndex(x => x.cardImage.id == itemImage.cardImage.id);
        if (index >= 0) {
          this.itemImages[index].image = image;
          this.x++;

          if (this.x == this.itemImages.length) {
            this.loadGallery();
          }
        }
      });
    });
  }

  loadGallery() {

    this.itemImages.forEach(image => {
      let gallery: GalleryItem = {
        src: image.image,
        thumb: image.image,
        subHtml: `<div class="lightGallery-captions">
                    <h4>` + image.cardImage.title + `</h4>
                  </div>`
      }
      this.dynamicEl.push(gallery);
    });

    this.settings = {
      container: this.gallery,
      dynamic: true,
      hash: false,
      closable: false,
      showMaximizeIcon: true,
      appendSubHtmlTo: '.lg-item',
      slideDelay: 400,
      dynamicEl: this.dynamicEl
    }

    //console.log(this.gallery);
    //const inlineGallery: LightGallery = new LightGallery(this.gallery, this.settings);
    //inlineGallery.openGallery();
  }
}
