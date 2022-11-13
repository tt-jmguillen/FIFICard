import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

class Banner {
  public name: string;
  public imaage: string;
  public path: string;

  constructor(_name: string, _image: string, _path: string) {
    this.name = _name;
    this.imaage = _image;
    this.path = _path;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel', { static: true }) carousel: NgbCarousel;

  banners: Banner[] = [
    new Banner('All Cards', '/assets/images/slider/s-main.png', ''),
    new Banner('Halooween', '/assets/images/slider/s-halloween.png', '/halloween'),
    new Banner('Christmas', '/assets/images/slider/s-xmas.png', ''),
    new Banner('Just Because', '/assets/images/slider/s-just-because.png', '/justbecause'),
    new Banner('Sign & Send', '/assets/images/slider/s-sands.png', '/signandsendpage')
  ];

  router: Router;
  titleService: Title;

  constructor(
    _router: Router,
    _titleService: Title
  ) {
    this.router = _router;
    this.titleService = _titleService;
  }

  ngOnInit(): void {
    //this.carousel.animation = true;
    //this.carousel.cycle();
    this.titleService.setTitle('Fibei Greetings');

    environment.redirect.forEach(element => {
      if (window.location.hostname.toLowerCase() == element.host.toLowerCase()) {
        this.router.navigate([element.main]);
      }
    });
  }

  bannerclick(banner: Banner) {
    if (banner.path != '') {
      this.router.navigate([banner.path]);
    }
  }
}
