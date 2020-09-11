/**
 * 発注明細に追加するの定義
 */
export class ODIS0020AddOrderDetail {

    /** 仕訳コード */
    journalCode: string;

    /** 経理分類 */
    accountCode: string;

    /** 仕訳名称 */
    journalName: string;

    /** 発注先 コード */
    orderSuplierCode: string;

    /** 発注先名 */
    orderSuplierName: string;

    /** 発注予定金額 */
    orderPlanAmount: string;

    // /** コメント */
    // comment: string;

    // /** 発注予定分割金額 */
    // orderSplitAmount: string;

    // /** 依頼日 */
    // requestDate: string;

    // /** 依頼者 */
    // requester: string;

    // /** 承認日 一回目 */
    // approvalDate_lv1: string;

    // /** 承認者 一回目 */
    // approvalPerson_lv1: string;

    // /** 承認日 ニ回目 */
    // approvalDate_lv2: string;

    // /** 承認者 ニ回目*/
    // approvalPerson_lv2: string;

    // /** 発注年月日 */
    // orderDate: string;

    // /** 発注金額 */
    // orderAmount: string;

    // /** 受入年月日 */
    // recievedDate: string;

    // /** 受入金額 */
    // recievedAmount: string;

    // /** 支払年月日 */
    // paymentDate: string;

    // /** 支払金額 */
    // paymentAmount: string;


    get isBlank (): boolean {
        if(this.journalCode == ''&&
        this.accountCode == '' &&
        this.journalName == '' &&
        this.orderSuplierCode == '' &&
        this.orderSuplierName == '' &&
        this.orderPlanAmount == ''
        ){
            return true;
        }else{
            return false;
        }
        
    } 

    


    constructor() {}

    Clear(){

        this.journalCode = '';
        this.accountCode = '';
        this.journalName = '';
        this.orderSuplierCode = '';
        this.orderSuplierName = '';
        this.orderPlanAmount = '';
        // this._isBlank = true;
    }

}