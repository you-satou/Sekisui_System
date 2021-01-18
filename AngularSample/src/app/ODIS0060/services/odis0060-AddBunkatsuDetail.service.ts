import { Const } from 'app/common/const';
import { CommonComponent } from 'app/common/common.component';
import { ODIS0060OrderDetailBunkatsu } from '../entities/odis0060-SplitDetail.entity';
import { ODIS0060SuchOAP } from '../entities/odis0060-SuchOAP.entity'

/**
 * 発注明細に追加サービス
 */
export class ODIS0060BunkatsuInsertService extends CommonComponent {

    /** 発注金額 */
    orderSplitAmount: string;

    /** 発注分割発注先コード */
    splitSupplierCode: string;

    /** 発注分割発注先名称 */
    splitSupplierName: string;

    splitOrderReceipt: string;

    /** 備考 */
    comment: string;

    /** 依頼日 */
    requestDate: string;

    /** 依頼者 */
    requester: string;

    /** 依頼者ID */
    requesterID: string;

    approvalDate_lv1: string;

    approvalPerson_lv1: string;
    
    approvalDate_lv2: string;

    approvalPerson_lv2: string;
    
    approvalDate_lv3: string;

    approvalPerson_lv3: string;

    approvalDate_final: string;

    approvalPerson_final: string;

    bunkatsu: ODIS0060OrderDetailBunkatsu;

    /**発注金額がないとき「True」を返却する */
    get amountIsBlank(): boolean {
        if (this.orderSplitAmount != '') {
            return false;
        }
        return true;
    }
    /**発注先コードがないとき「True」を返却する */
    get supplierCodeIsBlank(): boolean {
        if (this.splitSupplierCode != '') {
            return false;
        }
        return true;
    }

    get isChanged(){
        if (this.removeCommas(this.orderSplitAmount) != this.bunkatsu.orderSplitAmount ||
            this.splitSupplierCode != this.bunkatsu.splitSupplierCode ||
            this.splitSupplierName != this.bunkatsu.splitSupplierName ||
            this.comment != this.bunkatsu.comment ||
            this.requestDate != this.bunkatsu.requestDate ||
            this.requester != this.bunkatsu.requester ||
            this.requesterID != this.bunkatsu.requesterID ||
            this.splitOrderReceipt != this.bunkatsu.splitOrderReceipt) {
            return true;
        }
        return false;
    }

    /**
    * 分割明細に追加するサービス
    */
    constructor() {
        super();
        this.Clear();
    }

    public Clear() {

        this.orderSplitAmount = '';
        this.splitSupplierCode = '';
        this.splitSupplierName = '';
        this.splitOrderReceipt = '';
        this.comment = '';
        this.requestDate = '';
        this.requester = '';
        this.requesterID = '';
        this.approvalDate_lv1 = '';
        this.approvalDate_lv2 = '';
        this.approvalDate_lv3 = '';
        this.approvalDate_final = '';
        this.bunkatsu = null;
    }

    /**
     * 入力テーブルの表示する値を設定する
     * @param input 
     */
    public setInput(input: ODIS0060OrderDetailBunkatsu) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.orderSplitAmount     = this.addCommas(input.orderSplitAmount);
        this.splitOrderReceipt    = input.splitOrderReceipt;
        this.comment              = input.comment;
        this.requestDate          = input.requestDate;
        this.requester            = input.requester;
        this.requesterID          = input.requesterID;
        this.approvalDate_lv1     = input.approvalDate_lv1;
        this.approvalPerson_lv1   = input.approvalPerson_lv1;
        this.approvalDate_lv2     = input.approvalDate_lv2;
        this.approvalPerson_lv2   = input.approvalPerson_lv2;
        this.approvalDate_lv3     = input.approvalDate_lv3;
        this.approvalPerson_lv3   = input.approvalPerson_lv3;
        this.approvalDate_final   = input.approvalDate_final;
        this.approvalPerson_final = input.approvalPerson_final;
        this.splitSupplierCode    = input.splitSupplierCode;
        this.splitSupplierName    = input.splitSupplierName;

