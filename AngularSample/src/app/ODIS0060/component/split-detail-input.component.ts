import { MatTableDataSource } from '@angular/material/table';
import { ODIS0020Service } from './../../ODIS0020/services/odis0020-service';
import { ODIS0020OrderDetailList, ODIS0020OrderShiwake } from './../../ODIS0020/entities/odis0020-OrderDetailList.entity';
import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from '../entities/odis0060.entity';
import { SplitOrderDetailService } from '../services/split-detail-input-service';
import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material';
import { AppComponent } from '../../app.component';
import { Const } from '../../common/const';
import { CommonComponent } from 'app/common/common.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'order-detail-input',
  templateUrl: './split-detail-input.component.html',
  styleUrls: ['./split-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SplitOrderDetailInputComponent implements OnInit {

  //仕訳テーブルのヘッダーの2行目のカラム
  bunkatsuColumnsName: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];

  //仕訳テーブルのヘッダーの1行目のカラム
  headerColspan: string[] = [
    'no',
    'orderPlanAmount',
    'comment',
    'irai',
    'shounin_1',
    'shounin_2',
    'order',
    'received',
    'payment',
  ]

  //テーブルの全カラム
  rows: string[] = [
    'index',
    'orderPlanAmount1',
    'comment1',
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
    'orderDate',
    'orderAmount',
    'receivedDate',
    'receivedAmount',
    'paymentDate',
    'paymentAmount',
  ];

  //テーブルを再レンダーする場合
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  @ViewChild('ShiwakeData', { static: true }) childShiwake: any;
  @ViewChild('BunkatsuData', { static: true }) childBunkatsu: any;

  dataSource: any;

  //合計金額
  sum: number = 0;

  //仕訳テーブルのデータ
  shiwakeData: SplitOrderDetailShiwake[] = [];

  //分割テーブルのデータ
  bunkatsuData: SplitOrderDetailSplit[] = [];

  //編集テーブルの値
  orderPlanAmount: string = "";
  comment: string = "";
  requestDate: string = "";
  requester: string = "";

  //仕訳テーブルの選択行
  selected: boolean = false;

  //選択した行のインデックス
  index: number;

  //現在日付
  currentDate = Date.now();
  //タブネーム
  tabName: string;
  /**
   * コンストラクタ
   *
   * @param {service} service
   * @memberof SplitOrderDetailService
   */
  constructor(
    private appComponent: AppComponent,
    private commonComponent: CommonComponent,
    private router: Router,
    private datePipe: DatePipe,
    private service: SplitOrderDetailService,
    private odis0020Service: ODIS0020Service,
    private viewRef: ViewContainerRef,
  ) { }

  /**
   * ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {
    //各テーブルのデータの取得
    this.setDisplayData();
    this.appComponent.setHeader(Const.ScreenName.S0006, Const.LinKSetting.L0006);
  }

  /**
   * 仕訳テーブルのデータの取得のメソッド
   */
  setDisplayData() {
    this.shiwakeData = this.service.getSplitTable();
    this.bunkatsuData = this.service.getDetailTable();
    this.tabName = this.shiwakeData[0].tabIndex;
  }

  /**
   * 分割テーブルの合計金額の再計算
   */
  totalAmount() {
    return this.bunkatsuData.map(data => Number(data.orderPlanAmount)).reduce((acc, value) => (acc + value));
  }

  /**
   * 「戻る」ボタンの押下
   *
   * @param $event イベント
   */
  public onBackClick($event) {

    let shiwakeData: SplitOrderDetailShiwake[] = this.childShiwake.shiwakeData;
    let bunkatsu: SplitOrderDetailSplit[] = this.bunkatsuData;

    let senderDt: ODIS0020OrderShiwake[] = [];

    bunkatsu.forEach(element => {
      let dt = new ODIS0020OrderShiwake();
      if(bunkatsu.indexOf(element) == 0){
        dt.id = shiwakeData[0].journalCode;
        dt.tabIndex = this.tabName;
        dt.journalCode = shiwakeData[0].journalCode;
        dt.accountCode = shiwakeData[0].accountCode;
        dt.journalName = shiwakeData[0].journalName;
        dt.orderSupplierCode = shiwakeData[0].orderSupplierCode;
        dt.orderSupplierName = shiwakeData[0].orderSupplierName;
        dt.orderPlanAmount = shiwakeData[0].orderPlanAmount;
        dt.orderSplitAmount= element.orderPlanAmount;
        dt.comment= element.comment;
        dt.requestDate= element.requestDate;
        dt.requester= element.requester;
        dt.approvalDate_lv1= element.approvalDate_lv1;
        dt.approvalPerson_lv1= element.approvalPerson_lv1;
        dt.approvalDate_lv2= element.approvalDate_lv2;
        dt.approvalPerson_lv2= element.approvalPerson_lv2;
        dt.orderDate= element.orderDate;
        dt.orderAmount= element.orderAmount;
        dt.receivedDate= element.receivedDate;
        dt.receivedAmount= element.receivedAmount;
        dt.paymentDate= element.paymentDate;
        dt.paymentAmount= element.paymentAmount;
      }
      else{
        dt.id =  shiwakeData[0].journalCode;
        dt.tabIndex = this.tabName;
        dt.journalCode = '';
        dt.accountCode = '';
        dt.journalName = '';
        dt.orderSupplierCode = '';
        dt.orderSupplierName = '';
        dt.orderPlanAmount = '';
        dt.orderSplitAmount= element.orderPlanAmount;
        dt.comment= element.comment;
        dt.requestDate= element.requestDate;
        dt.requester= element.requester;
        dt.approvalDate_lv1= element.approvalDate_lv1;
        dt.approvalPerson_lv1= element.approvalPerson_lv1;
        dt.approvalDate_lv2= element.approvalDate_lv2;
        dt.approvalPerson_lv2= element.approvalPerson_lv2;
        dt.orderDate= element.orderDate;
        dt.orderAmount= element.orderAmount;
        dt.receivedDate= element.receivedDate;
        dt.receivedAmount= element.receivedAmount;
        dt.paymentDate= element.paymentDate;
        dt.paymentAmount= element.paymentAmount;
      }
      senderDt.push(dt);
      
    });

    this.odis0020Service.setTableData(senderDt);
    this.router.navigate([Const.UrlSetting.U0002]);
  }

  /**
   * 「明細追加」ボタンの押下
   *
   * @param $event イベント
   */
  public onSelectClick($event) {
    //編集テーブルが未入力になっていない場合
    if (this.orderPlanAmount != '' || 
    this.comment != '' || 
    this.requestDate != '' || 
    this.requester != '') {
      //入力された情報を値に保存
      var temp: SplitOrderDetailSplit = {
        orderPlanAmount: this.orderPlanAmount,
        comment: this.comment,
        requestDate: this.requestDate,
        requester: this.requester,
        approvalDate_lv1: "",
        approvalPerson_lv1: "",
        approvalDate_lv2: "",
        approvalPerson_lv2: "",
        orderDate: "",
        orderAmount: "",
        receivedDate: "",
        receivedAmount: "",
        paymentDate: "",
        paymentAmount: "",
      
      }
      this.index = this.bunkatsuData.length;

      //保存された値を分割テーブルのデータに挿入
      this.bunkatsuData.push(temp);
      this.table.renderRows();
      this.setTableButtonDisplay(this.bunkatsuData);
      
      let tbody = this.viewRef.element.nativeElement.querySelector('table.split-table>tbody');
      this.setNewRowHighLight(Const.Action.A0001,tbody,this.index);

      this.resetAddTable();

    } else {
      alert("明細情報を入力して下さい。");
    }
  }

  resetAddTable(){
    this.orderPlanAmount = '';
    this.comment = '';
    this.requestDate ='';
    this.requester = '';
    let tr: HTMLTableRowElement = this.viewRef.element.nativeElement.querySelector('table.add-table>tbody>tr');
    let btn = tr.cells[3].getElementsByTagName('button');
    btn[0].style.display = 'inherit';
    
  }

  /**
   * 仕訳テーブルの行を選択する場合
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem: SplitOrderDetailSplit) {
    
    if($event.target.nodeName == 'BUTTON' || $event.target.nodeName =='SPAN'){
      return;
    }
    //選択された行に色をつける
    this.commonComponent.CommonOnSelHight($event);
    //行が選択された時にselectedをtrueにする
    this.selected = true;
    //選択された行のインデックスをindexに挿入
    this.index = this.bunkatsuData.indexOf(selectedItem);

    //編集テーブルの各セルに選択された行の値を挿入
    this.orderPlanAmount = selectedItem.orderPlanAmount;
    this.comment = selectedItem.comment;
    this.requestDate = selectedItem.requestDate;
    this.requester = selectedItem.requester;
    
    this.setDisplayButton(selectedItem);

  }

  setDisplayButton(selectedItem: SplitOrderDetailSplit){
    let tr: HTMLTableRowElement = this.viewRef.element.nativeElement.querySelector('table.add-table>tbody>tr');

    let btn = tr.cells[3].getElementsByTagName('button');
    if(selectedItem.requester != ''){
      btn[0].style.display = 'none';
    }
    else{
      btn[0].style.display = 'inherit';
    }
  }

  /**
   * 「明細更新」ボタンの押下
   *
   * @param $event イベント
   */
  onUpdateClick($event) {

    //行が選択された場合
    if (this.selected) {

      //選択された行に編集テーブルの値を挿入
      this.bunkatsuData[this.index].orderPlanAmount = this.orderPlanAmount;
      this.bunkatsuData[this.index].comment = this.comment;
      this.bunkatsuData[this.index].requestDate = this.requestDate;
      this.bunkatsuData[this.index].requester = this.requester;

      this.setTableButtonDisplay(this.bunkatsuData);

      let tbody = this.viewRef.element.nativeElement.querySelector('table.split-table>tbody');
      this.setNewRowHighLight(Const.Action.A0002,tbody,this.index);

      this.table.renderRows();
      this.resetAddTable();
      
    //行が選択されていない場合警告メッセージを表示
    } else {
      alert(Const.ErrorMsg.E0008);
    }
  }

  /**
   * 「明細削除」ボタンの押下
   *
   * @param $event イベント
   */
  onDeleteClick($event) {

    //行が選択された場合
    if (this.selected) {
      if (this.index > -1) {
        //選択された行のデータを削除
        this.bunkatsuData.splice(this.index, 1);
      }

      //selectedをfalseにする
      this.selected = false;
      
      //テーブルの再レンダー
      this.table.renderRows();

    //行が選択されていない場合警告メッセージを表示
    } else {
      alert(Const.ErrorMsg.E0008);
    }
  }

  /**
   * 編集テーブルの行をクリアする
   *
   * @param $event イベント
   */
  onClearClick($event) {
    this.selected = false;
    this.orderPlanAmount = "";
    this.comment = "";
    this.requestDate = "";
    this.requester = "";
  }
  
  /**
   * 依頼ボタンを実行する
   * @param event 
   * @param dt 
   */
  setRequest(event: any, dt: SplitOrderDetailSplit) {
    let rowIndex = this.bunkatsuData.indexOf(dt);

    this.setRowHighlight(rowIndex);

    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }
    
    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;

    //TODO: ログイン情報を取得
    dt.requester = '積水　次郎';

    // 承認一回目のボタンを活動化する.
    let tr = btn.parentElement.parentElement;

    //承認１ボタンのインデックスは「4」
    let btnShounin = tr.children[4].getElementsByTagName('button');
    btnShounin[0].style.display = 'inherit';
    btnShounin[0].removeAttribute('disabled');

    // 処理後ボタンを　削除する。
    btn.remove();

    // ↓↓↓↓↓検討中↓↓↓↓↓↓
    // btn.setAttribute('disabled','disabled');
    // btn.style.display = 'none';
  }

  setAddRequest(event: any, requester) {
    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    this.requestDate = requestTime;

    //TODO: ログイン情報を取得
    this.requester = '積水　次郎';

    btn.style.display = 'none';
  }

  /**
   * 依頼ボタンを押下する時行の背景色を変える。
   * @param event
   */
  setRowHighlight(rowIndex: number) {
    var wTbody = this.viewRef.element.nativeElement.querySelector('table.split-table>tbody');
    for (var i = 0; i < wTbody.rows.length; i++) {

      if (i === rowIndex) {
        var wTr = wTbody.rows[i];
        for (var j = 0; j < wTr.cells.length; j++) {
          var wTd = wTr.cells[j];
          wTd.style.backgroundColor = Const.HighLightColour.Selected;
        }
      }
      else {
        var wTr = wTbody.rows[i];
        for (var j = 0; j < wTr.cells.length; j++) {
          var wTd = wTr.cells[j];
          wTd.style.backgroundColor = Const.HighLightColour.None;
        }
      }
    }
  }

    /**
 * 行の背景色 変更する
 * @param body 
 * @param newIndex 
 */
