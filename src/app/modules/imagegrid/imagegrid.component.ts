import { LightboxImage } from './../lightbox/lightbox-image';
import { ImageService } from 'src/app/services/image.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CardService } from 'src/app/services/card.service';
import { CardImage } from 'src/app/models/card-image';
import { LightboxComponent } from '../lightbox/lightbox.component';
import { title } from 'process';

export class ItemImage {
  public id: number;
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
  @Input() set id(_id: string) {
    this.loadImage(_id);
  }
  @ViewChild('lightbox') lightbox: LightboxComponent;

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
  selectedimage: CardImage = new CardImage();
  itemImages: ItemImage[] = [];
  x: number = 0;
  isGalleryAvailable: boolean = false;
  lightboxImages: LightboxImage[] = [];
  title: string = '';

  ngOnInit(): void { }

  loadImage(_id: string) {
    this.service.getImages(_id).then(cardimages => {
      this.images = cardimages;
      if (this.images.length > 0)
        this.selectedimage = this.images[0];

      this.images.forEach(image => {
        this.itemImages.push(new ItemImage(image));
      });

      this.loadImageFiles();
    });

    this.service.getACard(_id).then(card => {
      this.title = card.name!;
    })
  }

  changeImage(url: string) {
    let index: number = this.images.findIndex(x => x.url == url);
    this.selectedimage = this.images[index];
  }

  openItem(url: string) {
    let index: number = this.itemImages.findIndex(x => x.image == url);
    this.lightbox.open(this.itemImages[index].id);
  }

  loadImageFiles() {
    this.itemImages.forEach(itemImage => {
      this.imageService.getImageURL(itemImage.cardImage.url).then(image => {
        let index: number = this.itemImages.findIndex(x => x.cardImage.id == itemImage.cardImage.id);
        if (index >= 0) {
          this.itemImages[index].image = image;
          this.x++;

          if (this.x == this.itemImages.length) {
            this.isGalleryAvailable = true;
            this.loadGallery();
          }
        }
      });
    });
  }

  loadGallery() {
    let x: number = 1;
    this.itemImages.forEach(item => {
      item.id = x;
      this.lightboxImages.push(new LightboxImage(x, item.image, item.cardImage.title));
      x++;
    });
  }

  open() {
    this.lightbox.open(0);
  }
}
