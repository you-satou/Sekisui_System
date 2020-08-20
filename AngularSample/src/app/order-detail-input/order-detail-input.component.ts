import { OrderDetailApprovalService } from './../order-detail-approval/order-detail-service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { OrderDetailInput } from '../order-detail-input/order-detail-input-interface';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    @Input() contracNum: string;
    
    title = '発注明細入力＿明細入力';
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
    
    shiwakeData:any;

    bunkatsuData: any;

    orderInputData: OrderDetailInput;

    ngOnInit() {
      // this.rowNumber = document.getElementById('rowNumber').childElementCount;
      // this.rowNumberWidth = document.getElementById('rowNumber').clientWidth;
      this.contractWidth = document.getElementById('contractWidth').clientWidth;
      this.orderTypeWidth = document.getElementById('orderTypeWidth').clientWidth + 1;
      this.codeWidth = document.getElementById('code1Width').clientWidth + document.getElementById('code2Width').clientWidth + 2;
      this.dateWidth = document.getElementById('dateWidth').clientWidth + 1;
      this.priceWidth = document.getElementById('priceWidth').clientWidth + 1;
      this.sendWidth = document.getElementById('sendWidth').clientWidth + 1;
      this.salesWidth = document.getElementById('sales1Width').clientWidth + document.getElementById('sales2Width').clientWidth + 2;
      this.thisOneWidth = document.getElementById('thisOne').clientWidth + 1;
      this.orderInfo3Table1Width = document.getElementById('orderInfo3Table1').clientWidth + 30;
      this.theadHeight = document.getElementById('theadHeight').clientHeight;

      document.getElementById('try').setAttribute('width', this.contractWidth.toString());

    }

    constructor(
      private service: OrderDetailApprovalService
    ){
      this.getOrderInputData();
      this.getShiwakeData();
    }

    getShiwakeData(){

      this.service.getOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
      

    }

    getOrderInputData(){
      var dt : any;
      this.service.getOrderInputData()
      .subscribe(
        data => dt = data
      );

      // if(this.contracNum.localeCompare(dt.contracNum)){
      //   this.orderInputData = dt;
      // }
        this.orderInputData =dt;
    }
  }