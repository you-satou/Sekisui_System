import { Router } from '@angular/router';
import { Component, ViewChild, Input, OnChanges, ViewEncapsulation, ViewContainerRef, Renderer2 } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';

import { OrderDetail } from '../entities/ODIS0010.entity';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
  encapsulation: ViewEncapsulation.None,
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

  constructor(
    private router: Router,
   ) {  }

  ngOnChanges( ) {

    this.dataSource = new MatTableDataSource<OrderDetail>(this.resultData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // ソートした状態が前の状態に戻らない,　降順ー昇順だけ
    this.sort.disableClear = true;

  }
  
  switchPage(data: OrderDetail){

    this.router.navigate(['./OrderDetailInput']);

  }
}

