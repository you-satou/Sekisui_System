import { ODIS0020OrderDetailList } from './odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan} from './odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from './odis0020-MainOrderEdaBan.entity'
import { ODIS0020CustomerInfoBean, ODIS0020DateInfoBean } from './odis0020-OrderInformation.entity'
import { ODIS0020OrderDetaiSplitBean } from './odis0020-OrderDetailSplit.entity'

/**
 * 発注明細入力＿詳細入力画面のデータ定義
 */
export class ODIS0020OrderDetailTotalInfo{

    /** 契約情報　*/
    custmerInfo: ODIS0020CustomerInfoBean;

    /** 契約日付 */
    dateInfo: ODIS0020DateInfoBean;

    /** 本体受注枝番テーブル */
    mainOrderInfo: ODIS0020MainOrderEdaBan[];

    /** 追加工事受注枝番テーブル */
    insertedOrderInfo: ODIS0020InsertedOrderEdaBan[];

    /** 発注明細一覧 */
    orderDetailList: ODIS0020OrderDetaiSplitBean[];

    /** 設計のデータ */
    SekkeiData: ODIS0020OrderDetailList[];

    /** 本体のデータ */
    HontaiData: ODIS0020OrderDetailList[];

    /** 追加のデータ */
    TsuikaData: ODIS0020OrderDetailList[]

    constructor() {}

}