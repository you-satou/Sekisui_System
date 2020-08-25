import { OrderDetailApprovalService } from './../order-detail-approval/order-detail-service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input, OnChanges, HostListener } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { OrderDetailInput, OrderTABLE1 } from '../order-detail-input/order-detail-input-interface';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    // @Input() contracNum: string;
    
    title = '発注明細入力＿詳細入力';
    thisOneWidth: number;
    contractWidth: number;
    orderTypeWidth: number;
    codeWidth: number;
    dateWidth: number;
    priceWidth: number;
    sendWidth: number;
    salesWidth: number;
    orderInfo3Table1Width: number;
    theadHeight: number;
    
    marginleftPx: number;

    shiwakeData:any;

    bunkatsuData: any;

    orderInputDatas : OrderDetailInput[];

    TBL1: OrderTABLE1[];
    TBL2: OrderTABLE1[];

    tbl2Colspan: number;


    ngOnInit() {
      // this.contractWidth = document.getElementById('contractWidth').clientWidth;
      // this.orderTypeWidth = document.getElementById('orderTypeWidth').clientWidth + 1;
      // this.codeWidth = document.getElementById('code1Width').clientWidth + document.getElementById('code2Width').clientWidth + 2;
      // this.dateWidth = document.getElementById('dateWidth').clientWidth + 1;
      // this.priceWidth = document.getElementById('priceWidth').clientWidth + 1;
      // this.sendWidth = document.getElementById('sendWidth').clientWidth + 1;
      // this.salesWidth = document.getElementById('sales1Width').clientWidth + document.getElementById('sales2Width').clientWidth + 2;
      // this.thisOneWidth = document.getElementById('thisOne').clientWidth + 1;
      // this.orderInfo3Table1Width = document.getElementById('orderInfo3Table1').clientWidth + 30;
      // this.theadHeight = document.getElementById('theadHeight').clientHeight;

      // document.getElementById('try').setAttribute('width', this.contractWidth.toString());

    

      
      

      // let thNode = document.createElement('th');
      // thNode.colSpan = this.tbl2Colspan;
      // thNode.textContent = "追加工事";
      // let rows = document.getElementById('rowstest');
      // rows.appendChild(thNode);

      this.getOrderInputData();
      this.getShiwakeData();


    }

    constructor(
      private service: OrderDetailApprovalService,
      // private input : OrderDetailInput
    ){
      // this.getOrderInputData();
      // this.getShiwakeData();
      
    }

    getShiwakeData(){

      this.service.getOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
      
      this.service.getOderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );

    }

    getOrderInputData(){
      this.service.getOrderInputData()
      .subscribe(
        data => this.orderInputDatas = data
      );

      this.service.getOrderInputTBL1()
      .subscribe(
        data =>this.TBL1 = data
      );

      this.service.getOrderInputTBL2()
      .subscribe(
        data =>this.TBL2 = data
      );
      this.marginleftPx = document.getElementById('secondPart').clientWidth + 30;
      var secondDiv = document.getElementById('testDiv');
      secondDiv.setAttribute("style.margin-left.px",this.marginleftPx.toString());
    }

    // getWidth(){
    //   var secondDiv = document.getElementById('testDiv');
    //   secondDiv.style.marginLeft = this.marginleftPx.toString();
    // }
  }