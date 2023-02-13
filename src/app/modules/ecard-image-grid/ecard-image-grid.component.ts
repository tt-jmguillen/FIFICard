import { LightboxComponent } from './../lightbox/lightbox.component';
import { LightboxImage } from './../lightbox/lightbox-image';
import { ImageService } from 'src/app/services/image.service';
import { CardService } from 'src/app/services/card.service';
import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ECardImage } from 'src/app/models/ecard-image';

@Component({
  selector: 'app-ecard-image-grid',
  templateUrl: './ecard-image-grid.component.html',
  styleUrls: ['./ecard-image-grid.component.scss']
})
export class ECardImageGridComponent implements OnInit {
  @Input() id: string;
  @ViewChild('lightbox') lightbox: LightboxComponent;

  def: ChangeDetectorRef;
  cardService: CardService;
  imageService: ImageService;

  constructor(
    _def: ChangeDetectorRef,
    _cardService: CardService,
    _imageService: ImageService
  ) { 
    this.def = _def;
    this.cardService = _cardService;
    this.imageService = _imageService;
  }

  image: ECardImage;
  lightboxImages: LightboxImage[] = [];
  url: string = '';

  ngOnInit(): void {
    this.loadImage();
  }

  loadImage(){
    this.cardService.getECardImages(this.id).then(images => {
      this.image = images.find(x => x.title == 'preview')!;
      this.def.detectChanges();
      if (this.image){
        this.imageService.getImageURL(this.image.url).then(url => {
          this.url = url;
          this.def.detectChanges();
          this.lightboxImages.push(new LightboxImage(1, url, 'Preview'));
          console.log(this.lightboxImages)
        })
      }
    })
  }

  openItem() {
    this.lightbox.open(0);
  }

}
