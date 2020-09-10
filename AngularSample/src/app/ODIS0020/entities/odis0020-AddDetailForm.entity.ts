/**
 * 発注明細に追加するの定義
 */
export interface ODIS0020AddOrderDetail {

    /** 仕訳コード */
    journalCode: string;

    /** 経理分類 */
    accountCode: string;

    /** 仕訳名称 */
    journalName: string;

    /** 発注先 コード */
    orderSuplierCode: string;

    /** 発注先名 */
    orderSuplierName: string;

    /** 発注予定金額 */
    orderPlanAmount: string;

}