/**
   * 発注承認者マスタのエンティティ
   */
export class OrderSplitApprovalMasterTable{

    /** 個人認証ＩＤ */
    personalID: string;

    /** 従業員コード */
    employeeCode: string;

    /** 従業員名 */
    employeeName: string;

    /** 承認１ */
    approval1: string;

    /** 承認２ */
    approval2: string;

    /** 承認３ */
    approval3: string;

    /** 最終承認 */
    approvalLast: string;

    /** 削除フラグ */
    deleteFlag: string;
}

export class DropDownList {
    /** value */
    id: string;

    /** text */
    text: string;
}