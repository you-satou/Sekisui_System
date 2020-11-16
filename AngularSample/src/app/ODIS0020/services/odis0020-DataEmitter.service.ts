import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity'

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

  action: string;

  private data = new ODIS0020OrderDetaiSplitBean();
  
  private status = new RowStatus();

  /**
   * テーブルにクリックイベントを発生する時、対象データを渡す
   */
  constructor() { }

  /** 
   *  渡すデータを設定する
   */
  setEmitterData(key: ODIS0020OrderDetaiSplitBean) {
    //仕訳データを設定する。
    this.data.journalCode        = key.journalCode;
    this.data.journalName        = key.journalName;
    this.data.accountCode        = key.accountCode;
    this.data.orderSupplierCode  = key.orderSupplierCode;
    this.data.orderSupplierName  = key.orderSupplierName;
    this.data.orderPlanAmount    = key.orderPlanAmount;

    this.data.bulkRequestDate    = key.bulkRequestDate;
    this.data.bulkRequester      = key.bulkRequester;
    this.data.bulkApprovalDate   = key.bulkApprovalDate;
    this.data.bulkApprovalPerson = key.bulkApprovalPerson;
  }
   /**
    * 明細のステータスを設定する
    * @param key 先頭データのインデックス
    * @param row 選択された明細のインデックス
    * @param totalLength 総明細数
    * @param add 明細追加
    * @param upd 明細更新
    * @param cancel 中止
    * @param del 削除
    * 
    */
  setRowStatus(key: number, row: number, totalLength:number, upd: boolean, del: boolean, value: ODIS0020OrderDetaiSplitBean){
    this.status.keyIndex = key;
    this.status.rowIndex = row;
    this.status.detailLength = totalLength;

    //ボタン制御を設定する。
    this.status.update = upd;
    this.status.delete = del;

    this.status.rowData = value;
  }

  /* 明細ステータスを取得する */
  getRowStatus():RowStatus{

    return this.status;
  }
  /*　明細のデータを取得する  */
  getEmitterData(){
    return this.data;
  }

}

export class RowStatus {

  /**先頭データのインデックス */
  keyIndex: number;
  
  /**選択された明細のインデックス */
  rowIndex: number;

  /**総明細数 */
  detailLength: number;

  // ボタン制御

  /* 明細更新ボタン */
  update: boolean;

  /* 明細削除ボタン */
  delete: boolean;

  /**明細データ */
  rowData: ODIS0020OrderDetaiSplitBean;

　 get isSelected(): boolean{
    if(this.keyIndex >= 0 &&
      this.rowIndex >= 0 && this.rowIndex != null){
        return true;
    }
    return false;
  };

  constructor() {
    this.Clear();
  }

  Clear() {
    this.rowIndex = null;
    this.keyIndex = null;
    this.detailLength = 0;
    this.rowData = new ODIS0020OrderDetaiSplitBean();
  }

}