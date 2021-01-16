/**
 * 発注明細入力_承認処理フォームの定義
 */
export class ODIS0010Form{

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
	_checked: boolean;

	/** 明細作成未 */
	detailCreated:boolean = false;

	/** 明細作成あり */
	detailNone:boolean = false;

	/** 承認１ */
	approvalLv1:boolean = false;

	/** 承認２ */
	approvalLv2:boolean = false;

	/** 承認３ */
	approvalLv3:boolean = false;

	/** 最終承認 */
	approvalFinal:boolean = false;
}
