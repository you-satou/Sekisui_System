import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';

@Component({
    selector: 'split-detail-input',
    templateUrl: './split-detail-input.component.html',
    styleUrls: ['./split-detail-input.component.css']
  })

  export class SplitDetailInputComponent implements OnInit {
    
    ngOnInit() {
    }
  }