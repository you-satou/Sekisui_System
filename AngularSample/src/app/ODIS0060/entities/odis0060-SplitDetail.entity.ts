/**
 * 仕訳テーブルの定義
 */
export class ODIS0060OrderShiwake {
    /** 登録区分 */
    insKubun: string = '';

    /** 物件管理Ｎｏ */
    propertyNo: string;

    /** 明細種類 */
    detailKind: string;

    /** 明細連番 */
    detailNo: string;

    /** 受注管理枝番 */
    orderBranchNo: string = '';

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

    /** 注文書発行区分 */
    orderReceipt: string = '';

    /** 発注予定金額 */
    orderPlanAmount: string;

    /** 発注依頼日 */
    bulkRequestDate: string = '';

    /** 発注依頼者 */
    bulkRequester: string = '';

    /** 発注依頼者ID */
    bulkRequesterID: string = '';

    /** 発注承認１日 */
    bulkApprovalDate_lv1: string = '';

    /** 発注承認１者 */
    bulkApprovalPerson_lv1: string = '';

    /** 発注承認１者ID */
    bulkApprovalPersonID_lv1: string = '';

    /** 発注承認２日 */
    bulkApprovalDate_lv2: string = '';

    /** 発注承認２者 */
    bulkApprovalPerson_lv2: string = '';

    /** 発注承認２者ID */
    bulkApprovalPersonID_lv2: string = '';

    /** 発注承認３日 */
    bulkApprovalDate_lv3: string = '';

    /** 発注承認３者 */
    bulkApprovalPerson_lv3: string = '';

    /** 発注承認３者ID */
    bulkApprovalPersonID_lv3: string = '';

    /** 発注最終承認日 */
    bulkApprovalDate_final: string = '';

    /** 発注最終承認者 */
    bulkApprovalPerson_final: string = '';

    /** 発注最終承認者ID */
    bulkApprovalPersonID_final: string = '';

    constructor() { }

}

/**
 * 分割テーブルの定義
 */
export class ODIS0060OrderDetailBunkatsu {
    
    /** 分割連番 */
    splitNo: string;

    /** 発注予定分割金額 */
    orderSplitAmount: string;

    /** 発注分割発注先コード */
    splitSupplierCode: string;

    /** 発注分割発注先名称*/
    splitSupplierName: string;

    /** 分割注文書発行区分 */
    splitOrderReceipt: string;

    /** コメント */
    comment: string;

    /** 依頼日 */
    requestDate: string = '';

    /** 依頼者 */
    requester: string = '';

    /** 依頼者ID */
    requesterID: string = '';

    /** 承認日 一回目 */
    approvalDate_lv1: string = '';

    /** 承認者 一回目 */
    approvalPerson_lv1: string = '';

    /** 承認者ID 一回目 */
    approvalPersonID_lv1: string = '';

    /** 承認日 ニ回目 */
    approvalDate_lv2: string = '';

    /** 承認者 ニ回目 */
    approvalPerson_lv2: string = '';

    /** 承認者ID ニ回目 */
    approvalPersonID_lv2: string = '';

    /** 承認日 三回目 */
    approvalDate_lv3: string = '';

    /** 承認者 三回目*/
    approvalPerson_lv3: string = '';

    /** 承認者ID 三回目 */
    approvalPersonID_lv3: string = '';

    /** 最終承認日 */
    approvalDate_final: string = '';

    /** 最終承認者*/
    approvalPerson_final: string = '';

    /** 最終承認者ID*/
    approvalPersonID_final: string = '';

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

    constructor() { }

}

/**
 * 分割明細画面のデータがセッションに保持する用のクラス
 */
export class ODIS0060Session {

    /**仕訳データ */
    shiwakeData: ODIS0060OrderShiwake[];

    /**分割データ */
    bunkatsuData: ODIS0060OrderDetailBunkatsu[];

    constructor() { }
}