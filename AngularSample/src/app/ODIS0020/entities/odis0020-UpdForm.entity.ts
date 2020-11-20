import { ODIS0020OrderDetaiSplitBean } from './odis0020-OrderDetailSplit.entity'
/**
 * 発注明細 更新情報
 */
export class ODIS0020UpdForm{
    /** 物件管理ＮＯ */
    propertyNo: string;

    // 2020/11/20 帳票出力対応 Add Start
	/** 管理事業所コード */
	officeCode: string;

	/** 契約番号 */
	contractNum: string;

	/** 承認者数*/
	approvalLevels: string;
	// 2020/11/20 帳票出力対応 End Start
    
    /** 発注明細データ */
    orderDetailList: ODIS0020OrderDetaiSplitBean[];
}