setNewRowHighLight(action: string, body: any, newIndex: number) {

  if (!action.match(Const.Action.T0003)) {
    for (var rIndex = 0; rIndex < body.rows.length; rIndex++) {
      if (rIndex == newIndex) {
        var tr = body.rows[rIndex];
        for (var cIndex = 0; cIndex < tr.cells.length; cIndex++) {
          var td = tr.cells[cIndex];
          td.style.color = this.getColor(action);
        }
      }
    }
  }
  else {
    for (var rIndex = 0; rIndex < body.rows.length; rIndex++) {
      if (rIndex == newIndex) {
        var tr = body.rows[rIndex];
        for (var cIndex = 0; cIndex < tr.cells.length; cIndex++) {
          var td = tr.cells[cIndex];
          td.style.backgroundColor = this.getColor(action);
        }
      }
    }
  }
  // this.rowStatus.Reset();
}

getColor(action: string): string {

  switch (action) {
    case Const.Action.A0001:
      return Const.HighLightColour.Inserted;
    case Const.Action.A0002:
      return Const.HighLightColour.Modified;
    case Const.Action.T0003:
      return Const.HighLightColour.None;
  }

}

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.setTableButtonDisplay(this.bunkatsuData);
  }
  /**
   * 明細テーブルに初期表の時、ボタン活動性を設定する。
   *↓↓↓　ボタン名　↓↓↓
   * 「依頼」「承認」「承認」
   * 
   * @param dt 
   * 
   */
  setTableButtonDisplay(dt: SplitOrderDetailSplit[]) {

    let skBody = this.viewRef.element.nativeElement.querySelector('table.split-table>tbody');

    let tr: HTMLTableRowElement;
    let btn: any;
    dt.forEach(element => {
      let ind = dt.indexOf(element);
      if (element.requester != '') {
        tr = skBody.rows[ind];
        btn = tr.cells[4].getElementsByTagName('button');
        btn[0].setAttribute('disabled', 'disabled');
        btn[0].style.display = 'none';

      }
    });
  }
}