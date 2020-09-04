import { OrderDetailInputGeneral,OrderDetailInput, OrderInfo, OrderDetailShiwake, OrderDetailSplit } from '../entities/odis0020.entity';
import { Component, OnInit, ViewEncapsulation, Input, OnChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';

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

    sekkeiData: OrderDetailShiwake[];
    hontaiData: OrderDetailShiwake[];
    tsuikaData: OrderDetailShiwake[];

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
      public router: Router,
    ){ }
    
    getOrderInputData(){

      this.orderService.getSingleData(this._urlOrderInput)
      .subscribe(
        data => {if(data !== undefined){
          this.orderGeneral = data;
          this.orderInputDatas = this.orderGeneral.orderDetail;
          this.TBL1 = this.orderGeneral.orderInfoTable_1;
          this.TBL2 = this.orderGeneral.orderInfoTable_2;
          this.sekkeiData = this.orderGeneral.orderShiwakeTable;
          this.hontaiData = OrderDetailShiwake[0];
          this.tsuikaData = OrderDetailShiwake[0];
          this.bunkatsuData = this.orderGeneral.orderSliptTable;

        }});
    }

    swichPage(order: string){

      switch (order) {
        case 'meisai':
          this.router.navigate(['./OrderDetailAddInput']);
          break;
      
        case 'supplier':
          this.router.navigate(['./SupplierPattern']);
          break;
      }

    }

  }