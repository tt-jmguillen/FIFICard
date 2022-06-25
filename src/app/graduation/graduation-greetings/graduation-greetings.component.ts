import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graduation-greetings',
  templateUrl: './graduation-greetings.component.html',
  styleUrls: ['./graduation-greetings.component.scss']
})
export class GraduationGreetingsComponent implements OnInit {

    constructor() { }
  
    ngOnInit(): void {
    }
    scroll(el: HTMLElement) {
      el.scrollIntoView({behavior: 'smooth'});
  }
  }
  