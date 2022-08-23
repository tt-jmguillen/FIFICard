import { FilterService } from 'src/app/services/filter.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
   activateRoute: ActivatedRoute;
   filter: FilterService;
   htmlString: string;
   lang: string;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _filter: FilterService
  ) { 
    this.activateRoute = _activateRoute;
    this.filter = _filter;
  }

  ngOnInit(): void {
    this.filter.getLang().subscribe(lang => {
      this.activateRoute.params.subscribe(params => {
        let id: string = params['id'];
        let path = "/assets/static/" + lang + '/' + id + ".html";
        fetch(path).then(res => res.text()).then(data => {
          this.htmlString = data;
        }).catch(reason => {
          //console.log(reason);
        })
      });
    });
  }
}
