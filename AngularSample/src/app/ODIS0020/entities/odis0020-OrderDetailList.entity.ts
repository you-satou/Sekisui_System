/**
 * 発注明細テーブルの定義
 */
export interface ODIS0020OrderDetailList {
  /** 仕訳コード */
  journalCode: string;

  /** 経理分類 */
  accountCode: string;

  /** 仕訳名称 */
  journalName: string;

  /** 発注先 コード */
  orderSupplierCode: string;

  /** 発注先名 */
  orderSupplierName: string;

  /** 発注予定金額 */
  orderPlanAmount: string;

  /** 分割明細データ */
  bunkatsuData: ODIS0020OrderBunkatsuSub[]
}

/**
 * 分割明細テーブルの定義
 */
export interface ODIS0020OrderBunkatsuSub {
  /** コメント */
  comment: string;

  /** 発注予定分割金額 */
  orderSplitAmount: string;

  /** 依頼日 */
  requestDate: string;

  /** 依頼者 */
  requester: string;

  /** 承認日 一回目 */
  approvalDate_lv1: string;

  /** 承認者 一回目 */
  approvalPerson_lv1: string;

  /** 承認日 ニ回目 */
  approvalDate_lv2: string;

  /** 承認者 ニ回目*/
  approvalPerson_lv2: string;

  /** 発注年月日 */
  orderDate: string;

  /** 発注金額 */
  orderAmount: string;

  /** 受入年月日 */
  receivedDate: string;

  /** 受入金額 */
  receivedAmount: string;

  /** 支払年月日 */
  paymentDate: string;

  /** 支払金額 */
  paymentAmount: string;
}

/**
 * 仕訳データの定義
 */
export class ODIS0020OrderShiwake {

  tabIndex: string;

  id: string;

  /** 仕訳コード */
  journalCode: string;

  /** 経理分類 */
  accountCode: string;

  /** 仕訳名称 */
  journalName: string;

  /** 発注先 コード */
  orderSupplierCode: string;

  /** 発注先名 */
  orderSupplierName: string;

  /** 発注予定金額 */
  orderPlanAmount: string;

  /** コメント */
  comment: string;

  /** 発注予定分割金額 */
  orderSplitAmount: string;

  /** 依頼日 */
  requestDate: string;

  /** 依頼者 */
  requester: string;

  /** 承認日 一回目 */
  approvalDate_lv1: string;

  /** 承認者 一回目 */
  approvalPerson_lv1: string;

  /** 承認日 ニ回目 */
  approvalDate_lv2: string;

  /** 承認者 ニ回目*/
  approvalPerson_lv2: string;

  /** 発注年月日 */
  orderDate: string;

  /** 発注金額 */
  orderAmount: string;

  /** 受入年月日 */
  receivedDate: string;

  /** 受入金額 */
  receivedAmount: string;

  /** 支払年月日 */
  paymentDate: string;

  /** 支払金額 */
  paymentAmount: string;

  get isBlankDetail(){
    if (this.comment == '' &&
      this.orderSplitAmount == '' &&
      this.requestDate == '' &&
      this.requester == '' &&
      this.approvalDate_lv1 == '' &&
      this.approvalPerson_lv1 == '' &&
      this.approvalDate_lv2 == '' &&
      this.approvalPerson_lv2 == '' &&
      this.orderDate == '' &&
      this.orderAmount == '' &&
      this.receivedDate == '' &&
      this.receivedAmount == '' &&
      this.paymentDate == '' &&
      this.paymentAmount == '') 
      {
      return true;
    }
    return false;
  }


  constructor() {}

}
