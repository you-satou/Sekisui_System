import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';

@Component({
  selector: 'app-order-supplier-select',
  templateUrl: './order-supplier-select.component.html',
  styleUrls: ['./order-supplier-select.component.css']
})
export class OrderSupplierSelectComponent implements OnInit {

  ossShiwakeNameWidth: number;
  secondTableMargin: number;
  tablesWidth: number;
  tdossShiwakeKode: number;
  tdossShiwakeKeiri: number;
  tdossShiwakeName: number;
  ossSendAddressWidth: number;
  
  ngOnInit() {

    this.ossShiwakeNameWidth = document.getElementById("ossShiwakeName").clientWidth;
    this.secondTableMargin = this.ossShiwakeNameWidth + 80;
    this.tablesWidth = this.secondTableMargin + document.getElementById("ossTable-Shiwake").clientWidth;
    this.tdossShiwakeKode = document.getElementById("tdossShiwakeKode").clientWidth;
    this.tdossShiwakeKeiri = document.getElementById("tdossShiwakeKeiri").clientWidth;
    this.tdossShiwakeName = document.getElementById("tdossShiwakeName").clientWidth;
    this.ossSendAddressWidth = document.getElementById("ossSendAddressCode").clientWidth + document.getElementById("ossSendAddressName").clientWidth;;

  }

}
