import { ODIS0020AddOrderDetail } from './odis0020-AddDetailForm.entity';
import { ODIS0020OrderDetailList } from './odis0020-OrderDetailList.entity'
import { ODIS0020InsertedOrderEdaBan} from './odis0020-InsertedOrderEdaBan.entity'
import { ODIS0020MainOrderEdaBan } from './odis0020-MainOrderEdaBan.entity'
import { ODIS0020OrderDetailInputInformation } from './odis0020-OrderInfomation.entity'

/**
 * 発注明細入力＿詳細入力画面のデータ定義
 */
export interface ODIS0020OrderDetailTotalInfo{

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

} 
