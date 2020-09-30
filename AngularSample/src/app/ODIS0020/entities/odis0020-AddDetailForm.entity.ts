import { CommonComponent } from 'app/common/common.component';
import { Const } from 'app/common/const';
import { ODIS0020OrderShiwake } from './odis0020-OrderDetailList.entity';

/**
 * 発注明細に追加するの定義
 */
export class ODIS0020AddOrderDetail extends CommonComponent{

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

    shiwakeData: ODIS0020OrderShiwake;

    get isBlank (): boolean {
        if(this.journalCode      != '' ||
        this.accountCode         != '' ||
        this.journalName         != '' ||
        this.orderSupplierCode   != '' ||
        this.orderSupplierName   != '' ||
        this.orderPlanAmount     != ''
        ){
            return false;
        }
        return true;
    } 

    get journalCodeIsBlank(): boolean{
        if(this.journalCode != ''){
            return false;
        }
        return true;
    }

    get isUnchanged():boolean{
        if(this.journalCode      != this.shiwakeData.journalCode ||
        this.accountCode         != this.shiwakeData.accountCode ||
        this.journalName         != this.shiwakeData.journalName ||
        this.orderSupplierCode   != this.shiwakeData.orderSupplierCode||
        this.orderSupplierName   != this.shiwakeData.orderSupplierName ||
        this.removeCommas(this.orderPlanAmount) != this.shiwakeData.orderPlanAmount
        ){
            return false;
        }
        return true;
    }

    constructor() {
        super();
        this.Clear();
    }

    Clear(){
        this.journalCode        = '';
        this.accountCode        = '';
        this.journalName        = '';
        this.orderSupplierCode  = '';
        this.orderSupplierName  = '';
        this.orderPlanAmount    = '';
        this.shiwakeData        = new ODIS0020OrderShiwake();
    }

    setInput(input: ODIS0020OrderShiwake) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.journalCode       = input.journalCode;
        this.journalName       = input.journalName;
        this.accountCode       = input.accountCode;
        this.orderSupplierCode = input.orderSupplierCode;
        this.orderSupplierName = input.orderSupplierName;
        this.orderPlanAmount   = this.addCommas(input.orderPlanAmount);
        this.shiwakeData       = input;
    }

    /**
     * 
     * @param output 
     * @param key 
     * @param value 
     * @param action 
     */
    getInput(output: ODIS0020OrderShiwake[], key:number, value:number, action: string): ODIS0020OrderShiwake[]{

        output[key].journalCode       = this.journalCode;
        output[key].journalName       = this.journalName;
        output[key].accountCode       = this.accountCode;
        output[key].orderSupplierCode = this.orderSupplierCode;
        output[key].orderSupplierName = this.orderSupplierName;
        output[key].orderPlanAmount   = this.removeCommas(this.orderPlanAmount);
        switch(action){
            case Const.Action.A0001:
                output[key].orderSplitAmount   = '';
                output[key].comment            = '';
                output[key].requestDate        = '';
                output[key].requester          = '';
                output[key].approvalDate_lv1   = '';
                output[key].approvalPerson_lv1 = '';
                output[key].approvalDate_lv2   = '';
                output[key].approvalPerson_lv2 = '';
                output[key].orderDate          = '';
                output[key].orderAmount        = '';
                output[key].receivedDate       = '';
                output[key].receivedAmount     = '';
                output[key].paymentDate        = '';
                output[key].paymentAmount      = '';

                break;
            case Const.Action.A0002:
                // output[value].orderSplitAmount   = this.shiwakeData.orderSplitAmount;
                // output[value].comment            = this.shiwakeData.comment;
                // output[value].requestDate        = '';
                // output[value].requester          = '';
                // output[value].approvalDate_lv1   = this.shiwakeData.approvalDate_lv2;
                // output[value].approvalPerson_lv1 = this.shiwakeData.approvalDate_lv2;
                // output[value].approvalDate_lv2   = this.shiwakeData.approvalDate_lv2;
                // output[value].approvalPerson_lv2 = this.shiwakeData.approvalPerson_lv2;
                // output[value].orderDate          = this.shiwakeData.orderDate;
                // output[value].orderAmount        = this.shiwakeData.orderAmount;
                // output[value].receivedDate       = this.shiwakeData.receivedDate;
                // output[value].receivedAmount     = this.shiwakeData.receivedAmount;
                // output[value].paymentDate        = this.shiwakeData.paymentDate;
                // output[value].paymentAmount      = this.shiwakeData.paymentAmount;
                break;
        }
        return output;
    }

}