/**
 * 発注明細テーブルの定義
 */
export interface ODIS0010OrderDetail {

    /** 契約番号 */
    contractNum: string;
    
    /** 物件名称 */
    propertyName: string;
    
    /** 発注予定金額 */
    planOrderAmount: string;
    
    /** 承認依頼金額合計 */
    approvalRequestAmount: string;
    
    /** 発注金額合計 */
    performanceOrderAmount: string;
    
    /** 受入金額合計 */
    receivedAmount: string;
    
    /**	進捗率 */
    progressRate: string;
    
    /** 明細（あり・なし） */
    createdDetail: string;
    
    /**　承認１（済・未） */
    approval_1: string;
    
    /**  承認２（済・未）*/
    approval_2: string;

}