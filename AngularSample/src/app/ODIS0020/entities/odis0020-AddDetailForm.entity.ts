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
        if(this.journalCode != '' ||
        this.accountCode != '' ||
        this.journalName != '' ||
        this.orderSupplierCode != '' ||
        this.orderSupplierName != '' ||
        this.orderPlanAmount != ''
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
        if(this.journalCode != this.shiwakeData.journalCode ||
        this.accountCode != this.shiwakeData.accountCode ||
        this.journalName != this.shiwakeData.journalName ||
        this.orderSupplierCode != this.shiwakeData.orderSupplierCode||
        this.orderSupplierName != this.shiwakeData.orderSupplierName ||
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
        this.journalCode = '';
        this.accountCode = '';
        this.journalName = '';
        this.orderSupplierCode = '';
        this.orderSupplierName = '';
        this.orderPlanAmount = '';
        this.shiwakeData = new ODIS0020OrderShiwake();
    }

    setInput(input: ODIS0020OrderShiwake) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.journalCode = input.journalCode;
        this.journalName = input.journalName;
        this.accountCode = input.accountCode;
        this.orderSupplierCode = input.orderSupplierCode;
        this.orderSupplierName = input.orderSupplierName;
        this.orderPlanAmount = this.addCommas(input.orderPlanAmount);
        this.shiwakeData = input;
    }

    /**
     * 
     * @param output 
     * @param keyIndex 
     * @param valueIndex 
     * @param action 
     */
    getInput(output: ODIS0020OrderShiwake[], keyIndex:number, valueIndex:number, action: string): ODIS0020OrderShiwake[]{

        output[keyIndex].journalCode = this.journalCode;
        output[keyIndex].journalName = this.journalName;
        output[keyIndex].accountCode = this.accountCode;
        output[keyIndex].orderSupplierCode = this.orderSupplierCode;
        output[keyIndex].orderSupplierName = this.orderSupplierName;
        output[keyIndex].orderPlanAmount = this.removeCommas(this.orderPlanAmount);
        switch(action){
            case Const.Action.A0001:
                output[keyIndex].orderSplitAmount = '';
                output[keyIndex].comment = '';
                output[keyIndex].requestDate = '';
                output[keyIndex].requester = '';
                output[keyIndex].approvalDate_lv1 = '';
                output[keyIndex].approvalPerson_lv1 = '';
                output[keyIndex].approvalDate_lv2 = '';
                output[keyIndex].approvalPerson_lv2 = '';
                output[keyIndex].orderDate = '';
                output[keyIndex].orderAmount = '';
                output[keyIndex].receivedDate = '';
                output[keyIndex].receivedAmount = '';
                output[keyIndex].paymentDate = '';
                output[keyIndex].paymentAmount = '';

                break;
            case Const.Action.A0002:
                output[valueIndex].orderSplitAmount = this.shiwakeData.orderSplitAmount;
                output[valueIndex].comment = this.shiwakeData.comment;
                output[valueIndex].requestDate = '';
                output[valueIndex].requester = '';
                output[valueIndex].approvalDate_lv1 = this.shiwakeData.approvalDate_lv2;
                output[valueIndex].approvalPerson_lv1 = this.shiwakeData.approvalDate_lv2;
                output[valueIndex].approvalDate_lv2 = this.shiwakeData.approvalDate_lv2;
                output[valueIndex].approvalPerson_lv2 = this.shiwakeData.approvalPerson_lv2;
                output[valueIndex].orderDate = this.shiwakeData.orderDate;
                output[valueIndex].orderAmount = this.shiwakeData.orderAmount;
                output[valueIndex].receivedDate = this.shiwakeData.receivedDate;
                output[valueIndex].receivedAmount = this.shiwakeData.receivedAmount;
                output[valueIndex].paymentDate = this.shiwakeData.paymentDate;
                output[valueIndex].paymentAmount = this.shiwakeData.paymentAmount;
                break;
        }
        return output;
    }

}