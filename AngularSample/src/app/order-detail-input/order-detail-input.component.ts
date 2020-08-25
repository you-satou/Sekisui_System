import { map } from 'rxjs/operators';
import { OrderDetailInputGeneral,OrderDetailInput, OrderInfo, OrderDetailShiwake, OrderDetailSplit } from '../order-detail-input/order-detail-input-interface';
import { OrderDetailInputService } from './order-detail-input-service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input, OnChanges, HostListener } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { CommonService } from '../common/common.service';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    @Input() contracNum: string;
    
    title = '発注明細入力＿詳細入力';

    orderGeneral: OrderDetailInputGeneral;

    shiwakeData: OrderDetailShiwake[];
    bunkatsuData: OrderDetailSplit[];

    orderInputDatas : OrderDetailInput[];

    datas: any[];

    TBL1: OrderInfo[];
    TBL2: OrderInfo[];

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
      private orderService: CommonService,
    ){ }
    
    getOrderInputData(){

      this.orderService.getSingleData(this._urlOrderInput)
      .subscribe(
        data => {if(data !== undefined){
          this.orderGeneral = data;
          this.orderInputDatas = this.orderGeneral.orderDetail;
          this.TBL1 = this.orderGeneral.orderInfoTable_1;
          this.TBL2 = this.orderGeneral.orderInfoTable_2;
          this.shiwakeData = this.orderGeneral.orderShiwakeTable;
          this.bunkatsuData = this.orderGeneral.orderSliptTable;

        }});
    }

  }