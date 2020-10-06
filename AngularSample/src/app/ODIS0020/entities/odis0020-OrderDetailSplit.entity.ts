/**
 * 発注明細 明細分割
 */
export class ODIS0020OrderDetaiSplitBean{
  /** 物件管理Ｎｏ */
  propertyNo: string;

  /** 明細種類 */
  detailKind: string;

  /** 明細連番 */
  detailNo: string;

  /** 分割連番 */
  splitNo: string;

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
}