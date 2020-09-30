/**
 * 発注承認者マスタ パラメータ
 */
export class ODIS0070Form{
    /** 事業区分コード */
    officeCode: string;

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

    /** 削除 */
    delFlag: string;
}