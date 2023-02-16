import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-postcards',
  templateUrl: './postcards.component.html',
  styleUrls: ['./postcards.component.scss']
})
export class PostcardsComponent implements OnInit {

  title: Title;

  constructor(
    _title: Title
  ) { 
    this.title = _title;
  }

  ngOnInit(): void {
    this.title.setTitle("Postcards");
  }

}
