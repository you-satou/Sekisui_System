import { element } from 'protractor';
import { OrderDetailApprovalService } from './../order-detail-approval/order-detail-service';
import { Component, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { OrderDetailInput, OrderTABLE1 } from '../order-detail-input/order-detail-input-interface';

@Component({
    selector: 'app-order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    // @Input() contracNum: string;
    title = '発注明細入力＿詳細入力';
    marginleftPx: number;

    shiwakeData: any;

    bunkatsuData: any;

    orderInputDatas: OrderDetailInput[];
    marginPixel: number;

    TBL1: OrderTABLE1[];
    TBL2: OrderTABLE1[];

    ngOnInit() {

      this.getOrderInputData();
      this.getShiwakeData();

      
    }

    

    constructor(
      private service: OrderDetailApprovalService,
    ) { }

    getShiwakeData() {

      this.service.getOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
      this.service.getOderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );

    }

    getOrderInputData() {
      this.service.getOrderInputData()
      .subscribe(
        data => this.orderInputDatas = data
      );
      console.log('this.orderInputDatas = ${JSON.stringify(this.orderInputDatas)}');

      this.service.getOrderInputTBL1()
      .subscribe(
        data => this.TBL1 = data
      );

      this.service.getOrderInputTBL2()
      .subscribe(
        data => this.TBL2 = data
      );
      // this.marginleftPx = document.getElementById('secondPart').clientWidth + 30;
      // var secondDiv = document.getElementById('testDiv');
      // secondDiv.setAttribute("style.margin-left.px",this.marginleftPx.toString());
    }

    setDefaultHeight(){
      var height: number;

      height = document.getElementById('koujimei').clientHeight;

      var planPerformanceTBL = document.getElementById('planPerformance');
      planPerformanceTBL.setAttribute('style.height.px',height.toString());

    }
    getTBL1Pixel(){
      var tbl1Width = document.getElementById('tbl1').clientWidth;
      this.marginPixel = tbl1Width + 30;

    }

  }
