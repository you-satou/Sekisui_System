/**
   * 発注承認者マスタのエンティティ
   */
export class OrderSplitApprovalMasterTable{

    /** 個人認証ＩＤ */
    personalID: string;

    /** 従業員コード */
    employeeCode: string;

    /** 発注先コード */
    employeeName: string;

    /** 発注先コード */
    approval1: string;

    /** 発注先コード */
    approval2: string;

    /** 発注先コード */
    deleteFlag: string;
}

export class DropDownList {
    /** value */
    id: string;

    /** text */
    text: string;
}