export class ODIS0080GrossProfitBean{


    /** 受注管理枝番 */
	manageBranchCd: string;

	/** 物件管理ＮＯ */
	propertyManageCd: string;

	/** 追加工事種類 */
	constructModel: string;

	/** 追加工事種類名 */
	constructModelName: string;

	/** 追加工事区分 */
	constructType: string;

	/** 追加工事区分_byte */
	constructTypeByte: string;

	/** 追加工事Ｂ区分 */
	constructBType: string;

    /** 受注管理枝番 */
	managerBranchCode: string;

	/** 枝番 */
	branchNo: string;

	/** 契約年月日 */
	contractYmd: string;

	/** 契約金額 */
	contractAmount: string;

	/** 契約金額２ */
	contractAmount2: string;

	/** 発注状況 */
	orderStatus: string;

	/** 売上状況 */
	salesStatus: string;

	/** 売上年月日 */
    salesYmd: string;
    
}

export class ODIS0080OrderInfoBean{
    
    /** 物件管理番号 */
    propertyManagerCd: string;

    /** 発注番号 */
    contractNum: string;

    /** 工事物件名カナ */
    constructionKata: string;

    /** 工事物件名漢字 */
    constructionHira: string;
}


export class ODIS0080InitParam{
    /** 物件管理番号 */
    propertyManagerCd: string;

    /** 事業所コード */
    officeCode: string;

    /** 発注番号 */
    contractNum: string;
}