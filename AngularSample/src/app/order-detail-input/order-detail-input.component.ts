import { OrderDetailInput, OrderTABLE1, OrderDetailShiwake, OrderDetailSplit } from '../order-detail-input/order-detail-input-interface';
import { OrderDetailInputService } from './order-detail-input-service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input, OnChanges, HostListener } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { OrderService } from '../common/order.service';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    @Input() contracNum: string;
    
    title = '発注明細入力＿詳細入力';

    shiwakeData: OrderDetailShiwake[];;
    bunkatsuData: OrderDetailSplit[];

    orderInputDatas : OrderDetailInput[];

    TBL1: OrderTABLE1[];
    TBL2: OrderTABLE1[];

    // url
    _urlShiwake: string = "assets/data/dataShiwake.json";
    _urlSplit: string = "assets/data/dataSplit.json";
    _urlOrderInput: string = "assets/data/dataOrderInput.json";
    _urlOrderTBL1: string = "assets/data/dataInputTBL1.json";
    _urlOrderTBL2: string = "assets/data/dataInputTBL2.json";

    ngOnInit() {

      this.getOrderInputData();
    }

    constructor(
      private orderService: OrderService,

    ){ }
    

    getOrderInputData(){

      this.orderService.getMultipileDataFromServer(this._urlOrderInput)
      .subscribe(
        data => this.orderInputDatas = data
      );


      this.orderService.getMultipileDataFromServer(this._urlOrderTBL1)
      .subscribe(
        data =>this.TBL1 = data
      );

      this.orderService.getMultipileDataFromServer(this._urlOrderTBL1)
      .subscribe(
        data =>this.TBL2 = data
      );

      this.orderService.getMultipileDataFromServer(this._urlShiwake)
      .subscribe(
        data => this.shiwakeData = data
      );

      this.orderService.getMultipileDataFromServer(this._urlSplit)
      .subscribe(
        data => this.bunkatsuData = data
      );     
    }

  }