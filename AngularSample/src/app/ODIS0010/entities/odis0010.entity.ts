/**
 * 発注明細入力_承認処理テーブルの定義
 */
export class ODIS0010OrderDetail {
    /** 物件管理番号 */
    propertyNo: string;

    /** 得意先番号 */
    customerNum: string;

    /** 契約番号 */
    contractNum: string;
    
    /** 物件名称漢字 */
    propertyName: string;

    /** 事業コード */
    officeCode: string;
    
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

    /**　承認３（済・未） */
    approval_3: string;
    
    /**  最終承認（済・未）*/
    approval_last: string;
}