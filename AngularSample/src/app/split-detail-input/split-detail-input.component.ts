import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from './split-detail-input-interface';
import { SplitOrderDetailService } from './split-detail-input-service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { AddSupplierPatternService } from '../add-order-detail/add-supplier-pattern.service';
// import { SplitOrderDetailShiwakeTable } from './table-shiwake/table-shiwake';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component'
import { Const } from '../common/const'
import { CommonComponent } from 'app/common/common.component';
import { Router } from '@angular/router';

@Component({
  selector: 'order-detail-input',
  templateUrl: './split-detail-input.component.html',
  styleUrls: ['./split-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SplitOrderDetailInputComponent implements OnInit {

  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
  ];

  bunkatsuColumnsName: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];



  headerColspan: string[] = [
    'no',
    'orderPlanAmount',
    'comment',
    'irai',
    'shounin_1',
    'shounin_2',
    'order',
    'recieved',
    'payment',
  ]


  rows: string[] = [
    'index',
    'orderPlanAmount1',
    'comment1',
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
    'orderDate',
    'orderAmount',
    'recievedDate',
    'recievedAmount',
    'paymentDate',
    'paymentAmount',
  ];

  dataSource: any;

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  sum: number = 0;


  testich: string = "nichego";

  title = '発注明細入力＿分割明細入力';

  shiwakeData: SplitOrderDetailShiwake[];

  bunkatsuData: SplitOrderDetailSplit[];

  orderPlanAmount: string;
  comment: string;
  requestDate: string;
  requester: string;


  constructor(
    private appComponent: AppComponent,
    private service: SplitOrderDetailService,
    private modalService: SplitOrderDetailService,
    private _location: Location,
    private commonComponent: CommonComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getSplitOderDetailShiwake();
    this.getSplitOrderDetailSplit()
    this.appComponent.setHeader(Const.ScreenName.S0007, Const.LinKSetting.L0004);
  }

  getSplitOderDetailShiwake() {

    this.service.getSplitOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
  }

  getSplitOrderDetailSplit() {
    this.service.getSplitOrderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );
  }

  public onBackClick($event) {
    this._location.back();
  }

  public onSelectClick($event) {

    if(this.orderPlanAmount || this.comment || this.requestDate || this.requester) {
      var temp: SplitOrderDetailSplit = {
        orderPlanAmount: this.orderPlanAmount,
        comment: this.comment,
        requestDate: this.requestDate,
        requester: this.requester,
        approvalDate_lv1: "",
        approvalPerson_lv1: "",
        approvalDate_lv2: "",
        approvalPerson_lv2: "",
        orderDate: "",
        orderAmount: "",
        recievedDate: "",
        recievedAmount: "",
        paymentDate: "",
        paymentAmount: "",
      }
  
      this.bunkatsuData.push(temp);
      this.table.renderRows();
    }
  }

  ngOnChanges() {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.sum = this.bunkatsuData.map(data => Number(data.orderPlanAmount)).reduce((acc, value) => (acc + value));
    this.bunkatsuData.push(this.bunkatsuData[this.bunkatsuData.length - 1])
  }

  public onSelHighLight($event, selectedItem) {

    this.commonComponent.CommonOnSelHight($event);
  }
}