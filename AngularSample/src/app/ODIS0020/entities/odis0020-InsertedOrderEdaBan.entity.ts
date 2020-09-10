/**
 * 追加工事受注枝番テーブルの定義
 */
export interface ODIS0020InsertedOrderEdaBan{

    /** 追加工事種類名 */
    contractModel: string;

    /** 受注形態 */
    orderModel: string;

    /** 枝番 1*/
    branchNum1: string;

    /** 枝番 2 */
    branchNum2: string;

    /** 契約年月日 */
    date: string;

    /** 金額 */
    contractAmount: string;

    /** 発注状況 */
    completeStatus: string;

    /** 売上状況 */
    salesStatus: string;

    /** 売上年月日 */
    salesUpdateDate: string;

}