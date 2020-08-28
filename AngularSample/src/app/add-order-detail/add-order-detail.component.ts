import { SplitOrderDetailShiwake, AddOrderDetail } from './../split-detail-input/split-detail-input-interface';
import { SplitOrderDetailService } from '../split-detail-input/split-detail-input-service';
import { Component, OnInit, OnChanges, Output, EventEmitter, ChangeDetectorRef, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { testData } from './test-data';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component'
import { Const } from '../common/const'

@Component({
    selector: 'supplier-pattern',
    templateUrl: './add-order-detail.component.html',
    styleUrls: ['../common/common.component.css',
                './add-order-detail.component.css'],
    encapsulation: ViewEncapsulation.None
  })

export class AddOrderDetailComponent implements OnInit {

  title: String = "発注明細入力＿分割明細入力";

  path:any;

  datas: AddOrderDetail[] = testData;
  resVal: AddOrderDetail;

  shiwakeData: SplitOrderDetailShiwake[];


  constructor(
    private appComponent: AppComponent,
    private modalService: SplitOrderDetailService,
    private _location: Location,
  ){}

  ngOnInit() {
    this.getSplitOderDetailShiwake();
    this.appComponent.setHeader(Const.ScreenName.S0008,Const.LinKSetting.L0004);
  }

  getSplitOderDetailShiwake(){

    this.modalService.getSplitOderDetailShiwake()
    .subscribe(
      data => this.shiwakeData = data
    );
  }

  public onBackClick($event) {
    this._location.back();
  }

  public onSelectClick($event) {
    this.modalService.setVal(this.resVal);
    this.path = this._location.back();
    this._location.go(this.path);
  }

}