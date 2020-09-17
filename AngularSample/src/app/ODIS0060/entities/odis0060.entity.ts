//仕訳テーブルのインターフェース
export class SplitOrderDetailShiwake{
    tabIndex:string;
    id:string;
    journalCode: string;
    accountCode: string;
    journalName: string;
    orderSuplierCode: string;
    orderSuplierName: string;
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
    recievedDate: string;
    recievedAmount: string;
    paymentDate: string;
    paymentAmount: string;

    constructor() { }
}