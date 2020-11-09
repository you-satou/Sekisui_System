import { Const } from 'app/common/const';
import { CommonComponent } from 'app/common/common.component';
import { ODIS0060OrderDetailBunkatsu } from '../entities/odis0060-SplitDetail.entity';

/**
 * 発注明細に追加サービス
 */
export class ODIS0020BunkatsuInsertService extends CommonComponent {

    /** 発注金額 */
    orderSplitAmount: string;

    /** 発注分割発注先コード */
    splitSupplierCode: string;

    /** 発注分割発注先名称 */
    splitSupplierName: string;

    /** 備考 */
    comment: string;

    /** 依頼日 */
    requestDate: string;

    /** 依頼者 */
    requester: string;

    bunkatsu: ODIS0060OrderDetailBunkatsu;

    /**未入力の場合、「True」を返却する */
    get isBlank(): boolean {
        if (this.orderSplitAmount != '' ||
            this.splitSupplierCode != '' ||
            this.splitSupplierName != '' ||
            this.comment != '' ||
            this.requestDate != '' ||
            this.requester != ''
        ) {
            return false;
        }
        return true;
    }
    /**発注金額がないとき「True」を返却する */
    get amountIsBlank(): boolean {
        if (this.orderSplitAmount != '') {
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
            this.requester != this.bunkatsu.requester) {

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

    Clear() {
        this.orderSplitAmount = '';
        this.splitSupplierCode = '';
        this.splitSupplierName = '';
        this.comment = '';
        this.requestDate = '';
        this.requester = '';
        this.bunkatsu = null;
    }

    /**
     * 入力テーブルの表示する値を設定する
     * @param input 
     */
    setInput(input: ODIS0060OrderDetailBunkatsu) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.orderSplitAmount = this.addCommas(input.orderSplitAmount);
        this.comment = input.comment;
        this.requestDate = input.requestDate;
        this.requester = input.requester;
        this.splitSupplierCode = input.splitSupplierCode;
        this.splitSupplierName = input.splitSupplierName;

        //データを保持する
        this.bunkatsu = input;
    }

    /**
     * 明細追加サービスからデータを取得
     * @param output　返却データ 
     * @param action 追加・変更
     * @param rowIndex 行番号
     */
    getInput(output: ODIS0060OrderDetailBunkatsu, action: string): ODIS0060OrderDetailBunkatsu{
        output.orderSplitAmount = this.removeCommas(this.orderSplitAmount);
        output.splitSupplierCode = this.setValue(this.splitSupplierCode);
        output.splitSupplierName = this.setValue(this.splitSupplierName);
        output.comment = this.setValue(this.comment);
        switch(action){
            case Const.Action.A0001:
                output.requestDate = this.setValue(this.requestDate);
                output.requester = this.setValue(this.requester);
                output.approvalDate_lv1 = '';
                output.approvalPerson_lv1 = '';
                output.approvalDate_lv2 = '';
                output.approvalPerson_lv2 = '';
                output.approvalDate_lv3 = '';
                output.approvalPerson_lv3 = '';
                output.approvalDate_final = '';
                output.approvalPerson_final = '';
                output.orderDate = '';
                output.orderAmount = '';
                output.receivedDate = '';
                output.receivedAmount = '';
                output.paymentDate = '';
                output.paymentAmount = '';

                break;
            case Const.Action.A0002:
                if(output.requestDate ==''){
                    output.requestDate = this.setValue(this.requestDate);
                    output.requester = this.setValue(this.requester);
                }else{
                    output.requestDate = '';
                    output.requester = '';
                }
                output.approvalDate_lv1 = this.bunkatsu.approvalDate_lv2;
                output.approvalPerson_lv1 = this.bunkatsu.approvalDate_lv2;
                output.approvalDate_lv2 = this.bunkatsu.approvalDate_lv2;
                output.approvalPerson_lv2 = this.bunkatsu.approvalPerson_lv2;
                output.approvalDate_lv3 = this.bunkatsu.approvalDate_lv3;
                output.approvalPerson_lv3 = this.bunkatsu.approvalPerson_lv3;
                output.approvalDate_final = this.bunkatsu.approvalDate_final;
                output.approvalPerson_final = this.bunkatsu.approvalPerson_final;
                output.orderDate = this.bunkatsu.orderDate;
                output.orderAmount = this.bunkatsu.orderAmount;
                output.receivedDate = this.bunkatsu.receivedDate;
                output.receivedAmount = this.bunkatsu.receivedAmount;
                output.paymentDate = this.bunkatsu.paymentDate;
                output.paymentAmount = this.bunkatsu.paymentAmount;
                break;
        }
        return output
    }


}

export class RowStatus {

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

    Reset() {
        this.rowIndex = null;
        this.isSelected = false;
    }

    /**
     * 明細ステータス
     * @param chosen 明細を選択するかどうか
     * @param rowIndex 選択されている行の位置
     */
    setRowStatus(chosen: boolean, rowIndex: number) {
        this.rowIndex = rowIndex;
        this.isSelected = chosen;
    }
}