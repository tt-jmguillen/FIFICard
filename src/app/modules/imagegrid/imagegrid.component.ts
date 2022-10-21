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
  @Input() set id(_id: string) {
    this.loadImage(_id);
  }

  service: CardService;

  constructor(
    private _service: CardService
  ) {
    this.service = _service;
  }

  images: CardImage[] = [];
  selectedimage: string;

  ngOnInit(): void { }

  loadImage(_id: string) {
    this.service.getImages(_id).then(cardimages => {
      console.log(cardimages);
      this.images = cardimages;
      if (this.images.length > 0)
        this.selectedimage = this.images[0].url;
    })
  }

  changeImage(url: string) {
    this.selectedimage = url;
  }
}
