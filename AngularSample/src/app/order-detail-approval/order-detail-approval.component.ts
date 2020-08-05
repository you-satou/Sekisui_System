import { Component, OnInit, NgModule, Input } from '@angular/core';
import { OrderDetail } from './orderDetail';
import { testData} from './test-order-detail';

@Component({
  selector: 'app-order-detail-approval',
  templateUrl: './order-detail-approval.component.html',
  styleUrls: ['./order-detail-approval.component.css']
})
export class OrderDetailApprovalComponent implements OnInit {
  title = "発注明細入力＿承認処理"
  @Input() orderDetails :OrderDetail;
  datas: OrderDetail [] = testData;

  constructor() { }

  ngOnInit() {
  }

}
