import { ODIS0060OrderShiwake, ODIS0060OrderDetailBunkatsu } from '../entities/odis0060-SplitDetail.entity';
import { Injectable } from '@angular/core';

@Injectable()
/**
 * 発注明細入力からパラメータを受け取り専用
 */
export class ODIS0060SplitDetailService {

  //詳細入力テーブルの選択された行の仕訳データ
  private _splitTable: ODIS0060OrderShiwake[] = [];

  /**
   * 詳細入力テーブルの選択された行の仕訳データの取得
   */
  public getSplitTableData() {
    return this._splitTable;
  }

  /**
   * 詳細入力テーブルの選択された行の仕訳データの保存
   *
   * @param splitTable 仕訳テーブルのデータ
   */
  public setSplitTable(splitTable: ODIS0060OrderShiwake[]) {
    this._splitTable = splitTable;
  }

  //詳細入力テーブルの選択された行の分割データ
  private _detailTable: ODIS0060OrderDetailBunkatsu[] = [];

  /**
   * 詳細入力テーブルの選択された行の分割データの取得
   */
  getDetailTableData(): ODIS0060OrderDetailBunkatsu[]{
    return this._detailTable;
  }

  /**
   * 詳細入力テーブルの選択された行の分割データの保存
   *
   * @param splitTable 分割テーブルのデータ
   */
  setDetailTable(detailTable: ODIS0060OrderDetailBunkatsu[]) {
    this._detailTable = detailTable;
  }
}