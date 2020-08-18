import { Component, OnInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { OrderDetail, OrderSearchInputment } from './orderDetail';
import { testData } from './test-order-detail';
import { ActivatedRoute } from '@angular/router';

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

  datas: OrderDetail[];

  inputment: OrderSearchInputment;

  constructor(
    private router: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,) {

    this.setBlankInputment();

  }

  ngOnInit() { }

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

    var result = Array<OrderDetail>();
    testData.forEach(element => {
      if (Number(element.contractNum) >= Number(this.inputment.contractNumFrom)) {
        result.push(element)
      }

    });
    this.datas = result;
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


  //   getOrderDetail($event){

  //   var wTbody = $event.target.parentElement.parentElement;
  //   // for(var i=0; i < wTbody.rows.length; i++){
  //   //   var rIndex = wTbody.rows[i];
  //   // //   // for(var j = 0; j< rIndex.cells.length; j++){
  //   // //   //   if(j == 0){
  //   // //   //     continue;
  //   // //   //   }

  //   // //   //   this.orderDetail.contractNum = rIndex.cell[j].value;

  //   // //   // }

  //   // //   // rIndex.cell

  //   // }

  //     // alert(rIndex);
  //     var rowIndex = wTbody.rowIndex;
  //     // var rowDatas = wTbody.rows[rowIndex];


  //     alert(rowIndex.cells.length);
  //     return;

  // }


}




