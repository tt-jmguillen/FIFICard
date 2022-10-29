import { FilterService } from './../../services/filter.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  filterService: FilterService;
  fb: UntypedFormBuilder;
  router: Router;
  searchForm: UntypedFormGroup;
  search: string;
  budget: string = '';
  sort: string = '';

  constructor(
    private _filterService: FilterService,
    private _fb: UntypedFormBuilder,
    private _router: Router
  ) { 
    this.filterService = _filterService
    this.fb = _fb;
    this.router = _router;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: ['']
    });
  }

  searchCard(){
    if (this.searchForm.value['search']){
      this.search = this.searchForm.value['search'];
      //console.log(this.search);
      this.router.navigate(['/search/' + this.search]);
      //sthis.filterService.setSearch(this.search);
      //if (window.location.pathname != '/search'){
      //  this.router.navigate(['/search']);
      //}
    }
  }

  changeBudget(event: any){
    this.budget = event.target.value;
    this.filterService.setBudget(this.budget);
  }

  changeSort(event: any){
    this.sort = event.target.value;
    this.filterService.setSort(this.sort);
  }

}
