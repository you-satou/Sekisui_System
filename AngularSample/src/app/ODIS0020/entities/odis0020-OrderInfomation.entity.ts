/**
 * 発注明細 邸情報の定義
 */
export interface ODIS0020OrderDetailInputInformation {

    /** 物件管理番号 */
    propertyManagerCd: string;

    /** 得意先番号 */
    customerNum: string;

    /** 発注番号 */
    contractNum: string;

    /** 工事負担事業所コード */
    officeCode: string;

    /** 事業所名 */
    officeName: string;

    /** 営業担当コード */
    salesStaffCode: string;

    /** 営業担当名 */
    salesStaffName: string;

    /** 建築担当番号 */
    architectCode: string;

    /** 建築担当者 */
    architectName: string;

    /** 工事物件名カナ */
    constructionKata: string;

    /** 工事物件名漢字 */
    constructionHira: string;

    /** 契約書番号 */
    contractorCode: string;

    /** 契約者名漢字 */
    contractorName: string;

    /*-------------工事名のテーブルの定義---------------------*/

    /** NULL(固定) */
    planContractDate: string;

    /** 当初契約年月日 */
    perforContractDate: string;

    /** 工場オーダー予定日 */
    planDODate: string;

    /** 工場オーダー実績日 */
    perforDODate: string;

    /** 基礎着工予定日 */
    planStartDate: string;

    /** 基礎着工実績日 */
    perforStartDate: string;

    /** 外装材入荷予定日 */
    planArrivalDate: string;

    /** 外装材入荷実績日 */
    perforArrivalDate: string;

    /** 木工完了予定日 */
    planWoodWorkDate: string;

    /** 木工完了実績日 */
    perforWoodWorkDate: string;

    /** 総合検査予定日 */
    planInspectionDate: string;

    /** 総合検査実績日 */
    perforInspectionDate: string;

    /** 竣工検査予定日 */
    planCompletionInspection: string;

    /** 竣工検査実績日 */
    perforCompletionInspection: string;

    /** 建物引渡し予定日 */
    planHandingOver: string;

    /** 建物引渡し実績日 */
    perforHandingOver: string;


}