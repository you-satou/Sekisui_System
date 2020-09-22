/**
 * 発注明細入力_承認処理フォームの定義
 */
export class ODIS0010Form{
    /** 事業区分コード */
    officeCode: string;

	/** 契約番号From */
	contractNumFrom: string;

	/** 契約番号To */
	contractNumTo: string;

	/** 物件名 */
	propertyName: string;

	/** 物件名（ラジオボタン）
	 * 1:で始まる
	 * 2:を含める
	 */
	searchByName: string;

	/** 明細作成未 */
	detailCreated:boolean = false;

	/** 明細作成あり */
	detailNone:boolean = false;

	/** 承認１ */
	approval_1:boolean = false;

	/** 承認２ */
	approval_2:boolean = false;
}

/**
 * 発注明細入力_承認処理テーブルの定義
 */
export interface ODIS0010OrderDetail {
    /** 物件管理番号 */
    propertyManagerCd: string;

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

}