/**
 * 仕訳コードエンティティ
 */
export class SupplierList {

    /** パターン名 */
    pattern: string = '';
    /** 仕訳コード */
    journalCode: string = '';
    /** 経理分類 */
    accountingCategory: string = '';
    /** 仕訳名称 */
    journalName: string = '';
    /** 発注先コード */
    supplierCode: string = '';
    /** 発注先名 */
    supplierName: string = '';
    /** 発注年月日 */
    orderDate: string = '';
    /** 発注金額 */
    orderAmount: string = '';
    /** 発注年月日 */
    receivedDate: string = '';
    /** 受入金額 */
    receivedAmount: string = '';
    /** 受入金額 */
    paymentDate: string = '';
    /** 支払年月日 */
    paymentAmount: string = '';

    constructor(){};
}