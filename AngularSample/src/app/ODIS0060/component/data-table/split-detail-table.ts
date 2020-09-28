import { ODIS0060OrderShiwake } from '../../entities/odis0060-SplitDetail.entity';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';

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
  @Input() amountDeference: number = 0;
  @Input() totalSplitAmount: number = 0;

  //仕訳テーブルのカラム
  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
    'totalSplitAmount',
    'amountDifference',
  ];

  dataSource: any;

  ngAfterViewChecked(): void {
    // 差額がある場合、発注予定金額のテキスト色を変える
    if(this.amountDeference != 0){
      this.changeAmountColor('red');
    }
    else{
      this.changeAmountColor('black');
    }
    
  }

  changeAmountColor(color: string){
    var amount = document.getElementById('orderAmount');
    amount.style.color = color;
  }

}
