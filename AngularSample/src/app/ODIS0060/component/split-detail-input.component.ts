import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material';
import { AppComponent } from '../../app.component';
import { Const } from '../../common/const';
import { CommonComponent } from 'app/common/common.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake, ODIS0060Session } from '../entities/odis0060-SplitDetail.entity';
import { ODIS0020Service } from './../../ODIS0020/services/odis0020-service';
import { ODIS0020OrderShiwake } from './../../ODIS0020/entities/odis0020-OrderDetailList.entity';
import { ODIS0060SplitDetailService } from '../services/split-detail-input-service';
import { ODIS0020AddBunkatsu, RowStatus } from '../entities/odis0060-AddBunkatsuForm.entity';

@Component({
  selector: 'split-detail-input',
  templateUrl: './split-detail-input.component.html',
  styleUrls: ['./split-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SplitOrderDetailComponent implements OnInit {

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

  //仕訳テーブルのヘッダーの2行目のカラム
  bunkatsuColumnsName: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];

  //テーブルの全カラム
  totalColumns: string[] = [
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

  //仕訳テーブルのデータ
  shiwakeData: ODIS0060OrderShiwake[] = [];
  //分割テーブルのデータ
  bunkatsuData: ODIS0060OrderDetailBunkatsu[] = [];

  input = new ODIS0020AddBunkatsu();
  rowStatus = new RowStatus()

  //タブネーム
  tabName: string = '';


  constructor(
    private appComponent: AppComponent,
    private commonComponent: CommonComponent,
    private router: Router,
    private datePipe: DatePipe,
    private splitService: ODIS0060SplitDetailService,
    private odis0020Service: ODIS0020Service,
    private viewRef: ViewContainerRef,
  ) { 
    this.input.Clear();
  }

  /**
   * ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {

    if(sessionStorage.getItem(Const.ScreenName.S0006EN) != null){

      let savedDt = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0006EN));
      this.shiwakeData = savedDt.shiwakeData;
      this.tabName = this.shiwakeData[0].tabIndex;
      this.bunkatsuData = savedDt.bunkatsuData;
      
    }
    else{
      //各テーブルのデータの取得
      this.setDisplayData();
    }
    this.appComponent.setHeader(Const.ScreenName.S0006, Const.LinKSetting.L0006);
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);
  }

   /**
   * 明細テーブルに初期表の時、ボタン活動性を設定する。
   *↓↓↓　ボタン名　↓↓↓
   * 「依頼」「承認」「承認」
   * 
   * @param dt 
   * 
   */
  setTableBunkatsuButtonDisplay(dt: ODIS0060OrderDetailBunkatsu[]) {

    let skBody:HTMLTableSectionElement = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    //分割データがない場合、余白行を削除する
    if(dt.length == 1 && dt[0].isBlank){
      skBody.rows[0].remove();
      return;
    }
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

  /**
   * 仕訳テーブルのデータの取得のメソッド
   */
  setDisplayData() {
    this.shiwakeData = this.splitService.getSplitTableData();
    this.tabName = this.shiwakeData[0].tabIndex;
    this.bunkatsuData = this.splitService.getDetailTableData();

    this.saveDataToSession();
  }

  /**
   * 分割テーブルの合計金額の再計算
   */
  totalAmount() {
      return this.bunkatsuData.map(data => Number(data.orderSplitAmount)).reduce((acc, value) => (acc + value));
  }

  /**
   * 仕訳テーブルの行を選択する場合
   *
   * @param $event イベント
   * @param rowDt 選択さらた行の値
   */
  selectRow($event, rowDt: ODIS0060OrderDetailBunkatsu) {

    if ($event.target.nodeName == 'BUTTON' || $event.target.nodeName == 'SPAN') {
      return;
    }
    //選択された行に色をつける
    this.commonComponent.CommonOnSelHight($event);
    let index = this.bunkatsuData.indexOf(rowDt);
    this.rowStatus.setRowStatus(true, index);

    //編集テーブルの各セルに選択された行の値を挿入
    this.input.setInput(rowDt);

    //依頼ボタンの初期表示を設定する
    this.setInputTableButton(rowDt);
  }

  /**
   * 入力分割明細テーブルにて、依頼ボタンを表示させるかどうか設定する。
   * @param selectedItem 
   */
  setInputTableButton(selectedItem: ODIS0060OrderDetailBunkatsu) {
    let tr: HTMLTableRowElement = this.viewRef.element.nativeElement.querySelector('table.tsuika-table>tbody>tr');

    let btn = tr.cells[3].getElementsByTagName('button');
    if (selectedItem.requester != '') {
      btn[0].style.display = 'none';
    }
    else {
      btn[0].style.display = 'inherit';
    }
  }

  /**
   * 「明細追加」ボタンの押下
   *
   * @param $event イベント
   */
  insertBunkatsuOrderDetail($event) {
    //明細更新を作業する時、追加ボタンを押下する場合
    if(this.rowStatus.rowIndex >= 0 &&
       this.rowStatus.rowIndex != null){
      var confirm = window.confirm(Const.WarningMsg.W0001);
      if(!confirm){
        return;
      }
      // OKを押したら行の背景色を削除する。
      let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
      this.setNewRowHighLight(Const.Action.T0003, tbody, this.rowStatus.rowIndex);
    }
    // 入力検証
    if(!this.inputCheck()){
      return;
    }
    //入力された情報を値に保存
    let temp = new ODIS0060OrderDetailBunkatsu();
    temp = this.input.getInput(temp);

    if(this.bunkatsuData.length == 1 && this.bunkatsuData[0].isBlank){
      this.bunkatsuData.splice(0, 1, temp);
      this.rowStatus.rowIndex = 0;
    }
    else{
      this.rowStatus.rowIndex = this.bunkatsuData.length;
      this.bunkatsuData.splice(this.rowStatus.rowIndex, 0, temp);
    }


    this.table.renderRows();
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    
    this.setNewRowHighLight(Const.Action.A0001, tbody, this.rowStatus.rowIndex);
    this.resetAddTable();
    this.saveDataToSession();
  }

  /**
   * 分割明細を更新する
   *
   * @param $event イベント
   */
  updateBunkatsuOrderDetail($event) {

    //行が選択された場合
    if (!this.rowStatus.isSelected) {
      alert(Const.ErrorMsg.E0013);
      return;
    }
    // 入力検証
    if(!this.inputCheck()){
      return;
    }

    let i: number = this.rowStatus.rowIndex;

    this.bunkatsuData[i] = this.input.getInput(this.bunkatsuData[i]);

    this.table.renderRows();

    //選択された行に編集テーブルの値を挿入
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    this.setNewRowHighLight(Const.Action.A0002, tbody, i);
    this.setHighlight(i);
    
    //最後にページ初期化する
    this.resetAddTable();

    this.saveDataToSession();
  }

  /**
   * 「明細削除」ボタンの押下
   *
   * @param $event イベント
   */
  deleteOrderDetail($event) {

    //行が選択された場合
    if (!this.rowStatus.isSelected) {
      alert(Const.ErrorMsg.E0008);
      return;

    }
    if(this.bunkatsuData.length == 1){
      this.bunkatsuData[0].orderSplitAmount = '';
      this.bunkatsuData[0].comment = '';
      this.bunkatsuData[0].requestDate = '';
      this.bunkatsuData[0].requester = '';
      this.bunkatsuData[0].approvalDate_lv1 = '';
      this.bunkatsuData[0].approvalPerson_lv1 = '';
      this.bunkatsuData[0].approvalDate_lv2 = '';
      this.bunkatsuData[0].approvalPerson_lv2 = '';
      this.bunkatsuData[0].orderDate = '';
      this.bunkatsuData[0].orderAmount = '';
      this.bunkatsuData[0].receivedDate = '';
      this.bunkatsuData[0].receivedAmount = '';
      this.bunkatsuData[0].paymentDate = '';
      this.bunkatsuData[0].paymentAmount = '';

      console.log(this.bunkatsuData);
      this.setTableBunkatsuButtonDisplay(this.bunkatsuData);
    }
    else{
      //選択された行のデータを削除
      this.bunkatsuData.splice(this.rowStatus.rowIndex, 1);
    }
    //テーブルの再レンダー
    this.table.renderRows();

    this.resetAddTable();
    this.saveDataToSession();
  }

  /**
   * 編集テーブルの行をクリアする
   *
   * @param $event イベント
   */
  stopModifyDetail($event) {

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    this.setNewRowHighLight(Const.Action.T0003, tbody, this.rowStatus.rowIndex);
    this.resetAddTable();
  }

  /**
   * 分割明細テーブルに「依頼」ボタンを押下する時
   * @param event 
   * @param dt 
   */
  mainTableRequest(event: any, dt: ODIS0060OrderDetailBunkatsu,) {
    let rowIndex = this.bunkatsuData.indexOf(dt);

    this.setHighlight(rowIndex);

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

    // 処理後ボタンを　削除する。
    btn.remove();

  }

  /**
   * 入力テーブルに「依頼」ボタンを押下する時。
   * @param event 
   */
  subTableRequest(event: any) {

    if(this.input.orderSplitAmount == ''){
      this.setFocus();
      alert(Const.ErrorMsg.E0012);
      return;
    }
    let btn: HTMLButtonElement = null;
    if (event.target.nodeName === 'SPAN') {
      btn = event.target.parentElement;
    }
    else {
      btn = event.target;
    }

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    this.input.requestDate = requestTime;
    this.input.requester = '積水　次郎';

    btn.style.display = 'none';
  }

  
  /**
   * 分割明細追加テーブルを初期化する
   */
  resetAddTable() {

    this.input.Clear();
    this.rowStatus.Reset();
    let tr: HTMLTableRowElement = this.viewRef.element.nativeElement.querySelector('table.tsuika-table>tbody>tr');
    let btn = tr.cells[3].getElementsByTagName('button');
    btn[0].style.display = 'inherit';

  }

  inputCheck(): boolean {
    //編集テーブルが未入力になっていない場合
    if (this.input.isBlank) {
      this.setFocus();
      alert(Const.ErrorMsg.E0010);
      return false;
    }
    //発注予定金額が未入力かどうか
    if (this.input.amountIsBlank) {
      this.setFocus();
      alert(Const.ErrorMsg.E0006);
      return false;
    }

    return true;
  }

  setFocus(){
    let input: HTMLInputElement = this.viewRef.element.nativeElement.querySelector('input[id = splitAmount]');
    input.focus();
  }

  
  /**
   * 依頼ボタンを押下する時行の背景色を変える。
   * @param event
   */
  setHighlight(rowIndex: number) {
    var wTbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
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
      return;
    }

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

  saveDataToSession(){

    let saveDt = new ODIS0060Session();
    saveDt.bunkatsuData = this.bunkatsuData;
    saveDt.shiwakeData = this.shiwakeData;

    sessionStorage.setItem(Const.ScreenName.S0006EN, JSON.stringify(saveDt));
  }

  /**
   * 「戻る」ボタンの押下
   *
   * @param $event イベント
   */
  backToOrderDetailInput($event) {

    let shiwakeData: ODIS0060OrderShiwake[] = this.childShiwake.shiwakeData;
    let bunkatsu: ODIS0060OrderDetailBunkatsu[] = this.bunkatsuData;

    let senderDt: ODIS0020OrderShiwake[] = [];

    bunkatsu.forEach(element => {
      let dt = new ODIS0020OrderShiwake();
      if (bunkatsu.indexOf(element) == 0) {
        dt.id = shiwakeData[0].journalCode;
        dt.tabIndex = this.tabName;
        dt.journalCode = shiwakeData[0].journalCode;
        dt.accountCode = shiwakeData[0].accountCode;
        dt.journalName = shiwakeData[0].journalName;
        dt.orderSupplierCode = shiwakeData[0].orderSupplierCode;
        dt.orderSupplierName = shiwakeData[0].orderSupplierName;
        dt.orderPlanAmount = shiwakeData[0].orderPlanAmount;
        dt.orderSplitAmount = element.orderSplitAmount;
        dt.comment = element.comment;
        dt.requestDate = element.requestDate;
        dt.requester = element.requester;
        dt.approvalDate_lv1 = element.approvalDate_lv1;
        dt.approvalPerson_lv1 = element.approvalPerson_lv1;
        dt.approvalDate_lv2 = element.approvalDate_lv2;
        dt.approvalPerson_lv2 = element.approvalPerson_lv2;
        dt.orderDate = element.orderDate;
        dt.orderAmount = element.orderAmount;
        dt.receivedDate = element.receivedDate;
        dt.receivedAmount = element.receivedAmount;
        dt.paymentDate = element.paymentDate;
        dt.paymentAmount = element.paymentAmount;
      }
      else {
        dt.id = shiwakeData[0].journalCode;
        dt.tabIndex = this.tabName;
        dt.journalCode = '';
        dt.accountCode = '';
        dt.journalName = '';
        dt.orderSupplierCode = '';
        dt.orderSupplierName = '';
        dt.orderPlanAmount = '';
        dt.orderSplitAmount = element.orderSplitAmount;
        dt.comment = element.comment;
        dt.requestDate = element.requestDate;
        dt.requester = element.requester;
        dt.approvalDate_lv1 = element.approvalDate_lv1;
        dt.approvalPerson_lv1 = element.approvalPerson_lv1;
        dt.approvalDate_lv2 = element.approvalDate_lv2;
        dt.approvalPerson_lv2 = element.approvalPerson_lv2;
        dt.orderDate = element.orderDate;
        dt.orderAmount = element.orderAmount;
        dt.receivedDate = element.receivedDate;
        dt.receivedAmount = element.receivedAmount;
        dt.paymentDate = element.paymentDate;
        dt.paymentAmount = element.paymentAmount;
      }
      senderDt.push(dt);

    });

    this.odis0020Service.setTableData(senderDt);

    //発注詳細入力画面に戻る時、セックションを削除する
    sessionStorage.removeItem(Const.ScreenName.S0006EN);

    this.router.navigate([Const.UrlSetting.U0002]);

  }

  /**
   * focus処理
   *
   * @param $event イベント
   */
  commonFocus($event){
    $event.target.value = this.commonComponent.removeCommas($event.target.value);
  }
  /**
   * blur処理
   *
   * @param $event イベント
   */
  commonBlur($event){
    $event.target.value = this.commonComponent.addCommas($event.target.value);
  }
}