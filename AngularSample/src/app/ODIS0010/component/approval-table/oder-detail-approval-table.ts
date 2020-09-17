import { Const } from 'app/common/const';
import { Component, ViewChild, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { OrderDetailApprovalComponent } from '../order-detail-approval.component'
import { Router,ActivatedRoute } from '@angular/router';

import { ODIS0010OrderDetail } from '../../entities/odis0010-Form.entity';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailApprovalTable implements OnChanges {

  @Input() resultData: ODIS0010OrderDetail[];

  /** デーベルカラム名の定義列 */
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
    private OrderDetailApprovalComponent: OrderDetailApprovalComponent,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnChanges( ) {

    this.dataSource = new MatTableDataSource<ODIS0010OrderDetail>(this.resultData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // ソートした状態が前の状態に戻らない,　降順ー昇順だけ
    this.sort.disableClear = true;

  }
  
  /**　ページに移動する */
  switchPage(data: ODIS0010OrderDetail){

    this.router.navigate(['OrderDetailInput'])
    .then(() => {
    window.location.reload();
    });
    
  }

}

