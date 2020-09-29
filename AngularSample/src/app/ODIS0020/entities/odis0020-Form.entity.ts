import { ODIS0020OrderDetailList, ODIS0020OrderShiwake } from './odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan} from './odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from './odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from './odis0020-OrderInformation.entity'

/**
 * 発注明細入力＿詳細入力画面のデータ定義
 */
export class ODIS0020OrderDetailTotalInfo{

    /** 発注明細 邸情報　*/
    ContractInfo: ODIS0020OrderDetailInputInformation[];

    /** 本体受注枝番テーブル */
    MainOrderInfo: ODIS0020MainOrderEdaBan[];

    /** 追加工事受注枝番テーブル */
    InsertedOrderInfo: ODIS0020InsertedOrderEdaBan[];

    /** 設計のデータ */
    SekkeiData: ODIS0020OrderDetailList[];

    /** 本体のデータ */
    HontaiData: ODIS0020OrderDetailList[];

    /** 追加のデータ */
    TsuikaData: ODIS0020OrderDetailList[]

    constructor() {}

}

export class ODIS0020Session{

    /** 発注明細 邸情報　*/
    ContractInfo: ODIS0020OrderDetailInputInformation[];

    /** 本体受注枝番テーブル */
    MainOrderInfo: ODIS0020MainOrderEdaBan[];

    /** 追加工事受注枝番テーブル */
    InsertedOrderInfo: ODIS0020InsertedOrderEdaBan[];

    /** 設計のデータ */
    SekkeiData: ODIS0020OrderShiwake[];

    /** 本体のデータ */
    HontaiData: ODIS0020OrderShiwake[];

    /** 追加のデータ */
    TsuikaData: ODIS0020OrderShiwake[]

    constructor() {}

}

export class ODIS0020Form{

    /** 事業区分コード */
    officeCode: string;

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

    /** 発注予定金額 */
    orderPlanAmount: string;
} 
