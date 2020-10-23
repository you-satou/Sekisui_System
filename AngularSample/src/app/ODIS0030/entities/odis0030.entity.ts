/**
 * 発注仕訳マスタ選択エンティティ
 */
export class OrderJournalSelectType {

    /** 仕訳コード */
    journalCode: string = '';

    /** 経理分類 */
    accountingCategory: string = '';

    /** 仕訳名称 */
    orderJournalName: string = '';

     /** 其他 */
    other: string = '';
    
    constructor(){};
}