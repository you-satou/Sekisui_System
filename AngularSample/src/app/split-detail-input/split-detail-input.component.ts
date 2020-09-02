import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from './split-detail-input-interface';
import { SplitOrderDetailService } from './split-detail-input-service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { AddSupplierPatternService } from '../add-order-detail/add-supplier-pattern.service';
import { SplitOrderDetailShiwakeTable } from './table-shiwake/table-shiwake';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component'
import { Const } from '../common/const'

@Component({
    selector: 'order-detail-input',
    templateUrl: './split-detail-input.component.html',
    styleUrls: ['./split-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class SplitOrderDetailInputComponent implements OnInit {

    

    testich: string = "nichego";

    title = '発注明細入力＿分割明細入力';
    
    shiwakeData:SplitOrderDetailShiwake[];

    bunkatsuData: SplitOrderDetailSplit[];

    orderPlanAmount: string = "test";
    comment: string;
    requestDate: string;
    requester: string;


    constructor(
      private appComponent: AppComponent,
      private service: SplitOrderDetailService,
      // private modalService: SplitOrderDetailService,
      public newRowTest: SplitOrderDetailShiwakeTable,
      private _location: Location,
    ){}

    ngOnInit() {
      this.getSplitOderDetailShiwake();
      this.getSplitOrderDetailSplit()
      this.appComponent.setHeader(Const.ScreenName.S0007,Const.LinKSetting.L0004);
    }

    getSplitOderDetailShiwake(){

      this.service.getSplitOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
    }

    getSplitOrderDetailSplit(){
      this.service.getSplitOrderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );
    }

    public onBackClick($event) {
      this._location.back();
    }

    public onSelectClick($event) {
      // this.modalService.setVal1(this.orderPlanAmount);
      // this.modalService.setVal2(this.comment);
      // this.modalService.setVal3(this.requestDate);
      // this.modalService.setVal4(this.requester);
  
      // if(this.orderPlanAmount || this.comment || this.requestDate || this.requester) {
        
      // }

      this.newRowTest.bunkatsuData.push(this.bunkatsuData[this.bunkatsuData.length - 1]);

    }
  }