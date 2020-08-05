import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';

@Component({
    selector: 'supplier-pattern',
    templateUrl: './supplier-pattern.component.html',
    styleUrls: ['./supplier-pattern.component.css']
  })

  export class SupplierPatternComponent implements OnInit {
    
    ngOnInit() {
    }
  }