import { Component, ViewChild, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { Router} from '@angular/router';

import { ODIS0010OrderDetail } from '../../entities/odis0010.entity';

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
    private router: Router,
  ) {}

  ngOnChanges( ) {

    this.dataSource = new MatTableDataSource<ODIS0010OrderDetail>(this.resultData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // ソートした状態が前の状態に戻らない,　降順ー昇順だけ
    this.sort.disableClear = true;

  }
 
  /**　ページに移動する */
  switchToOrderInputPage(data: ODIS0010OrderDetail){

    //発注明細入力＿詳細入力画面に遷移する時、パラメータを設定する
    this.router.navigate(['OrderDetailInput'],{ queryParams: {prop: data.propertyManagerCd, cntrt: data.contractNum}});
    
  }

}

