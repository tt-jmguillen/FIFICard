import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  fb: FormBuilder;
  router: Router;
  searchForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _router: Router
  ) { 
    this.fb = _fb;
    this.router = _router;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    })
  }

  searchCard(){
    if (this.searchForm.value['search']){
      let search: string = this.searchForm.value['search'];
      this.router.navigate(['/search/' + search]);
    }
    else{
      this.router.navigate(['/']);
    }
  }

}
