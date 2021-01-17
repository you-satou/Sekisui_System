import { ODIS0020OrderDetaiSplitBean } from './odis0020-OrderDetailSplit.entity'
/**
 * 発注明細 更新情報
 */
export class ODIS0020UpdForm{
    /** 物件管理ＮＯ */
    propertyNo: string;

    /** 管理事業所コード */
	officeCode: string;

	/** 契約番号 */
	contractNum: string;

	/** 承認者数 */
    approvalLevels: string;
    
    /** 従業員名称 */
    userName: string;

    /** アクセストークン */
    token: string;
	
    /** 発注明細データ */
    orderDetailList: ODIS0020OrderDetaiSplitBean[];
}