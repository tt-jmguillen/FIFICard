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
  search: string;
  budget: string = '';
  sort: string = '';

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
    });
    if (localStorage.getItem('budget'))
      this.budget = localStorage.getItem('budget')!.toString();
      if (localStorage.getItem('sort'))
      this.sort = localStorage.getItem('sort')!.toString();
  }

  searchCard(){
    if (this.searchForm.value['search']){
      this.search = this.searchForm.value['search'];
    }
    this.doSearch();
  }

  changeBudget(event: any){
    this.budget = event.target.value;
    localStorage.setItem('budget', this.budget);
    if (window.location.pathname.includes('/events')){
      window.location.reload();
    }
  }

  changeSort(event: any){
    this.sort = event.target.value;
    localStorage.setItem('sort', this.sort);
    if (window.location.pathname.includes('/events')){
      window.location.reload();
    }
  }

  doSearch(){
    if (this.search)
      this.router.navigate(['/search/' + this.search]);
    else
      this.router.navigate(['/']);
  }

}
