import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
import { CommonComponent } from 'app/common/common.component';
import { OrderSplitApprovalMasterTable } from '../entities/odis0070.entity';
import { OrderSplitApprovalMasterService } from '../services/order-split-approval-master-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-split-approval-master',
  templateUrl: './order-split-approval-master.component.html',
  styleUrls: ['./order-split-approval-master.component.css']
})
export class OrderSplitApprovalMasterComponent implements OnInit {

  personalID: string = "";
  employeeCode: string = "";
  employeeName: string = "";
  approval1: string = "";
  approval2: string = "";
  deleteFlag: string = "";

  selected: boolean;
  
  index: number;

  orderApprovalData: OrderSplitApprovalMasterTable[];

  orderApprovalColumns: string[] = [
    'personalID',
    'employeeCode',
    'employeeName',
    'approval1',
    'approval2',
    'deleteFlag'
  ];

  dataSource: any;

  constructor(
    private appComponent: AppComponent,
    private commonComponent: CommonComponent,
    private _location: Location,
    private service: OrderSplitApprovalMasterService,
  ) { }

  ngOnInit() {
    this.appComponent.setHeader(Const.ScreenName.S0007, Const.LinKSetting.L0007);
    this.getOrderSplitApproval();
  }

  getOrderSplitApproval() {

    this.service.getOrderSplitApproval()
      .subscribe(
        data => this.orderApprovalData = data
      );
  }

  public onBackClick($event) {
    this._location.back();
  }

  public onSelHighLight($event, selectedItem) {
    this.commonComponent.CommonOnSelHight($event);
    this.selected = true
    this.personalID = selectedItem.personalID;
    this.employeeCode = selectedItem.employeeCode;
    this.employeeName = selectedItem.employeeName;
    this.approval1 = selectedItem.approval1;
    this.approval2 = selectedItem.approval2;
    this.deleteFlag = selectedItem.deleteFlag;
    this.index = this.orderApprovalData.indexOf(selectedItem);
  }
}
