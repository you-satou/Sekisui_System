import { ODIS0020OrderShiwake } from '../entities/odis0020-OrderDetailList.entity';

/**
 * 親に渡すデータの定義
 */
export class DataEmitter {

  action: string;

  private data = new ODIS0020OrderShiwake();
  
  private status = new RowStatus();

  /**
   * テーブルにクリックイベントを発生する時、対象データを渡す
   */
  constructor() { }

  /** 渡すデータを設定する,
   *  前半　仕訳データ、
   *  後半　分割データ
   */
  setEmitterData(key: ODIS0020OrderShiwake, value: ODIS0020OrderShiwake) {

    //仕訳データを設定する。
    this.data.journalCode = key.journalCode;
    this.data.journalName = key.journalName;
    this.data.accountCode = key.accountCode;
    this.data.orderSupplierCode = key.orderSupplierCode;
    this.data.orderSupplierName = key.orderSupplierName;
    this.data.orderPlanAmount = key.orderPlanAmount;

    //分割データを設定する。
    this.data.orderSplitAmount = value.orderSplitAmount;
    this.data.comment = value.comment;
    this.data.requestDate = value.requestDate;
    this.data.requester = value.requester;
    this.data.approvalDate_lv1 = value.approvalDate_lv1;
    this.data.approvalPerson_lv1 = value.approvalPerson_lv1;
    this.data.approvalDate_lv2 = value.approvalDate_lv2;
    this.data.approvalPerson_lv2 = value.approvalPerson_lv2;
    this.data.orderDate = value.orderDate;
    this.data.orderAmount = value.orderAmount;
    this.data.receivedDate = value.receivedDate;
    this.data.receivedAmount = value.receivedAmount;
    this.data.paymentDate = value.paymentDate;
    this.data.paymentAmount = value.paymentAmount;

  }
   /**
    * 明細のステータスを設定する
    * @param key 先頭データのインデックス
    * @param row 選択された明細のインデックス
    * @param totalLength 総明細数
    * @param curr 総件数に対して選択された明細の位置
    */
  setRowStatus(key: number, row: number, totalLength:number, curr: number){

    this.status.keyIndex = key;
    this.status.rowIndex = row;
    this.status.detailLength = totalLength;
    this.status.current = curr;
  }

  getRowStatus():RowStatus{

    return this.status;
  }

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

  /**総件数に対して選択された明細の位置 */
  current:number;

  /** */
  get isFirstDetail(){
    if(this.detailLength > 1 && this.current == 1){

      return true;
    }
    return false;
  }

  get isSelected(): boolean{

    if(this.keyIndex >= 0 &&
      this.rowIndex >= 0){
        return true;
    }
    return false;
  };

  constructor() {
    this.Reset();
  }

  Reset() {
    this.rowIndex = null;
    this.keyIndex = null;
    this.detailLength = 0;
    this.current = null;
  }

  setRowStatus(key: number, row: number, totalLength:number, curr: number){
    this.keyIndex = key;
    this.rowIndex = row;
    this.detailLength = totalLength;
    this.current = curr;
    
  }
}