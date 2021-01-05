export interface LoginUserInterface {
    
    /** 個人認証ＩＤ */
    personAuthID: String;

    /** 従業員コード */
    empCd: String;

    /** 氏名漢字 */
    empNmKnj: String;

    /** 氏名カナ */
    empNmKana: String;

    /** 事業所コード */
    jgyshCd: String;

    /** 事業所コード１ */
    jgyshCd1: String;

    /** 事業所名 */
    jgyshNm: String;

    /** 事業所名略称 */
    jgyshShortNm: String;

    /** 所属コード */
    officeCd: String;

    /** 所属名 */
    officeNm: String;

    /** 所属名略称 */
    officeShortNm: String;

    /** ログイン担当者 */
    dbLoginStaffCd: String;

    /** ログイン所属会社コード */
    loginCompCd: String;

    /** 勘定年月 */
    loginKnjYm: String;

    /** 認証レベル */
    authLevel: String;

    /** 会社コード */
    compCd: String;

    /** トップメニューＩＤ */
    topMenuId: String;

}