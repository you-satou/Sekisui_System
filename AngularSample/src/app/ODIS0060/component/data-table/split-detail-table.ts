import { ODIS0060OrderShiwake } from '../../entities/odis0060-SplitDetail.entity';
import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { Const } from '../../../common/const';

@Component({
  selector: 'split-detail-table',
  styleUrls: ['../split-detail-input.component.css'],
  templateUrl: './split-detail-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class SplitOrderDetailTable {

  //仕訳データの取得
  @Input() shiwakeData: ODIS0060OrderShiwake[];
  @Input() amountDeference: number = 0;
  @Input() totalSplitAmount: number = 0;
  @Input() bunkatsuCheckBox: string = Const.OrderReceiptCheckType.UnCheck;

  //仕訳テーブルのカラム
  shiwakeColumns: string[] = [
    "juchuEdaban",
    'shiwakeCode',
    'keiriCode',
    'shiwakeName',
    'hacchuSaki',
    "chuuMon",
    'yoteiKingaku',
    'bunkatsuGoukei',
    'sagaku',
    'bulkIraiBi',
    "bulkShouninBi_Final",
  ];

  /** 仕訳テーブルのヘッダーの2行目のカラム */
  subHeaderCols: string[] = [
    'bulkRequestDate',
    'bulkApprovalDate_Final',
  ];

  /**
   * 行のカラムの定義
   */
  bodyColumns: string[] = [
    "orderBranchNo",
    "journalCode",
    "accountCode",
    "journalName",
    "orderSupplierCode",
    "orderSupplierName",
    "orderReceipt",
    'orderPlanAmount',
    'totalSplitAmount',
    'amountDifference',
    "bulkRequestDate",
    "bulkApprovalDate_Final",
    
  ];

  dataSource: any;

  //承認人数
  approvalUnit: number;

  constructor(
    private appComponent: AppComponent,
  ) {  }

  ngOnInit() {

    this.approvalUnit = this.appComponent.approvalLevels;
    switch(this.approvalUnit){
      //承認人数が1人で設定する
      case Const.ApprovalLevel.OneLevel:
        break;

      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        this.shiwakeColumns.splice(this.shiwakeColumns.indexOf('bulkIraiBi') + 1, 0, 'bulkShouninBi_1');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1');
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1');
        break;

      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        this.shiwakeColumns.splice(this.shiwakeColumns.indexOf('bulkIraiBi') + 1, 0, 'bulkShouninBi_1', 'bulkShouninBi_2');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1', 'bulkApprovalDate_2');
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1', 'bulkApprovalDate_2');
        break;

      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
      default:
        this.shiwakeColumns.splice((this.shiwakeColumns.indexOf('bulkIraiBi') + 1), 0, 'bulkShouninBi_1', 'bulkShouninBi_2', 'bulkShouninBi_3');
        this.subHeaderCols.splice((this.subHeaderCols.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1', 'bulkApprovalDate_2', 'bulkApprovalDate_3');
        this.bodyColumns.splice((this.bodyColumns.indexOf('bulkRequestDate') + 1), 0, 'bulkApprovalDate_1', 'bulkApprovalDate_3', 'bulkApprovalDate_3');
        break;
    }
  }

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

  isDetailChecked(){
    switch(this.bunkatsuCheckBox){
      case Const.OrderReceiptCheckType.UnCheck:
        return false;
      case Const.OrderReceiptCheckType.Checked:
        return true;
    }
  }
}
