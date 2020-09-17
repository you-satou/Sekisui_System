import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from '../entities/odis0060.entity';
import { SplitOrderDetailService } from '../services/split-detail-input-service';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { Location } from '@angular/common';
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
    'recieved',
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
    'recievedDate',
    'recievedAmount',
    'paymentDate',
    'paymentAmount',
  ];

  //テーブルを再レンダーする場合
  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

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
    private _location: Location,
    public datePipe: DatePipe,
    private service: SplitOrderDetailService,
  ) { }

  /**
   * ページがロードする時、テーブルデータを取得する
   */
  ngOnInit() {
    //仕訳テーブルのデータの取得
    this.getSplitOderDetailShiwake();
    //分割テーブルのデータの取得
    this.getSplitOrderDetailSplit()
    this.appComponent.setHeader(Const.ScreenName.S0006, Const.LinKSetting.L0006);
  }

  /**
   * 仕訳テーブルのデータの取得のメソッド
   */
  getSplitOderDetailShiwake() {
    this.shiwakeData = this.service.getSplitTable();
    this.tabName = this.shiwakeData[0].tabIndex;
  }

  /**
   * 分割テーブルのデータの取得のメソッド
   */
  getSplitOrderDetailSplit() {
    this.bunkatsuData = this.service.getDetailTable();
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
    this._location.back();
  }

  /**
   * 「明細追加」ボタンの押下
   *
   * @param $event イベント
   */
  public onSelectClick($event) {
    //編集テーブルが未入力になっていない場合
    if (this.orderPlanAmount || this.comment || this.requestDate || this.requester) {
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
        recievedDate: "",
        recievedAmount: "",
        paymentDate: "",
        paymentAmount: "",
      }
      //保存された値を分割テーブルのデータに挿入
      this.bunkatsuData.push(temp);
      //合計金額を再計算
      this.sum = this.bunkatsuData.map(data => Number(data.orderPlanAmount)).reduce((acc, value) => (acc + value));
      this.table.renderRows();
      //未入力の場合に警告メッセージを表示
    } else {
      alert("明細情報を入力して下さい。");
    }
  }

  /**
   * 仕訳テーブルの行を選択する場合
   *
   * @param $event イベント
   * @param selectedItem 行選択 値取得
   */
  public onSelHighLight($event, selectedItem) {

    //行が選択された時にselectedをtrueにする
    this.selected = true

    //選択された行に色をつける
    this.commonComponent.CommonOnSelHight($event);

    //編集テーブルの各セルに選択された行の値を挿入
    this.orderPlanAmount = selectedItem.orderPlanAmount;
    this.comment = selectedItem.comment;
    this.requestDate = selectedItem.requestDate;
    this.requester = selectedItem.requester;
    
    //選択された行のインデックスをindexに挿入
    this.index = this.bunkatsuData.indexOf(selectedItem);
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
      this.bunkatsuData[this.index].orderPlanAmount = this.orderPlanAmount
      this.bunkatsuData[this.index].comment = this.comment
      this.bunkatsuData[this.index].requestDate = this.requestDate
      this.bunkatsuData[this.index].requester = this.requester
      this.table.renderRows();
      
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
   * 「依頼」ボタンの押下
   *
   * @param $event イベント
   */
  onAddOrderClick($event) {
    this.requester = "user";
    this.requestDate = this.datePipe.transform(this.currentDate, "yyyy/MM/dd").toString();
  }
}