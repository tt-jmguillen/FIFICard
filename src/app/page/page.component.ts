import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
   activateRoute: ActivatedRoute;
   htmlString: string;

  constructor(
    private _activateRoute: ActivatedRoute
  ) { 
    this.activateRoute = _activateRoute;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      let id: string = params['id'];
      let path = "/assets/static/" + id + ".html";
      fetch(path).then(res => res.text()).then(data => {
        this.htmlString = data;
      }).catch(reason => {
        console.log(reason);
      })
    });
  }
}
