import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort} from '@angular/material';

import {OrderDetail} from './order-detail-approval-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
})

export class OrderDetailApprovalTable implements OnChanges {

  @Input() resultData: OrderDetail[];

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

    dataSource: any;
  @ViewChild(MatSort, {static: true})  sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  datas: OrderDetail[];

  constructor() {}

  ngOnChanges(
  ) {

    this.dataSource = new MatTableDataSource<OrderDetail>(this.resultData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getOrderDetail($event, data) {

  }

}
