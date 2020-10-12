import { CommonComponent } from 'app/common/common.component';
import { Const } from 'app/common/const';
import { ODIS0020OrderShiwake } from './odis0020-OrderDetailList.entity';
import { ODIS0020OrderDetaiSplitBean } from './odis0020-OrderDetailSplit.entity';

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

    shiwakeData: ODIS0020OrderDetaiSplitBean;

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
        this.shiwakeData        = new ODIS0020OrderDetaiSplitBean();
    }

    setInput(input: ODIS0020OrderDetaiSplitBean) {

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
    getInput(output: ODIS0020OrderDetaiSplitBean[], key:number): ODIS0020OrderDetaiSplitBean[]{
        
        // 発注連番に紐づくデータをすべて更新
        for(var i=0; i<output.length; i++){
            if(output[i].detailNo === output[key].detailNo){
                output[i].insKubun          = Const.InsKubun.Upd;
                output[i].journalCode       = this.journalCode;
                output[i].journalName       = this.journalName;
                output[i].accountCode       = this.accountCode;
                output[i].orderSupplierCode = this.orderSupplierCode;
                output[i].orderSupplierName = this.orderSupplierName;
                output[i].orderPlanAmount   = this.removeCommas(this.orderPlanAmount);
            }            
        }
        return output;
    }

}