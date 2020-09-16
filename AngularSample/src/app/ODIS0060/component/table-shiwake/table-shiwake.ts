import { SplitOrderDetailShiwake } from '../../entities/odis0060.entity';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'split-shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class SplitOrderDetailShiwakeTable {

  //仕訳データの取得
  @Input() shiwakeData: SplitOrderDetailShiwake[];

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
