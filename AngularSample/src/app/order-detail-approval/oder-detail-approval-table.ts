import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource,MatTableModule} from '@angular/material/table';
import {MatSort} from '@angular/material';

import {OrderDetail} from './orderDetail';
import {testData} from './test-order-detail'
import { Router } from '@angular/router';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
})

export class OrderDetailApprovalTable implements OnInit {

  displayedColumns: string[] = [
      'detail',
      'contractNum', 
      'propertyName',
      'planOrderAmount', 
      'approvalRequestAmount',
      'performanceOrderAmount',
      'receivedAmount',
      'progressRate',
      'createdDetail',
      'approval_1',
      'approval_2',

    ];

    _orderInputURL: string = "/OrderDetailInput";
    result =  new MatTableDataSource<OrderDetail>(testData);
    dataSource :any;
  
    //Table sort but not work yet!!
  @ViewChild(MatSort, {static: true})  sort:MatSort;


  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  datas:OrderDetail[]

  constructor(){}

  ngOnInit() {

    this.dataSource = new MatTableDataSource<OrderDetail>(testData);
    setTimeout(()=>{
      // this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }
  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
  }

  getOrderDetail($event, data){

    var wTbody = $event.target.parentElement.parentElement;
    var rowIndex = wTbody.rowIndex;

  }

}
