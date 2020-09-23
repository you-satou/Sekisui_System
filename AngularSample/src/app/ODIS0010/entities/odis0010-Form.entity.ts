/**
 * 発注明細入力_承認処理フォームの定義
 */
export class ODIS0010Form{
    /** 事業区分コード */
    officeCode: string;
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes

    /** 契約番号From */
	contractNumFrom: string;

	/** 契約番号To */
	contractNumTo: string;

	/** 物件名 */
	propertyName: string;

    /** 物件名（ラジオボタン） */
    _checked: boolean;

	/** 物件名（区分）
	 * 1:で始まる
	 * 2:を含める
	 */
    searchByName: string;

	/** 明細作成未 */
	detailCreated: boolean;

	/** 明細作成あり */
	detailNone: boolean;

	/** 承認１ */
	approval_1: boolean;

	/** 承認２ */
	approval_2: boolean;
}