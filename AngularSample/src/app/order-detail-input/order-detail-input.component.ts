import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['../common/common.component.css',
                './order-detail-input.component.css']
  })

  export class OrderDetailInputComponent implements OnInit {
    
    title = "発注明細入力＿明細入力";


    ngOnInit() {
    }
  }