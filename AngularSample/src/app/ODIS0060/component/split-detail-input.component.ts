import { Component, OnInit, ViewEncapsulation, ViewChild, ViewContainerRef,HostListener } from '@angular/core';
import { MatTable } from '@angular/material';
import { AppComponent } from '../../app.component';
import { Const } from '../../common/const';
import { CommonComponent } from 'app/common/common.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ODIS0060OrderDetailBunkatsu, ODIS0060OrderShiwake, ODIS0060Session } from '../entities/odis0060-SplitDetail.entity';
import { ODIS0020Service } from './../../ODIS0020/services/odis0020-service';
import { ODIS0020OrderDetaiSplitBean } from './../../ODIS0020/entities/odis0020-OrderDetailSplit.entity';
import { ODIS0060SplitDetailService } from '../services/split-detail-input-service';
import { ODIS0020BunkatsuInsertService, RowStatus } from '../services/odis0060-AddBunkatsuDetail.service';

@Component({
  selector: 'split-detail-input',
  templateUrl: './split-detail-input.component.html',
  styleUrls: ['./split-detail-input.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SplitOrderDetailComponent implements OnInit {

  /** 仕訳テーブルのヘッダーの1行目のカラム */
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

  /** 仕訳テーブルのヘッダーの2行目のカラム */
  bunkatsuColumnsName: string[] = [
    'requestDate',
    'requester',
    'approvalDate_lv1',
    'approvalPerson_lv1',
    'approvalDate_lv2',
    'approvalPerson_lv2',
  ];

  /** テーブルの全カラム */
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

  
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;
  @ViewChild('ShiwakeData', { static: true }) childShiwake: any;
  @ViewChild('BunkatsuData', { static: true }) childBunkatsu: any;

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event) {
  //   // ページ移動前の確認イベント
  //   this.toSaveShiwakeData();
  // }

  //仕訳テーブルのデータ
  shiwakeData: ODIS0060OrderShiwake[] = [];
  //分割テーブルのデータ
  bunkatsuData: ODIS0060OrderDetailBunkatsu[] = [];
  //分割明細追加サービス
  input = new ODIS0020BunkatsuInsertService();

  amountDeference: number = 0;

  rowStatus = new RowStatus()

  //タブネーム
  tabName: string = '';
  //ボタンの初期表示
  btnTsuika: boolean;
  btnHenkou: boolean;
  btnChuushi: boolean;
  btnSakujo: boolean;

  //明細追加テーブルのボタンの初期表示
  btnSubIrai: any;

  fixed:number = 500;

  //初期画面のレンダー
  isInitFlg: boolean = false;

  constructor(
    private appComponent: AppComponent,
    private baseCompnt: CommonComponent,
    private router: Router,
    private datePipe: DatePipe,
    private splitService: ODIS0060SplitDetailService,
    private odis0020Service: ODIS0020Service,
    private viewRef: ViewContainerRef,
  ) {  }

  // --------------------------------------- ▼▼ 初期表示処理 ▼▼ ---------------------------------------
  /**
   * 初期表示
   * 説明：ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {

    this.appComponent.setHeader(Const.ScreenName.S0006, Const.LinKSetting.L0000 + Const.LinKSetting.L0002);

    //セッションにデータがあるかどうか
    if(sessionStorage.getItem(Const.ScreenName.S0006EN) != null){

      let savedDt = JSON.parse(sessionStorage.getItem(Const.ScreenName.S0006EN));
      this.shiwakeData = savedDt.shiwakeData;
      this.tabName = this.getTabName(this.shiwakeData[0].detailKind);
      this.bunkatsuData = savedDt.bunkatsuData;
      // 画面をレンダーする
      this.isInitFlg = true;
      
    }
    else{
      //初期表示
      this.setDisplayData();
  　 }

    //ページボタンの初期化
    this.setPageButtonDisplay(false,true,false,true);
  }

  /**
   * テーブルをレンダー後に走るメゾッド
   */
  ngAfterViewInit(): void {
    this.btnSubIrai = document.getElementById('btnSubIrai');
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
  private setTableBunkatsuButtonDisplay(dt: ODIS0060OrderDetailBunkatsu[]) {

    //分割データがない場合、余白行を削除する
    if (this.baseCompnt.setValue(dt[0].orderSplitAmount) == '') {
      // 分割明細テーブルのBodyを取得する
      let skBody:any = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
      skBody.rows[0].remove();
      return;
    }
  }

  /**
   * 仕訳テーブルのデータの取得のメソッド
   */
  private setDisplayData() {
    this.shiwakeData = this.splitService.getSplitTableData();
    this.tabName = this.getTabName(this.shiwakeData[0].detailKind);
    this.bunkatsuData = this.splitService.getDetailTableData();

    this.saveDataToSession();

    // 初期画面をレンダーする
    this.isInitFlg = true;
  }

  /**
   * タブ名 取得
   */
/**
   * タブ名 取得
   */
  private getTabName(val: string){
    var resVal: string = '';
    switch(val){
      case Const.JutyuEdaban.TabIndex_0:
        resVal = Const.TabName.TabName_0;
        break;
      case Const.JutyuEdaban.TabIndex_1:
        resVal = Const.TabName.TabName_1;
        break;
      case Const.JutyuEdaban.TabIndex_2:
        resVal = Const.TabName.TabName_2;
        break;
      case Const.JutyuEdaban.TabIndex_3:
        resVal = Const.TabName.TabName_3;
        break;
    }
    return resVal;
  }

  // --------------------------------------- ▲▲ 初期表示処理 ▲▲ ---------------------------------------

  // --------------------------------------- ▼▼ 各ボタン 処理 ▼▼ ---------------------------------------
  /**
   * 分割明細ページの各ボタンの活用性を設定する。　
   * ボタンの初期表、「disabled」属性を「False」する
   * @param tsuika 追加ボタンの設定
   * @param henkou 変更ボタンの設定
   * @param chuushi 中止ボタンの設定
   * @param sakujo 削除ボタンの設定
   */
  setPageButtonDisplay(tsuika: boolean,henkou: boolean,chuushi: boolean,sakujo: boolean) {
    this.btnTsuika = tsuika;
    this.btnHenkou = henkou;
    this.btnChuushi = chuushi;
    this.btnSakujo = sakujo;
  }

  /**
   * 分割テーブルの合計金額の再計算
   */
  totalAmount() {
      return this.bunkatsuData.map(data => Number(data.orderSplitAmount)).reduce((acc, value) => (acc + value));
  }
  /**
   * 金額差
   */
  getAmountDeference(){
    return Number(this.shiwakeData[0].orderPlanAmount) - Number(this.totalAmount());
  }

  /**
   * 仕訳テーブルの行を選択する場合
   *
   * @param $event イベント
   * @param rowDt 選択さらた行の値
   */
  selectRow($event, rowDt: ODIS0060OrderDetailBunkatsu) {

    //選択された行に背景色を変える
    this.baseCompnt.CommonOnSelHight($event);

    let index = this.bunkatsuData.indexOf(rowDt);
    this.rowStatus.setRowStatus(true, index);
    
    //編集テーブルの各セルに選択された行の値を挿入
    this.input.setInput(rowDt);
    
    //明細追加テーブルの依頼ボタンの表示を設定
    if (rowDt.requester != '') {
      this.btnSubIrai.style.display = 'none';
    }
    else {
      this.btnSubIrai.style.display = 'inherit';
    }

    //分割明細のボタンの活用性を設定する
    this.journalDataApprovalChecker(rowDt);
  }

  /**
   * 分割明細 制限チェック
   * @param rowData 
   */
  journalDataApprovalChecker(rowData: ODIS0060OrderDetailBunkatsu){
    
    switch(true){
      //依頼未・承認未
      case (rowData.requester == '' && rowData.approvalPerson_lv1 == ''):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認未
      case (rowData.requester != '' && rowData.approvalPerson_lv1 == ''):
        this.setPageButtonDisplay(true, false, false, false);
        break;
      //依頼済・承認済
      case (rowData.requester != '' && rowData.approvalPerson_lv1 != ''):
        this.setPageButtonDisplay(true, true, false, true);
        break;
    };
  }

  /**
   * 「明細追加」ボタンの押下
   * @param $event イベント
   */
  insertBunkatsuOrderDetail($event) {
    // 入力検証
    if(!this.inputCheck()){
      return;
    }
    //入力情報 値 保存
    let insertDt = new ODIS0060OrderDetailBunkatsu();
    
    //　明細に追加する位置
    let rowIndex: number = this.bunkatsuData.length;

    // データ追加　設定
    insertDt = this.input.getInput(insertDt,Const.Action.A0001);

    //分割明細は１件もない場合
    if(rowIndex === 1 && this.baseCompnt.setValue(this.bunkatsuData[0].orderSplitAmount) === ''){
      this.bunkatsuData.splice(0, 1, insertDt);
      rowIndex = 0;
    }
    else{
      //明細に追加する位置を取得
      this.bunkatsuData.splice(rowIndex, 0, insertDt);
    }

    this.table.renderRows();

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    //明細の背景色を変える
    this.baseCompnt.setRowColor(Const.Action.A0001, tbody, rowIndex);
    this.setAutoScroll(tbody,rowIndex);

    this.setPageButtonDisplay(false, true, false, true);
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

    if(!this.input.isChanged){
      alert(Const.ErrorMsg.E0015);
      return;
    }

    let i: number = this.rowStatus.rowIndex;

    this.bunkatsuData[i] = this.input.getInput(this.bunkatsuData[i], Const.Action.A0002);

    this.table.renderRows();

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    this.baseCompnt.setRowColor(Const.Action.A0002, tbody, i);
    
    //最後にページ初期化する
    this.resetAddTable();
    this.setPageButtonDisplay(false, true, false, true);

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
    // 削除する前に一回確認する
    var confirm = window.confirm(Const.WarningMsg.W0001);
    if(!confirm){
      return;
    }
    //分割明細が一つだけの場合、中身を空白する
    if(this.bunkatsuData.length == 1){
      // 初期化
      this.bunkatsuData[0] = new ODIS0060OrderDetailBunkatsu;
    }
    else{
      //選択された行のデータを削除
      this.bunkatsuData.splice(this.rowStatus.rowIndex, 1);

      // 分割連番 再度 採番
      for(let cnt = 0; cnt < this.bunkatsuData.length; cnt++){
        this.bunkatsuData[cnt].splitNo = (cnt + 1).toString();
      }
    }

    //テーブルの再レンダー
    this.table.renderRows();
    this.setTableBunkatsuButtonDisplay(this.bunkatsuData);

    this.resetAddTable();
    this.setPageButtonDisplay(false, true, false, true);
    this.saveDataToSession();
  }

  /**
   * 編集テーブルの行をクリアする
   * @param $event イベント
   */
  stopModifyDetail($event) {

    let tbody = this.viewRef.element.nativeElement.querySelector('table.bunkatsu-table>tbody');
    //選択状態を抜ける
    this.baseCompnt.setRowColor(Const.Action.A0006, tbody, this.rowStatus.rowIndex);
    this.resetAddTable();
    this.setPageButtonDisplay(false, true, false, true);
  }

  /**
   * 分割明細テーブルに「依頼」ボタンを押下する時
   * @param event 
   * @param dt 
   */
  mainTableRequest(event: any, dt: ODIS0060OrderDetailBunkatsu,) {

    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();
    dt.requestDate = requestTime;
    //TODO: ログイン情報を取得
    dt.requester = '積水　次郎';

    //ボタンのIDを取得。
    let name = "btnIrai"+this.bunkatsuData.indexOf(dt);
    let btn = document.getElementById(name);
    // 処理後ボタンを　削除する。
    btn.style.display = 'none';
  }

  /**
   * 入力テーブルに「依頼」ボタンを押下する時。
   * @param event 
   */
  subTableRequest(event: any) {
    if(this.input.orderSplitAmount == ''){
      this.baseCompnt.setFocus('txtSplitAmount');
      alert(Const.ErrorMsg.E0012);
      return;
    }
    let currTime = Date.now();
    let requestTime = this.datePipe.transform(currTime, "yy/MM/dd").toString();

    //TODO: ログイン情報を取得 
    this.input.requestDate = requestTime;
    this.input.requester = '積水　次郎';
    //依頼ボタンを非表示する
    this.btnSubIrai.style.display = 'none';

  }
  
  /**
   * 分割明細追加テーブルを初期化する
   */
  resetAddTable() {
    this.input.Clear();
    this.rowStatus.Reset();
    this.btnSubIrai.style.display = 'inherit';
  }

  inputCheck(): boolean {
    //編集テーブルが未入力になっていない場合
    if (this.input.isBlank) {
      this.baseCompnt.setFocus('txtSplitAmount');
      alert(Const.ErrorMsg.E0010);
      return false;
    }
    //発注予定金額が未入力かどうか
    if (this.input.amountIsBlank) {
      this.baseCompnt.setFocus('txtSplitAmount');
      alert(Const.ErrorMsg.E0006);
      return false;
    }

    return true;
  }

  /**
   * 「戻る」ボタンの押下
   */
  backToOrderDetailInput() {

    this.toSaveShiwakeData();

    this.router.navigate([Const.UrlSetting.U0002]);
  }

  /**
   * 一時的なデータをセッションに保持する
   */
  private saveDataToSession(){

    let saveDt = new ODIS0060Session();
    saveDt.bunkatsuData = this.bunkatsuData;
    saveDt.shiwakeData = this.shiwakeData;

    sessionStorage.setItem(Const.ScreenName.S0006EN, JSON.stringify(saveDt));
  }

  /**
   * 遷移元に値を受け渡す
   * @param body 
   * @param row
   */
  private toSaveShiwakeData(){
    let senderDt: ODIS0020OrderDetaiSplitBean[] = [];

    //分割明細毎発注仕訳データを作成する
    for(var i=0; i < this.bunkatsuData.length; i++){
      let dt = new ODIS0020OrderDetaiSplitBean();
      dt.propertyNo         = this.shiwakeData[0].propertyNo;
      dt.detailKind         = this.shiwakeData[0].detailKind;
      dt.detailNo           = this.shiwakeData[0].detailNo
      dt.journalCode        = this.shiwakeData[0].journalCode;
      dt.accountCode        = this.shiwakeData[0].accountCode;
      dt.journalName        = this.shiwakeData[0].journalName;
      dt.orderSupplierCode  = this.shiwakeData[0].orderSupplierCode;
      dt.orderSupplierName  = this.shiwakeData[0].orderSupplierName;
      dt.orderPlanAmount    = this.shiwakeData[0].orderPlanAmount;
      dt.splitNo            = (i + 1).toString();
      dt.orderSplitAmount   = this.bunkatsuData[i].orderSplitAmount;
      dt.comment            = this.bunkatsuData[i].comment;
      dt.requestDate        = this.bunkatsuData[i].requestDate;
      dt.requester          = this.bunkatsuData[i].requester;
      dt.approvalDate_lv1   = this.bunkatsuData[i].approvalDate_lv1;
      dt.approvalPerson_lv1 = this.bunkatsuData[i].approvalPerson_lv1;
      dt.approvalDate_lv2   = this.bunkatsuData[i].approvalDate_lv2;
      dt.approvalPerson_lv2 = this.bunkatsuData[i].approvalPerson_lv2;
      dt.orderDate          = this.bunkatsuData[i].orderDate;
      dt.orderAmount        = this.bunkatsuData[i].orderAmount;
      dt.receivedDate       = this.bunkatsuData[i].receivedDate;
      dt.receivedAmount     = this.bunkatsuData[i].receivedAmount;
      dt.paymentDate        = this.bunkatsuData[i].paymentDate;
      dt.paymentAmount      = this.bunkatsuData[i].paymentAmount;

      senderDt.push(dt);
    }

    if(this.getAmountDeference() != 0){
      this.odis0020Service.isDeferenceAmount = true;
    }

    //発注明細入力画面に返却するデータを設定する。
    this.odis0020Service.setReturnSplitData(senderDt);

    //発注詳細入力画面に戻る前に、セッションを削除する
    sessionStorage.removeItem(Const.ScreenName.S0006EN);

  }
  // --------------------------------------- ▲▲ 各ボタン 処理 ▲▲ ---------------------------------------
  
  // --------------------------------------- ▼▼ フォーカス系 処理 ▼▼ ---------------------------------------
  /**
   * focus処理
   *
   * @param $event イベント
   */
  commonFocus($event){
    this.input.orderSplitAmount = this.baseCompnt.removeCommas($event.target.value);
  }
  /**
   * blur処理（カンマ）
   *
   * @param $event イベント
   */
  commonBlur($event){
    if(!($event.target.value == "")){
      this.input.orderSplitAmount = this.baseCompnt.addCommas($event.target.value);
    }
  }

  /**
   * blur処理（全角変換）
   *
   * @param $event イベント
   */
  onChangeZenkaku($event){
    this.input.comment = this.baseCompnt.onChangeZenkaku($event.target.value);
  }

  /**
   * keyUp処理(半角数字のみ)
   *
   * @param $event イベント
   */
  onlyHanNumber($event){
    this.input.orderSplitAmount = this.baseCompnt.onlyHanNumber($event.target.value);
  }

  /**
   * 追加した明細に自動スクロールする
   * @param body 
   * @param row
   */
  setAutoScroll(body: any, row: number) {
    body.rows[row].scrollIntoView({behavior: "auto", block: "center", inline: "nearest"});
  }
  // --------------------------------------- ▲▲ フォーカス系 処理 ▲▲ ---------------------------------------
}