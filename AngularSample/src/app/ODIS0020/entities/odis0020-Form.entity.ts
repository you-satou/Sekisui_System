
import { ODIS0020InsertedOrderEdaBan} from './odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from './odis0020-MainOrderEdaBan.entity'
import { ODIS0020CustomerInfoBean, ODIS0020DateInfoBean } from './odis0020-OrderInformation.entity'
import { ODIS0020OrderDetaiSplitBean } from './odis0020-OrderDetailSplit.entity'

export class ODIS0020Session{

    /** 契約情報　*/
    customerInfo: ODIS0020CustomerInfoBean;

    /** 契約日付 */
    dateInfo: ODIS0020DateInfoBean;

    /** 本体受注枝番テーブル */
    mainOrderInfo: ODIS0020MainOrderEdaBan[];

    /** 追加工事受注枝番テーブル */
    insertedOrderInfo: ODIS0020InsertedOrderEdaBan[];

    /** 発注明細一覧 */
    orderDetailList: ODIS0020OrderDetaiSplitBean[];

    /** 設計データ */
    sekkeiData: ODIS0020OrderDetaiSplitBean[];

    /** 本体データ */
    hontaiData: ODIS0020OrderDetaiSplitBean[];

    /** 解体データ */
    kaitaiData: ODIS0020OrderDetaiSplitBean[];

    /** 追加データ */
    tsuikaData: ODIS0020OrderDetaiSplitBean[];

    /** 造園①データ */
    zouEn1Data: ODIS0020OrderDetaiSplitBean[];

    /** 造園②データ */
    zouEn2Data: ODIS0020OrderDetaiSplitBean[];

    /** パラメータ設定 */
    paramInit: ODIS0020Form;

    constructor() {}

}

export class ODIS0020Form{

    /** 物件管理Ｎｏ */
    propertyNo: string;

    /** 契約書番号 */
    contractNum: string;

    /** 仕訳コード */
    journalCode: string;

    /** 経理分類 */
    accountCode: string;

    /** 仕訳名称 */
    journalName: string;

    /** 発注先 コード */
    orderSupplierCode: string;

    /** 発注先名 */
    orderSupplierName: string;

}