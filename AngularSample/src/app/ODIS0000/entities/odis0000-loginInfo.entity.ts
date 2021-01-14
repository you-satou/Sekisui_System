export class LoginUserEntity {

	/** 個人認証ＩＤ */
	personAuthID: string;

	/** 従業員コード */
	empCd: string;

	/** 氏名漢字 */
	empNmKnj: string;

	/** 氏名カナ */
	empNmKana: string;

	/** 事業所コード */
	jgyshCd: string;

	/** 事業所コード１ */
	jgyshCd1: string;

	/** 事業所名 */
	jgyshNm: string;

	/** 事業所名略称 */
	jgyshShortNm: string;

	/** 所属コード */
	officeCd: string;

	/** 所属名 */
	officeNm: string;

	/** 所属名略称 */
	officeShortNm: string;

	/** ログイン担当者 */
	dbLoginStaffCd: string;

	/** ログイン所属会社コード */
	loginCompCd: string;

	/** 勘定年月 */
	loginKnjYm: string;

	/** 認証レベル */
	authLevel: string;

	/** 会社コード */
	compCd: string;

	/** トップメニューＩＤ */
	topMenuId: string;

    /** 承認１承認者 */
	approvalLv1: string;

    /** 承認２承認者 */
	approvalLv2: string;

    /** 承認３承認者 */
	approvalLv3: string;

    /** 最終承認者 */
	approvalFinal: string;

    /** 承認者数 */
	approvalUnit: string;
}
