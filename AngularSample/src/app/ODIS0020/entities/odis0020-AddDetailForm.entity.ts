import { CommonComponent } from 'app/common/common.component';
import { Const } from 'app/common/const';
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

    /** 受注管理枝番 */
    orderBranchNo: string;

    /** 注文書発行区分 */
    orderReceipt: string;

    /** 発注依頼日 */
    bulkRequestDate: string;

    /** 発注依頼者 */
    bulkRequester: string;

    /** 発注承認１日 */
    bulkApprovalDate_lv1: string;

    /** 発注承認１者 */
    bulkApprovalPerson_lv1: string;

    /** 発注承認２日 */
    bulkApprovalDate_lv2: string;

    /** 発注承認２者 */
    bulkApprovalPerson_lv2: string;

    /** 発注承認３日 */
    bulkApprovalDate_lv3: string;

    /** 発注承認３者 */
    bulkApprovalPerson_lv3: string;

    /** 発注最終承認日 */
    bulkApprovalDate_final: string;

    /** 発注最終承認者 */
    bulkApprovalPerson_final: string; 

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
        this.orderReceipt        != this.shiwakeData.orderReceipt ||
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
        this.orderBranchNo            = '';
        this.journalCode              = '';
        this.accountCode              = '';
        this.journalName              = '';
        this.orderSupplierCode        = '';
        this.orderSupplierName        = '';
        this.orderReceipt             = '0';
        this.orderPlanAmount          = '';
        this.bulkRequestDate          = '';
        this.bulkRequester            = '';
        this.bulkApprovalDate_lv1     = '';
        this.bulkApprovalPerson_lv1   = '';
        this.bulkApprovalDate_lv2     = '';
        this.bulkApprovalPerson_lv2   = '';
        this.bulkApprovalDate_lv3     = '';
        this.bulkApprovalPerson_lv3   = '';
        this.bulkApprovalDate_final   = '';
        this.bulkApprovalPerson_final = '';

        this.shiwakeData        = new ODIS0020OrderDetaiSplitBean();
    }

    setInput(input: ODIS0020OrderDetaiSplitBean) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.orderBranchNo      = input.orderBranchNo;
        this.journalCode        = input.journalCode;
        this.journalName        = input.journalName;
        this.accountCode        = input.accountCode;
        this.orderSupplierCode  = input.orderSupplierCode;
        this.orderSupplierName  = input.orderSupplierName;
        this.orderReceipt       = input.orderReceipt;
        this.orderPlanAmount    = this.addCommas(input.orderPlanAmount);
        this.bulkRequestDate    = input.bulkRequestDate;
        this.bulkRequester      = input.bulkRequester;
        this.bulkApprovalDate_lv1     = input.bulkApprovalDate_lv1;
        this.bulkApprovalPerson_lv1   = input.bulkApprovalPerson_lv1;
        this.bulkApprovalDate_lv2     = input.bulkApprovalDate_lv2;
        this.bulkApprovalPerson_lv2   = input.bulkApprovalPerson_lv2;
        this.bulkApprovalDate_lv3     = input.bulkApprovalDate_lv3;
        this.bulkApprovalPerson_lv3   = input.bulkApprovalPerson_lv3;
        this.bulkApprovalDate_final   = input.bulkApprovalDate_final;
        this.bulkApprovalPerson_final = input.bulkApprovalPerson_final;

        
        this.shiwakeData        = input;
    }

    /**
     * 
     * @param output 
     * @param key 
     * @param value 
     * @param action 
     */
    getInput(output: ODIS0020OrderDetaiSplitBean[], key:number, res: ODIS0020OrderDetaiSplitBean): ODIS0020OrderDetaiSplitBean[]{
        
        // 発注連番に紐づくデータをすべて更新
        for(var i=0; i<output.length; i++){
            if(output[i].detailNo === output[key].detailNo){
                
                // 登録区分 通常の場合に更新に変更する。
                if(output[i].insKubun === Const.InsKubun.Normal){
                    output[i].insKubun       = Const.InsKubun.Upd;
                }
                output[i].orderBranchNo      = this.orderBranchNo;
                output[i].journalCode        = this.journalCode;
                output[i].journalName        = this.journalName;
                output[i].accountCode        = this.accountCode;
                output[i].orderSupplierCode  = this.orderSupplierCode;
                output[i].orderSupplierName  = this.orderSupplierName;
                output[i].orderReceipt       = this.orderReceipt;
                output[i].orderPlanAmount    = this.removeCommas(this.orderPlanAmount);
                output[i].bulkRequestDate    = this.bulkRequestDate;
                output[i].bulkRequester      = this.bulkRequester;
                output[i].bulkApprovalDate_lv1     = this.bulkApprovalDate_lv1;
                output[i].bulkApprovalPerson_lv1   = this.bulkApprovalPerson_lv1;
                output[i].bulkApprovalDate_lv2     = this.bulkApprovalDate_lv2;
                output[i].bulkApprovalPerson_lv2   = this.bulkApprovalPerson_lv2;
                output[i].bulkApprovalDate_lv3     = this.bulkApprovalDate_lv3;
                output[i].bulkApprovalPerson_lv3   = this.bulkApprovalPerson_lv3;
                output[i].bulkApprovalDate_final   = this.bulkApprovalDate_final;
                output[i].bulkApprovalPerson_final = this.bulkApprovalPerson_final;
                output[i].orderDate = res.orderDate;
                output[i].orderAmount = res.orderAmount;
                output[i].receivedDate = res.receivedDate;
                output[i].receivedAmount = res.receivedAmount;
                output[i].paymentDate = res.paymentDate;
                output[i].paymentAmount = res.paymentAmount;
            }            
        }
        return output;
    }

}