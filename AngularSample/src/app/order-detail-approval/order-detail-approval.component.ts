import { Component, OnInit} from '@angular/core';
import { OrderDetail,OrderSearchInputment } from './orderDetail';
import { testData} from './test-order-detail';

@Component({
  selector: 'app-order-detail-approval',
  templateUrl: './order-detail-approval.component.html',
  styleUrls: ['./order-detail-approval.component.css']
})
export class OrderDetailApprovalComponent implements OnInit {

  pageTitle = "発注明細入力＿承認処理";

  datas: OrderDetail [] = testData;

  inputment: OrderSearchInputment[];

  constructor() { }

  ngOnInit() {
  }

}
