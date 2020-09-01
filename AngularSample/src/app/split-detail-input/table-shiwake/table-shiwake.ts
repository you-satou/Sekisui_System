import { SplitOrderDetailService } from './../split-detail-input-service';
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from './../split-detail-input-interface';
import { Component, OnInit, ViewChild, Input, OnChanges } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CommonComponent } from 'app/common/common.component';
import { CommonService } from 'app/common/common.service';
import { AddSupplierPatternService } from '../../add-order-detail/add-supplier-pattern.service';

@Component({
  selector: 'split-shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class SplitOrderDetailShiwakeTable {

  @Input() shiwakeData: SplitOrderDetailShiwake[];
  @Input() bunkatsuData: SplitOrderDetailSplit[];

  orderPlanAmount:String;
  comment:String;
  requestDate:String;
  requester:String;

  // @Input() addData: SplitOrderDetailSplit = [
  //   this.orderPlanAmount,
  //   this.comment,
  //   this.requestDate,
  //   this.requester,
  //   "approvalDate_lv1",
  //   "approvalPerson_lv1",
  //   "approvalDate_lv2",
  //   "approvalPerson_lv2",
  //   "orderDate",
  //   "orderAmount",
  //   "recievedDate",
  //   "recievedAmount",
  //   "paymentDate",
  //   "paymentAmount"
  // ]

  testichok: number = 10;

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
  sum: number = 0;

  constructor(
    private commonComponent: CommonComponent,
    private modalService: AddSupplierPatternService,
  ) {}

  ngOnInit() {
    this.orderPlanAmount = this.modalService.getVal1();
    this.comment = this.modalService.getVal2();
    this.requestDate = this.modalService.getVal3();
    this.requester = this.modalService.getVal4();

    if(this.orderPlanAmount || this.comment || this.requestDate || this.requester) {
      this.bunkatsuData.push(this.bunkatsuData[this.bunkatsuData.length - 1])
    }
  }

  ngOnChanges(changes: any): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.sum = this.bunkatsuData.map(data => Number(data.orderPlanAmount)).reduce((acc, value) => (acc + value));
  }

  public onSelHighLight($event, selectedItem){

    this.commonComponent.CommonOnSelHight($event);
  }

}
