import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css']
  })

  export class OrderDetailInputComponent implements OnInit {
    
    title = "発注明細入力＿明細入力";
    test: number;
    
    ngOnInit() {
      let tableBody = document.getElementById("orderInfoCount");
      this.test = tableBody.childElementCount - 1;
    }
  }