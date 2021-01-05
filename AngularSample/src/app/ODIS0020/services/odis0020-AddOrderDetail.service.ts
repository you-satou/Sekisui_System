import { CommonComponent } from 'app/common/common.component';
import { ODIS0020OrderDetaiSplitBean } from '../entities/odis0020-OrderDetailSplit.entity';

/**
 * 発注明細に追加するの定義
 */
export class ODIS0020AddOrderDetailService extends CommonComponent {

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

    /** 一時保持なデータ */
    tmpDt: ODIS0020OrderDetaiSplitBean;

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

    get isUnchanged(): boolean{
        if(this.journalCode      != this.tmpDt.journalCode ||
        this.accountCode         != this.tmpDt.accountCode ||
        this.journalName         != this.tmpDt.journalName ||
        this.orderSupplierCode   != this.tmpDt.orderSupplierCode||
        this.orderSupplierName   != this.tmpDt.orderSupplierName ||
        this.orderReceipt        != this.tmpDt.orderReceipt ||
        this.removeCommas(this.orderPlanAmount) != this.tmpDt.orderPlanAmount
        ){
            return false;
        }
        return true;
    }

    constructor() {
        super();
     }

    public Clear(): void{

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
        this.tmpDt                    = new ODIS0020OrderDetaiSplitBean();
    }

    public setInput(input: ODIS0020OrderDetaiSplitBean): void {
        this.tmpDt  = input;

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
        
    }

}