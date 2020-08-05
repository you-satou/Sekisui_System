import { Component, OnInit} from '@angular/core';
import { OrderDetail,OrderSearchInputment } from './orderDetail';
import { testData} from './test-order-detail';
import { Router, ActivatedRoute,ParamMap} from '@angular/router';

@Component({
  selector: 'app-order-detail-approval',
  templateUrl: './order-detail-approval.component.html',
  styleUrls: ['../common/common.component.css',
              './order-detail-approval.component.css']
  // styleUrls: [ './order-detail-approval.component.css','../common/common.component.css'] 
})
export class OrderDetailApprovalComponent implements OnInit {

  pageTitle = "発注明細入力＿承認処理";

  datas: OrderDetail [] = testData;

  inputment: OrderSearchInputment[];

  constructor( private router : ActivatedRoute) { }

  ngOnInit() { 

    // this.router.queryParamMap.subscribe(params =>{
    //   this.pageTitle = params['name'];
    // });
  }
}
