import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity'

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

  public action: string;

  private _rowData = new ODIS0020OrderDetaiSplitBean();
  
  private _status = new ODIS0020RowStatus();

  /**
   * テーブルにクリックイベントを発生する時、対象データを渡す
   */
  constructor() { }

  /** 
   *  渡すデータを設定する
   */
  public setEmitterData(rowDt: ODIS0020OrderDetaiSplitBean): void{
    this._rowData = rowDt;
  }
  
  /**
   * 明細のデータを取得する  
   */
  public getEmitterData(){
      return this._rowData;
  }

  /**
   * 選択されたＲｏｗの状態を設定する
   * @param rowStt 
   */
  public setRowStatus(rowStt: ODIS0020RowStatus){
    this._status = rowStt;
  }
  /**
   * 選択されたＲｏｗの状態を取得する 
   */
  public getRowStatus():ODIS0020RowStatus{
    return this._status;
  }

}

export class ODIS0020RowStatus {

  /** 明細連番 */
  detailNo: string;
  /** 分割明細連番 */
  splitNo: string;
  /** 先頭データIndex */
  rowBegin: number;
  /** 明細数 */
  dataLength: number;

  /** 明細が選択される状態を返却する */
  public get isSelected(): boolean {
    if (this.detailNo != null && this.detailNo != '' &&
      this.splitNo != '' && this.splitNo != null) {
      return true;
    }
    return false;
  };

  constructor(){
    this.Clear();
  }

  public Clear() {
    this.splitNo = null;
    this.detailNo = null;
    this.rowBegin = -1;
    this.dataLength = -1;
  }

}