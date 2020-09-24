import { ODIS0060OrderShiwake } from '../../entities/odis0060-SplitDetail.entity';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'split-detail-table',
  // styleUrls: ['split-detail-table.css'],
  styleUrls: ['../split-detail-input.component.css'],
  templateUrl: './split-detail-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class SplitOrderDetailTable {

  //仕訳データの取得
  @Input() shiwakeData: ODIS0060OrderShiwake[];

  //仕訳テーブルのカラム
  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
  ];

  dataSource: any;
}
