import { SplitOrderDetailShiwake, SplitOrderDetailSplit } from '../entities/odis0060.entity';
import { Injectable } from '@angular/core';

@Injectable()
/**
 * 発注明細入力からパラメータを受け取り専用
 */
export class SplitOrderDetailService {

  //詳細入力テーブルの選択された行の仕訳データ
  private _splitTable;

  //詳細入力テーブルの選択された行の仕訳データの取得
  public getSplitTable() {
    return this._splitTable;
  }

  //詳細入力テーブルの選択された行の仕訳データの保存
  public setSplitTable(splitTable: SplitOrderDetailShiwake[]) {
    this._splitTable = splitTable;
  }

  //詳細入力テーブルの選択された行の分割データ
  private _detailTable;

  /** 詳細入力テーブルの選択された行の分割データの取得 */
  public getDetailTable() {
    return this._detailTable;
  }

  //詳細入力テーブルの選択された行の分割データの保存
  public setDetailTable(detailTable: SplitOrderDetailSplit[]) {
    this._detailTable = detailTable;
  }
}