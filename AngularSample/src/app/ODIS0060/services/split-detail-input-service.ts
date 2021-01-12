import { ODIS0060OrderShiwake, ODIS0060OrderDetailBunkatsu } from '../entities/odis0060-SplitDetail.entity';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * 発注明細入力からパラメータを受け取り専用
 */
export class ODIS0060SplitDetailService {

  private _shiwakeData: ODIS0060OrderShiwake[];

  /**
   * 詳細入力テーブルの選択された行の仕訳データの保存
   *
   * @param splitTable 仕訳テーブルのデータ
   */
  public setSplitTable(splitTable: ODIS0060OrderShiwake[]) {

    this._shiwakeData = splitTable;
  }

  /**
   * 詳細入力テーブルの選択された行の仕訳データの取得
   */
  public getSplitTableData() {
    return this._shiwakeData;
  }


  private _bunkatsuData: any;
  
  /**
   * 詳細入力テーブルの選択された行の分割データの保存
   *
   * @param splitTable 分割テーブルのデータ
   */
  public setDetailTable(detailTable: ODIS0060OrderDetailBunkatsu[]) {
    this._bunkatsuData = detailTable;
  }

  /**
   * 詳細入力テーブルの選択された行の分割データの取得
   */
  public getDetailTableData(): ODIS0060OrderDetailBunkatsu[]{
    return this._bunkatsuData;
  }

}