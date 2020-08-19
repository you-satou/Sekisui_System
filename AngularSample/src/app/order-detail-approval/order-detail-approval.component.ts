import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { OrderDetail, OrderSearchInputment } from './orderDetail';
import { testData } from './test-order-detail';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailApprovalService } from './order-detail-service';

import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-order-detail-approval',
  templateUrl: './order-detail-approval.component.html',
  styleUrls: ['./order-detail-approval.component.css'],
})

export class OrderDetailApprovalComponent implements OnInit {

  recordMax: number = 0;
  pageIndex: number = 0;
  pageMax: number = 0;
  pageSize: number = 20;

  contractNumFrom: string = "";
  contractNumTo: string = "";
  propertyName: string = "";
  startFromName: boolean;
  includeProName: boolean;
  detailCreated: boolean;
  detailNone: boolean;
  approval_1: boolean;
  approval_2: boolean;
  resultASC: boolean;
  resultDESC: boolean;



  pageTitle = "発注明細入力＿承認処理";

  // datas: OrderDetail[] = testData;

  result = [];
  datas: OrderDetail[];

  inputment: OrderSearchInputment;

  constructor(
    private router: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private orderDetailService : OrderDetailApprovalService,
    ) {

    this.setBlankInputment();

  }

  ngOnInit() { }

  //Shokika
  setBlankInputment() {
    this.inputment = new OrderSearchInputment();

    this.inputment.startFromName = true;
    this.inputment.includeProName = false;
    this.inputment.detailCreated = false;
    this.inputment.detailNone = false;
    this.inputment.approval_1 = false;
    this.inputment.approval_2 = false;
    this.inputment.resultASC = true;
    this.inputment.resultDESC = false;
  }

  getSearchRequest() {

    //TODO: Send a request to DB with inputmentValue inside

    this.orderDetailService.getOrderDetail()
    .subscribe(
      data => this.result = data
      );
    this.datas = this.result;
    this.countRecord(this.datas);
  }

  countRecord(datas: OrderDetail[]) {
    if (datas.length == 0) {
      alert("該当データがありません。");
      return;
    }
    if (datas.length > 1000) {
      alert("検索結果が1000件を超えています。絞り込んでください。");
      return;
    }

    this.recordMax = datas.length;
    this.pageMax = Math.floor(datas.length / this.pageSize);
    this.changeDetectorRef.detectChanges();
    this.pageIndex = 1;

  }

  setPageIndex(pageIndex) {
    this.pageIndex = pageIndex;
  }

  pageJump(input: any) {
    if (!Number(input.value)) {
      alert("入力ページは数字のみです。");
      return;
    }
    if (Number(input.value) > this.pageMax || Number(input.value) < 0) {
      alert("不明なページです。選択可能なページ：" + "0 ~ " + this.pageMax);
      return;
    }

    this.pageIndex = Number(input.value);
  }

  pageNext() {
    if (this.pageIndex < this.pageMax) {
      this.pageIndex = this.pageIndex++;
    }
    if (this.pageIndex = this.pageMax) {
      alert("最大のページです。");
      return;
    }

  }

  pagePrevious() {
    if (this.pageIndex < this.pageMax) {
      this.pageIndex = this.pageIndex--;
    }
    if (this.pageIndex = 1) {
      alert("最初のページです。");
      return;
    }
  }
  getOrderDetail($event, data){

    var wTbody = $event.target.parentElement.parentElement;
    var rowIndex = wTbody.rowIndex;

    alert(data.contractNum);

  }


}