        //データを保持する
        this.bunkatsu = input;
    }

    /**
     * 明細追加サービスからデータを取得
     * @param output　返却データ 
     * @param action 追加・変更
     * @param rowIndex 行番号
     */
    public getInput(output: ODIS0060OrderDetailBunkatsu, action: string, res: ODIS0060SuchOAP): ODIS0060OrderDetailBunkatsu{
        output.orderSplitAmount  = this.removeCommas(this.orderSplitAmount);
        output.splitSupplierCode = this.setValue(this.splitSupplierCode);
        output.splitSupplierName = this.setValue(this.splitSupplierName);
        output.comment = this.setValue(this.comment);
        if(this.setValue(this.splitOrderReceipt) == ''){
            output.splitOrderReceipt = Const.OrderReceiptCheckType.UnCheck;
        } else {
            output.splitOrderReceipt = this.setValue(this.splitOrderReceipt);
        }
        switch(action){
            case Const.Action.A0001:
                output.requestDate          = this.setValue(this.requestDate);
                output.requester            = this.setValue(this.requester);
                output.requesterID          = this.setValue(this.requesterID);
                output.approvalDate_lv1     = '';
                output.approvalPerson_lv1   = '';
                output.approvalPersonID_lv1 = '';
                output.approvalDate_lv2     = '';
                output.approvalPerson_lv2   = '';
                output.approvalPersonID_lv2 = '';
                output.approvalDate_lv3     = '';
                output.approvalPerson_lv3   = '';
                output.approvalPersonID_lv3 = '';
                output.approvalDate_final   = '';
                output.approvalPerson_final = '';
                output.approvalPersonID_final = '';
                output.orderDate            = res.orderDate;
                output.orderAmount          = res.orderAmount;
                output.receivedDate         = res.receivedDate;
                output.receivedAmount       = res.receivedAmount;
                output.paymentDate          = res.paymentDate;
                output.paymentAmount        = res.paymentAmount;

                break;
            case Const.Action.A0002:
                if(output.requestDate ==''){
                    output.requestDate = this.setValue(this.requestDate);
                    output.requester   = this.setValue(this.requester);
                    output.requesterID = this.setValue(this.requesterID);
                }else{
                    output.requestDate = '';
                    output.requester   = '';
                    output.requesterID = '';
                }
                output.approvalDate_lv1       = this.bunkatsu.approvalDate_lv1;
                output.approvalPerson_lv1     = this.bunkatsu.approvalPerson_lv1;
                output.approvalPersonID_lv1   = this.bunkatsu.approvalPersonID_lv1;
                output.approvalDate_lv2       = this.bunkatsu.approvalDate_lv2;
                output.approvalPerson_lv2     = this.bunkatsu.approvalPerson_lv2;
                output.approvalPersonID_lv2   = this.bunkatsu.approvalPersonID_lv2;
                output.approvalDate_lv3       = this.bunkatsu.approvalDate_lv3;
                output.approvalPerson_lv3     = this.bunkatsu.approvalPerson_lv3;
                output.approvalPersonID_lv3   = this.bunkatsu.approvalPersonID_lv3;
                output.approvalDate_final     = this.bunkatsu.approvalDate_final;
                output.approvalPerson_final   = this.bunkatsu.approvalPerson_final;
                output.approvalPersonID_final = this.bunkatsu.approvalPersonID_final;
                output.orderDate              = res.orderDate;
                output.orderAmount            = res.orderAmount;
                output.receivedDate           = res.receivedDate;
                output.receivedAmount         = res.receivedAmount;
                output.paymentDate            = res.paymentDate;
                output.paymentAmount          = res.paymentAmount;
                
                break;
        }
        return output;
    }


}

export class ODIS0060RowStatus {

    /** 明細の位置 */
    rowIndex: number;

    /**明細を選択された */
    isSelected: boolean = false;

    /**明細を依頼済 */
    isRequested: boolean;

    /**明細を承認済 */
    isApproved: boolean;

    /** 選択された明細のステータス */
    constructor() {
        this.Reset();
    }

    public Reset() {
        this.rowIndex = null;
        this.isSelected = false;
    }

    /**
     * 明細ステータス
     * @param chosen 明細を選択するかどうか
     * @param rowIndex 選択されている行の位置
     */
    public setRowStatus(chosen: boolean, rowIndex: number) {
        this.rowIndex = rowIndex;
        this.isSelected = chosen;
    }
}