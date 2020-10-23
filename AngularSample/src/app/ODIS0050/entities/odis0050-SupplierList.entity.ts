import {SupplierPatternList } from './odis0050-SuppierPattern.entity'
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

    constructor(){};
}