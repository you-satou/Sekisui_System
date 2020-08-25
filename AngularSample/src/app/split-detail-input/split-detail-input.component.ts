import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput} from './split-detail-input-interface';
import { SplitOrderDetailService } from './split-detail-input-service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';

@Component({
    selector: 'order-detail-input',
    templateUrl: './split-detail-input.component.html',
    styleUrls: ['./split-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class SplitOrderDetailInputComponent implements OnInit {
    
    title = '発注明細入力＿分割明細入力';
    
    shiwakeData:SplitOrderDetailShiwake[];

    bunkatsuData: SplitOrderDetailSplit[];

    orderInputDatas : SplitOrderDetailInput[];

    ngOnInit() {

      this.getSplitOrderInputData();
      this.getSplitOderDetailShiwake();
      this.getSplitOrderDetailSplit()

    }

    constructor(
      private service: SplitOrderDetailService,
    ){

    }

    getSplitOderDetailShiwake(){

      this.service.getSplitOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
      

    }

    getSplitOrderInputData(){
      this.service.getSplitOrderInputData()
      .subscribe(
        data => this.orderInputDatas = data
      );
    }

    getSplitOrderDetailSplit(){
      this.service.getSplitOrderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );
    }
  }