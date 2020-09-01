import { SplitOrderDetailShiwake, SplitOrderDetailSplit, AddOrderDetail } from './../split-detail-input/split-detail-input-interface';
import { SplitOrderDetailService } from '../split-detail-input/split-detail-input-service';
import { Component, OnInit, OnChanges, Output, EventEmitter, ChangeDetectorRef, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { testData} from './test-data';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';
import { Const } from '../common/const';
import { CommonComponent } from '../common/common.component';
import { AddSupplierPatternService } from './add-supplier-pattern.service';

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
  shiwakeData: SplitOrderDetailShiwake[];
  bunkatsuData: SplitOrderDetailSplit[];
  datas: AddOrderDetail[] = testData;
  resVal: AddOrderDetail;
  testok: string = "testok";

  orderPlanAmount: string;
  comment: string;
  requestDate: string;
  requester: string;

  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
  ];

  dataSource: any;
  marginleftPx: number;

  
  
  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private appComponent: AppComponent,
    private modalService: AddSupplierPatternService,
    private _location: Location,
    private router: Router,
    private commonComponent: CommonComponent,
  ){}

  ngOnInit() {
    this.getSplitOderDetailShiwake();
    this.appComponent.setHeader(Const.ScreenName.S0008,Const.LinKSetting.L0004);
  }

  getTotalPlanAmount() {

    return this.bunkatsuData.map(t => Number(t.orderPlanAmount)).reduce((acc, value) => acc + value, 0);
  }

  getDetail($event, dataDetail) {

    let shiwakeCode = dataDetail.journalCode;


    alert(dataDetail.journalCode);

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
    this.modalService.setVal1(this.orderPlanAmount);
    this.modalService.setVal2(this.comment);
    this.modalService.setVal3(this.requestDate);
    this.modalService.setVal4(this.requester);

    if(this.orderPlanAmount || this.comment || this.requestDate || this.requester) {

    }
  }

     /**
   * テーブル クリック 選択背景 設定
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem){
    // TODO
    this.resVal = selectedItem;

    this.commonComponent.CommonOnSelHight($event);
  }
}