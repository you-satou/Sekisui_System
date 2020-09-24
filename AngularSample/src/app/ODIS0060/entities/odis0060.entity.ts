//仕訳テーブルのインターフェース
export class SplitOrderDetailShiwake{
    tabIndex:string;
    id:string;
    journalCode: string;
    accountCode: string;
    journalName: string;
    orderSupplierCode: string;
    orderSupplierName: string;
    orderPlanAmount: string;
    constructor() { }

}

/**
   * 分割テーブルのインターフェース
   */
export class SplitOrderDetailSplit {
    orderPlanAmount: string;
    comment: string;
    requestDate: string;
    requester: string;
    approvalDate_lv1: string;
    approvalPerson_lv1: string;
    approvalDate_lv2: string;
    approvalPerson_lv2: string;
    orderDate: string;
    orderAmount: string;
    receivedDate: string;
    receivedAmount: string;
    paymentDate: string;
    paymentAmount: string;

    get isBlank(){
        if (this.orderPlanAmount == '' &&
            this.comment == '' &&
            this.requestDate == '' &&
            this.requester == '' &&
            this.approvalDate_lv1 == '' &&
            this.approvalPerson_lv1 == '' &&
            this.approvalDate_lv2 == '' &&
            this.approvalPerson_lv2 == '' && 
            this.orderDate == '' &&
            this.orderAmount == '' &&
            this.receivedDate == '' &&
            this.receivedAmount == '' &&
            this.paymentDate == '' &&
            this.paymentAmount == '') {
            return true;
        }
        return false;
    }

    constructor() { }
}