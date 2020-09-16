//仕訳テーブルのインターフェース
export interface SplitOrderDetailShiwake{
    journalCode: string;
    accountCode: string;
    journalName: string;
    orderSuplierCode: string;
    orderSuplierName: string;
    orderPlanAmount: string;

}

//分割テーブルのインターフェース
export interface SplitOrderDetailSplit{
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
    
}