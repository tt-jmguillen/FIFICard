import { Component, Input, OnInit, AfterViewInit, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { ImageService } from 'src/app/services/image.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss']
})
export class ImageLoaderComponent implements OnInit {
  @Input() set img(img: string) {
    this.image = img;
    this.loadImage();
  }

  @Input() set size(size: number) {
    this.default = size;
    this.loadImage();
  }

  @Input() zoom: boolean = false;

  @Output() select: EventEmitter<string> = new EventEmitter<string>();

  service: ImageService;

  constructor(
    _service: ImageService
  ) {
    this.service = _service;
  }

  image: string;
  default: number;
  defaulurl: string = '/assets/images/loading.gif';
  url: string = '/assets/images/loading.gif';
  mode: string = 'hover';

  ngOnInit(): void { }

  loadImage() {
    this.url = this.defaulurl;

    if (this.image) {
      let imagefull = this.image;

      if (this.default == 4)
        imagefull = this.image + environment.imageSize.xlarge;
      else if (this.default == 3)
        imagefull = this.image + environment.imageSize.large;
      else if (this.default == 2)
        imagefull = this.image + environment.imageSize.medium;
      else if (this.default == 1)
        imagefull = this.image + environment.imageSize.small
      else
        imagefull = this.image;



      this.service.getImageURL(imagefull).then(url => {
        this.url = url;
      }).catch(err => {
        if (imagefull != this.image) {
          this.service.getImageURL(this.image).then(url => this.url = url);
        }
      })
    }
  }

  selectimage() {
    this.select.emit(this.image);
  }
}
