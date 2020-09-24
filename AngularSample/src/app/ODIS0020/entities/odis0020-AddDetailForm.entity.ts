import { CommonComponent } from 'app/common/common.component';

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
    }

    setInput(input: any) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.journalCode = input.comment;
        this.journalName = input.requestDate;
        this.accountCode = input.requestDate;
        this.orderSupplierCode = input.requestDate;
        this.orderSupplierName = input.requestDate;
        this.orderPlanAmount = this.addCommas(input.orderPlanAmount);
    }

    getInput(output: any): any{

        output.journalCode = this.journalCode;
        output.journalName = this.journalName;
        output.accountCode = this.accountCode;
        output.orderSupplierCode = this.orderSupplierCode;
        output.orderSupplierName = this.orderSupplierName;
        output.orderSplitAmount = this.removeCommas(this.orderPlanAmount);
        
        return output;
    }

}